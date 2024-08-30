import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../styles/MessagerComponent.css";
import { subscribeToMessages } from "./messager";

const Messenger = () => {
  const [message, setMessage] = useState({ text: "", type: "", key: 0 });

  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessage) => {
      setMessage((prevState) => ({
        ...newMessage,
        key: prevState.key + 1, // Increment key to force re-render
      }));
    });
    return () => unsubscribe();
  }, []);

  const messageClass = `messenger ${
    message.type === "error" ? "messenger-error" : "messenger-info"
  }`;

  if (!message.text) return null;

  return ReactDOM.createPortal(
    // Use the message's unique key to force the animation to restart
    <div key={message.key} className={messageClass}>
      {message.text}
    </div>,
    document.body
  );
};

export default Messenger;
