import React from "react";

interface TipProps {
  children: React.ReactNode;
  emoji?: string;
  showTipLabel?: boolean;
}

const Tip: React.FC<TipProps> = ({ children, emoji = "💡", showTipLabel = true }) => {
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
