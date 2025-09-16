import React from "react";
import { Collapse } from "@mui/material";

interface AdditionalFieldSetProps {
  label: string;
  children: React.ReactNode;
  show?: boolean;
}

export const AdditionalFieldSet: React.FC<AdditionalFieldSetProps> = ({
  label,
  children,
  show = true
}) => {
  return (
    <Collapse in={show} timeout={300}>
      <div>
        <label className="text-lg font-medium text-gray-900 block mb-2">{label}</label>
        <div className="flex-grow">{children}</div>
      </div>
    </Collapse>
  );
};
