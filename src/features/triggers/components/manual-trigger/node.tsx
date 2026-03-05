import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../trigger-execution-node";
import { LuMousePointer2 } from "react-icons/lu";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      id={props.id}
      name="Manual Trigger"
      icon={LuMousePointer2}
      description="Execute Workflow"
    />
  );
});
