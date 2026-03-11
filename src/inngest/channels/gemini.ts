import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const GEMINI_CHANNEL_NAME = "gemini-execution";

export const geminiChannel = channel(GEMINI_CHANNEL_NAME).addTopic(
  topic("status").type<StatusType>(),
);
