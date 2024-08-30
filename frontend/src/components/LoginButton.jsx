import React from "react";
import "../styles/LoginButton.css";

function LoginButton({ onClick }) {
  return (
    <button onClick={onClick} className="login-button">
      Kirjaudu sisään
    </button>
  );
}

export default LoginButton;
