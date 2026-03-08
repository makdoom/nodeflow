import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import type { NodeExecutor } from "@/inngest/lib/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
  publish,
}) => {
  await publish(manualTriggerChannel().status({ nodeId, status: "loading" }));

  const result = await step.run("manual-trigger", async () => context);

  await publish(manualTriggerChannel().status({ nodeId, status: "success" }));

  return result;
};
