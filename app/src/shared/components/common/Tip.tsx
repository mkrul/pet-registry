import React from "react";

const Tip = ({ children, emoji = "💡", showTipLabel = true }) => {
  return (
    <div className="leading-none">
      <span className="text-sm text-gray-500 font-semibold mr-1">
        {emoji} {showTipLabel && "TIP:"}
      </span>{" "}
      <span className="text-sm text-gray-500">{children}</span>
    </div>
  );
};

export default Tip;
