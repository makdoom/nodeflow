"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { IoGlobeOutline } from "react-icons/io5";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = "initial";

  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "Not Configured";

  const handleOpenSetting = () => setDialogOpen(true);

  const handleSubmit = (values: HttpRequestFormValues) => {
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
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={IoGlobeOutline}
        name="HTTP Request"
        description={description}
        status={status}
        onSetting={handleOpenSetting}
        onDoubleClick={handleOpenSetting}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
