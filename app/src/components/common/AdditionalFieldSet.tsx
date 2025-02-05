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
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2 mt-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex-grow">{children}</div>
        <RemoveFieldButton
          onClick={onRemove}
          disabled={disabled}
          testId={testId}
          ariaLabel={`Remove ${label}`}
        />
      </div>
    </div>
  );
};
