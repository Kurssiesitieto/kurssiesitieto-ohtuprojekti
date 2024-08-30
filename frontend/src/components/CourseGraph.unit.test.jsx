import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CourseGraph from "./CourseGraph";
import { getLayoutedElements } from "../utils/layout";

// Mock the dependencies
vi.mock("reactflow", async () => {
  const actual = await vi.importActual("reactflow");
  return {
    __esModule: true,
    ...actual,
    ReactFlow: ({ children, ...props }) => <div {...props}>{children}</div>,
    Controls: () => <div>Controls</div>,
    Background: () => <div>Background</div>,
  };
});

vi.mock("../utils/layout", () => {
  return {
    getLayoutedElements: vi.fn(),
  };
});

vi.mock("../styles/CustomEdge.jsx", () => {
  return {
    __esModule: true,
    default: () => <div>CustomEdge</div>,
  };
});

const mockCourses = [
  {
    id: "1",
    createNode: vi.fn(() => ({
      id: "1",
      position: { x: null, y: null },
      data: { name: "Course 1", groupID: "group1" },
    })),
    createEdges: vi.fn(() => [{ id: "e1-2", source: "1", target: "2" }]),
  },
  {
    id: "2",
    createNode: vi.fn(() => ({
      id: "2",
      position: { x: null, y: null },
      data: { name: "Course 2", groupID: "group2" },
    })),
    createEdges: vi.fn(() => []),
  },
];

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

describe("CourseGraph", () => {
  beforeEach(() => {
    getLayoutedElements.mockReturnValue({
      nodes: mockCourses.map((course) => course.createNode()),
      edges: mockCourses.flatMap((course) => course.createEdges()),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders CourseGraph correctly", () => {
    render(
      <CourseGraph
        axiosInstance={vi.fn()}
        courses={mockCourses}
        setIsSidebarOpen={vi.fn()}
        setSelectedCourseName={vi.fn()}
        setSelectedCourseGroupID={vi.fn()}
        savePositions={vi.fn()}
      />
    );

    expect(screen.getByText("Controls")).toBeInTheDocument();
    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("CustomEdge")).toBeInTheDocument();
  });
});
