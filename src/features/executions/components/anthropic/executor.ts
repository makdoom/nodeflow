import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { anthropicChannel } from "@/inngest/channels/anthropic";

type AnthropicData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(anthropicChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "Anthropic node is not configured with a variable name",
    );
  }

  if (!data.userPrompt) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "Anthropic node is not configured with a user prompt",
    );
  }

  // TODO: credential is missing

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credentials
  const credentialValue = process.env.ANTHROPIC_API_KEY!;

  const anthropic = createAnthropic({ apiKey: credentialValue });

  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-opus-4-0"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type == "text" ? steps[0].content[0].text : "";

    await publish(anthropicChannel().status({ nodeId, status: "success" }));
    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(anthropicChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
