import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";
export const manualTriggerChannel = channel(
  MANUAL_TRIGGER_CHANNEL_NAME,
).addTopic(topic("status").type<StatusType>());
