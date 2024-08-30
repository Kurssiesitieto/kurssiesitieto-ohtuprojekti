import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from "reactflow";
import "../styles/graph.css";
import "reactflow/dist/style.css";
import { getLayoutedElements } from "../utils/layout";
import CustomEdge from "../styles/CustomEdge.jsx";

const CourseGraph = ({
  axiosInstance,
  courses,
  setIsSidebarOpen,
  setSelectedCourseName,
  setSelectedCourseGroupID,
  savePositions,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const prevNumNodesRef = useRef(nodes);

  const onLayout = useCallback(
    (newNodes, newEdges) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [setNodes, setEdges]
  );

  useEffect(() => {
    if (!courses || courses.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const newNodes = courses
      .map((course) => course.createNode())
      .filter((node) => node && node.id);
    const newEdges = courses
      .flatMap((course) => {
        return course.createEdges().map((edge) => ({
          ...edge,
        }));
      })
      .filter((edge) => edge && edge.id);

    prevNumNodesRef.current = nodes;
    setNodes(newNodes);
    setEdges(newEdges);

    if (
      newNodes.length > 0 &&
      (newNodes[0].position.x === null ||
        newNodes[0].position.x === undefined) &&
      (newNodes[0].position.y === null || newNodes[0].position.y === undefined)
    ) {
      onLayout(newNodes, newEdges);
    }
  }, [courses, onLayout, setNodes, setEdges]);

  useEffect(() => {
    if (reactflowInstance && nodes.length > 0) {
      if (
        prevNumNodesRef.current.length === nodes.length &&
        (prevNumNodesRef.current[0]?.id === nodes[0]?.id ||
          prevNumNodesRef === true)
      ) {
        return;
      }
      reactflowInstance.fitView();
    }
  }, [nodes, reactflowInstance]);

  useEffect(() => {
    getLayoutedElements(nodes, edges);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = async (event, node) => {
    if (setIsSidebarOpen === undefined) {
      return;
    }
    setSelectedCourseName(node.data.name);
    setSelectedCourseGroupID(node.data.groupID);
    setIsSidebarOpen(true);
  };

  const disabled = true;

  const onSave = useCallback(() => {
    if (reactflowInstance) {
      const flow = reactflowInstance.toObject();
      const positions = flow.nodes.map((node) => {
        return { id: node.id, position: node.position };
      });
      savePositions(positions);
    }
  });

  useEffect(() => {
    if (savePositions === undefined) {
      return;
    }
    onSave();
  }, [nodes]);

  // Get the value of the CSS variable
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundColor = rootStyles
    .getPropertyValue("--background-color")
    .trim();

  return (
    <div className="reactflow-wrapper">
      <CustomEdge />
      <ReactFlow
        minZoom={0.01}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onInit={setReactflowInstance}
        snapToGrid={true}
        snapGrid={[180, 180]}
        edgesUpdatable={!disabled}
        edgesFocusable={!disabled}
        nodesDraggable={!disabled}
        nodesConnectable={!disabled}
        nodesFocusable={!disabled}
        draggable={!disabled}
        elementsSelectable={!disabled}
      >
        <Controls />
        <Background color={backgroundColor} gap={32} />
      </ReactFlow>
    </div>
  );
};

export default CourseGraph;
