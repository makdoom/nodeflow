import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";

export const topologiacalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  if (connections.length === 0) return nodes;

  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // Connection as self-edges
  const connectedNodeIds = new Set<string>();
  for (let connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  for (let node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);

    // Remove duplicated (self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Cyclic dependency detected in workflow nodes");
    }

    throw error;
  }

  // Map sorted node IDs back to nodes
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((nodeId) => nodeMap.get(nodeId)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  return inngest.send({ name: "workflow/execute.workflow", data });
};
