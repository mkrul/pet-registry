import React from "react";

interface TipProps {
  children: React.ReactNode;
}

const Tip: React.FC<TipProps> = ({ children }) => {
  return (
    <div>
      <span className="text-sm text-gray-500 font-semibold">💡 TIP:</span>{" "}
      <span className="text-sm text-gray-500">{children}</span>
    </div>
  );
};

export default Tip;
