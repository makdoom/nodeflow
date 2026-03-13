import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

type SlackData = {
  variableName?: string;
  webhookURL?: string;
  content?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(slackChannel().status({ nodeId, status: "loading" }));

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.variableName) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Slack node is not configured with a variable name",
        );
      }

      if (!data.webhookURL) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Slack node is not configured with a Webhook URL",
        );
      }

      if (!data.content) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError(
          "Slack node is not configured with message content",
        );
      }

      await ky.post(data.webhookURL, {
        json: {
          text: content,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          discordMessageSent: true,
          messageContent: content,
        },
      };
    });

    await publish(slackChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(slackChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
