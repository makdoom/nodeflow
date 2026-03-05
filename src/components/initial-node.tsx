"use client";

import { NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { IoIosAddCircleOutline } from "react-icons/io";
import { memo, useState } from "react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="flex items-center justify-center cursor-pointer">
            <IoIosAddCircleOutline size={18} />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
