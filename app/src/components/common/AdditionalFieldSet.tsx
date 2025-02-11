import React from "react";
import { Collapse } from "@mui/material";
import { RemoveFieldButton } from "./RemoveFieldButton";

interface AdditionalFieldSetProps {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
  testId: string;
  children: React.ReactNode;
  show?: boolean;
}

export const AdditionalFieldSet: React.FC<AdditionalFieldSetProps> = ({
  label,
  onRemove,
  disabled = false,
  testId,
  children,
  show = true
}) => {
  return (
    <Collapse in={show} timeout={300}>
      <div>
        <label className="text-lg font-medium text-gray-900 block mb-2">{label}</label>
        <div className="flex items-center gap-4">
          <div className="flex-grow">{children}</div>
          <RemoveFieldButton onClick={onRemove} disabled={disabled} testId={testId} />
        </div>
      </div>
    </Collapse>
  );
};
