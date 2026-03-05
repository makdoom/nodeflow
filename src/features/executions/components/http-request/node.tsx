"use client";

import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { IoGlobeOutline } from "react-icons/io5";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
    : "Not Configured";
  return (
    <BaseExecutionNode
      {...props}
      id={props.id}
      icon={IoGlobeOutline}
      name="HTTP Request"
      description={description}
      onSetting={() => {}}
      onDoubleClick={() => {}}
    />
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
