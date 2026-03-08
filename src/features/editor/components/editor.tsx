"use client";

import { ErrorView, LoadingView } from "@/components/entity-component";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import { useTheme } from "next-themes";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../stores/atom";
import { NodeType } from "@/generated/prisma/enums";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => <LoadingView message="Loading editor ..." />;
export const EditorError = () => (
  <ErrorView message="Error loading editor ..." />
);

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { resolvedTheme } = useTheme();
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);
  const [mounted, setMounted] = useState(false);
  const setEditor = useSetAtom(editorAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, []);

  if (!mounted) return null;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeComponents}
      onInit={setEditor}
      fitView
      colorMode={resolvedTheme === "dark" ? "dark" : "light"}
      proOptions={{ hideAttribution: true }}
      snapGrid={[10, 10]}
      snapToGrid
      panOnScroll
      panOnDrag={false}
      selectionOnDrag
    >
      <Background />
      <Controls />
      <MiniMap />
      <Panel position="top-right">
        <AddNodeButton />
      </Panel>
      {hasManualTrigger && (
        <Panel position="bottom-center">
          <ExecuteWorkflowButton workflowId={workflowId} />
        </Panel>
      )}
    </ReactFlow>
  );
};
