import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import type { NodeExecutor } from "@/inngest/lib/types";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(stripeTriggerChannel().status({ nodeId, status: "loading" }));

  const result = await step.run("stripe-trigger", async () => context);

  await publish(stripeTriggerChannel().status({ nodeId, status: "success" }));

  return result;
};
