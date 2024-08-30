// IGNORED IN JEST CONFIG //

import {
  mandatoryCourse,
  optionalCourse,
  alternativeCourse,
  completedCourse,
  mandatoryEdge,
  optionalEdge,
} from "../styles/courseStyles";

export default class Course {
  constructor(
    name,
    identifier,
    groupID,
    dependencies = [],
    courseType = "optional",
    description = "",
    x,
    y
  ) {
    this.name = name;
    this.identifier = identifier;
    this.groupId = groupID;
    this.dependencies = dependencies;
    this.courseType = courseType;
    this.description = description;
    this.position = { x, y };
  }

  createNode() {
    const nodeStyles = {
      compulsory: mandatoryCourse,
      optional: optionalCourse,
      completed: completedCourse,
      alternative: alternativeCourse,
    };
    const selectedNodeStyle = nodeStyles[this.courseType] || optionalCourse;

    return {
      id: this.identifier,
      position: this.position,
      data: {
        label: `${this.name} (${this.identifier})`,
        description: `${this.description}`,
        name: `${this.name}`,
        identifier: `${this.identifier}`,
        groupID: `${this.groupId}`,
      },

      style: selectedNodeStyle,
    };
  }

  createEdges() {
    const edgeStyles = {
      compulsory: mandatoryEdge,
      optional: optionalEdge,
    };
    const selectedEdgeStyle = edgeStyles[this.courseType] || optionalEdge;

    return this.dependencies.map((dep) => ({
      id: `e-${this.identifier}-${dep}`,
      source: this.identifier,
      target: dep,
      style: selectedEdgeStyle,
    }));
  }
}
