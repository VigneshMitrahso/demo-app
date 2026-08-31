import React, { useState } from "react";

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const togglePopover = (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    setPosition({ x: posX, y: posY });
    setIsOpen(!isOpen);
  };

  return (
    <div className="popover-containers">
      <div className="truncate-text" onClick={togglePopover}>
        {children}
      </div>
      {isOpen && (
        <div className="popovers" style={{ top: position.y, left: position.x }}>
          <p>Popover Content</p>
        </div>
      )}
    </div>
  );
};

export default Popover;
