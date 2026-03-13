import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";

type DiscordData = {
  variableName?: string;
  username?: string;
  webhookURL?: string;
  content?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(discordChannel().status({ nodeId, status: "loading" }));

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.variableName) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Discord node is not configured with a variable name",
        );
      }

      if (!data.webhookURL) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Discord node is not configured with a Webhook URL",
        );
      }

      if (!data.content) {
        await publish(discordChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Discord node is not configured with message content",
        );
      }

      await ky.post(data.webhookURL, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          discordMessageSent: true,
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(discordChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(discordChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
