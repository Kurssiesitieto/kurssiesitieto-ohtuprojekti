// IGNORED IN JEST CONFIG //

const CustomEdge = () => (
  <svg style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}>
    <defs>
      <marker
        id="custom-arrow-mandatory"
        viewBox="0 0 10 10"
        markerWidth="12"
        markerHeight="12"
        refX="5"
        refY="5"
        orient="auto-start-reverse"
        markerUnits="userSpaceOnUse"
      >
        <path d="M 0 0 L 10 5 L 0 10 Z" fill="white" />
      </marker>
      <marker
        id="custom-arrow-optional"
        viewBox="0 0 10 10"
        markerWidth="12"
        markerHeight="12"
        refX="5"
        refY="5"
        orient="auto-start-reverse"
        markerUnits="userSpaceOnUse"
      >
        <path d="M 0 0 L 10 5 L 0 10 Z" fill="lightsteelblue" />
      </marker>
    </defs>
  </svg>
);

export default CustomEdge;
