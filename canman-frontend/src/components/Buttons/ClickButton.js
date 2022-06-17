import React from "react";

function ClickButton({ handler, children }) {
  return (
    <>
      <button
        className="btn btn-primary border-0"
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          backgroundColor: "#43B0EF",
          padding: "6px 24px",
        }}
        onClick={handler}
      >
        {children}
      </button>
    </>
  );
}

export default ClickButton;
