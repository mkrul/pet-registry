import React from "react";
import Spinner from "./Spinner";
import { SubmitButtonProps } from "../../../../shared/types/common/SubmitButton";

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  text = "Submit",
  loadingText = "Submitting..."
}) => {
  return (
    <button
      type="submit"
      className={`w-fit inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          {loadingText}
          <Spinner inline size={16} className="ml-2" color="text-white" />
        </>
      ) : (
        text
      )}
    </button>
  );
};
