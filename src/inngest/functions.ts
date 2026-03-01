import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const goolge = createGoogleGenerativeAI();
const openAi = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: goolge("gemini-3-flash-preview"),
        system:
          "You are a helpful assistant that helps users with their questions.",
        prompt: "what is the capital of France?",
      },
    );

    const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openAi("gpt-5"),
        system:
          "You are a helpful assistant that helps users with their questions.",
        prompt: "what is the capital of France?",
      },
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-5-sonnet-preview"),
        system:
          "You are a helpful assistant that helps users with their questions.",
        prompt: "what is the capital of France?",
      },
    );

    return {
      geminSteps,
      openAiSteps,
      anthropicSteps,
    };
  },
);
