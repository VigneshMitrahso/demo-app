import React, { useState } from "react";

const CustomAccordian = ({
  title = "",
  toOpen = false,
  children,
  background,
  isRapid,
  propertyType,
  unitType,
}) => {
  const [isOpen, setOpen] = useState(toOpen);
  return (
    <div className="acc-container">
      {isRapid ? (
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className={`acc-title ${background && `acc-background`}`}
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ marginRight: isRapid ? 10 : 0 }}
              className={!isOpen ? "image-normal" : "image-rotate"}
              src={require("../../assets/images/right-arrow.png")}
            />
            <div>{title}</div>
          </div>
          <div style={{ fontSize: 12 }}>
            Property type : {propertyType || ""}
            <span style={{ marginLeft: "11px !important" }}>
              Unit type : {unitType || ""}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`acc-title ${background && `acc-background`}`}
          onClick={() => {
            setOpen(!isOpen);
          }}
        >
          <img
            className={!isOpen ? "image-normal" : "image-rotate"}
            src={require("../../assets/images/right-arrow.png")}
          />
          <div>{title}</div>
        </div>
      )}
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default CustomAccordian;
