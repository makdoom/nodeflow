import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const ANTHROPIC_CHANNEL_NAME = "anthropic-execution";

export const anthropicChannel = channel(ANTHROPIC_CHANNEL_NAME).addTopic(
  topic("status").type<StatusType>(),
);
