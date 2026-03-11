import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const OPENAI_CHANNEL_NAME = "openai-execution";

export const openaiChannel = channel(OPENAI_CHANNEL_NAME).addTopic(
  topic("status").type<StatusType>(),
);
