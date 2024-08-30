import React from "react";
import "../styles/LogoutButton.css";

function LogoutButton({ onClick }) {
  return (
    <button onClick={onClick} className="logout-button">
      Kirjaudu ulos
    </button>
  );
}

export default LogoutButton;
