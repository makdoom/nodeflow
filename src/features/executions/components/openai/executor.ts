import type { NodeExecutor } from "@/inngest/lib/types";
import { NonRetriableError } from "inngest";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

type OpenaiData = {
  variableName?: string;
  systemPrompt?: string;
  credentialId?: string;
  userPrompt?: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

export const openaiExecutor: NodeExecutor<OpenaiData> = async ({
  data,
  context,
  nodeId,
  userId,
  step,
  publish,
}) => {
  await publish(openaiChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "OpenAI node is not configured with a variable name",
    );
  }

  if (!data.credentialId) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "Anthropic node is not configured with a credential",
    );
  }

  if (!data.userPrompt) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "OpenAI node is not configured with a user prompt",
    );
  }

  // TODO: credential is missing

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId },
    });
  });

  if (!credential) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Anthropic node credential not found");
  }

  const openAi = createOpenAI({ apiKey: decrypt(credential.value) });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openAi("gpt-4"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type == "text" ? steps[0].content[0].text : "";

    await publish(openaiChannel().status({ nodeId, status: "success" }));
    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(openaiChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
