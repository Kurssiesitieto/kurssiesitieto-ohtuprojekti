import React from "react";
import "../styles/AddStudyPlansButton.css";

function AddStudyPlansButton({ onClick }) {
  return (
    <button onClick={onClick} className="add-study-plans-button">
      Lisää kurssikokonaisuus
    </button>
  );
}

export default AddStudyPlansButton;
