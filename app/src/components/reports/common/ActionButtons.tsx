import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../common/Spinner";

interface ActionButtonsProps {
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSaving, onSave, onCancel }) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="submit"
        disabled={isSaving}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <div className="flex items-center">
            <Spinner inline size={16} className="mr-2" color="text-white" />
            Saving...
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="px-4 py-2 border border-blue-500 bg-white text-blue-600 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>
  );
};

export default ActionButtons;
