"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenaiFormValues, OpenaiDialog } from "./dialog";
import { useNodeStatus } from "@/hooks/use-node-status";
import { fetchOpenaiRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { useTheme } from "next-themes";

type OpenaiNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenaiNodeType = Node<OpenaiNodeData>;

export const OpenaiNode = memo((props: NodeProps<OpenaiNodeType>) => {
  const { resolvedTheme } = useTheme();
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: props.id,
    channel: OPENAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenaiRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData.userPrompt
    ? `gpt-4 : ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const handleOpenSetting = () => setDialogOpen(true);

  const handleSubmit = (values: OpenaiFormValues) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id == props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }

        return node;
      }),
    );
  };

  return (
    <>
      <OpenaiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={
          resolvedTheme == "dark"
            ? "/logos/openai-white-icon.svg"
            : "/logos/openai-dark-icon.svg"
        }
        name="Open AI"
        description={description}
        status={status}
        onSetting={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
      />
    </>
  );
});

OpenaiNode.displayName = "OpenaiNode";
