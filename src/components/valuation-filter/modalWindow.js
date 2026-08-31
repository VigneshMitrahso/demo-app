import React, { useState } from "react";

const CustomModal = ({
  children,
  title = "Top 10 Recent Transactions (Distance Range &lt; 5km)",
}) => {
  const [isShow, setShow] = useState(false);
  return (
    <>
      <div
        onClick={() => {
          setShow(true);
        }}
        className="expand-button"
      >
        Expand
      </div>
      <>{children}</>
      {isShow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="table-header">
              <div className="normal-text">{title}</div>
              <div
                onClick={() => {
                  setShow(false);
                }}
                className="expand-button"
              >
                {"Collapse"}
              </div>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
