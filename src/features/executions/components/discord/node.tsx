"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordFormValues, DiscordDialog } from "./dialog";
import { useNodeStatus } from "@/hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
  username?: string;
  webhookURL?: string;
  content?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData.content
    ? `Send : ${nodeData.content.slice(0, 50)}...`
    : "Not Configured";

  const handleOpenSetting = () => setDialogOpen(true);

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logos/discord-icon.svg"
        name="Discord"
        description={description}
        status={status}
        onSetting={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
