import React from "react";
import "../styles/InfoButton.css";

function InfoButton({ onClick }) {
  return (
    <button onClick={onClick} className="info-button">
      INFO
    </button>
  );
}

export default InfoButton;
