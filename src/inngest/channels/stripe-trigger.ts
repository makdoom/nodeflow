import { channel, topic } from "@inngest/realtime";

type StatusType = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-execution";

export const stripeTriggerChannel = channel(
  STRIPE_TRIGGER_CHANNEL_NAME,
).addTopic(topic("status").type<StatusType>());
