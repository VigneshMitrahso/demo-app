import React from "react";
import "./map.css";

const MarkerText = (props) => {
  const { color, name, id } = props;
  return (
    <div
      className="marker"
      style={{ backgroundColor: color, cursor: "pointer" }}
    >
      <label>{name}</label>
    </div>
  );
};

export default MarkerText;
