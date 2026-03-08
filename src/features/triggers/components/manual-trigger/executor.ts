import type { NodeExecutor } from "@/inngest/lib/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  nodeId,
  step,
}) => {
  // TODO: publish loading state
  const result = await step.run("manual-trigger", async () => context);

  // TODO: publish success state with result

  return result;
};
