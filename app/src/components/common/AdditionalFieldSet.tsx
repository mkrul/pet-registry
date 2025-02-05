import React from "react";
import { RemoveFieldButton } from "./RemoveFieldButton";

interface AdditionalFieldSetProps {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
  testId: string;
  children: React.ReactNode;
}

export const AdditionalFieldSet: React.FC<AdditionalFieldSetProps> = ({
  label,
  onRemove,
  disabled = false,
  testId,
  children
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-lg font-medium text-gray-900">{label}</label>
        <RemoveFieldButton onClick={onRemove} disabled={disabled} testId={testId} />
      </div>
      {children}
    </div>
  );
};
