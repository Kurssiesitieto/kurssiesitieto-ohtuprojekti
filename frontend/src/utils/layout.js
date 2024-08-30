// IGNORED IN JEST CONFIG //

import dagre from "dagre";

export const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction,
    ranksep: 200, // Increase the distance between layers
    nodesep: 50, // Increase the distance between nodes within the same layer
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 200, height: 50 });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWithPosition.width / 2,
      y: nodeWithPosition.y - nodeWithPosition.height / 2,
    };
  });

  return { nodes, edges };
};
