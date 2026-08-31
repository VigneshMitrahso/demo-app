import React from "react";
import "./styles.css";

const Ringing = () => {
  return (
    <div className="main-container-ring">
      <p className="message-text">Ringing...</p>
      <label className={"loader-circle"}></label>
    </div>
  );
};

export default Ringing;
