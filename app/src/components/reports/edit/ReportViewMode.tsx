import React from "react";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { LocationDisplay } from "../form/LocationDisplay";
import { ReportViewModeProps } from "../../../types/Report";

export const ReportViewMode: React.FC<ReportViewModeProps> = ({ formData }) => (
  <>
    <BasicInfoFields formData={formData} readOnly />
    <LocationDisplay
      area={formData.area || ""}
      state={formData.state || ""}
      country={formData.country || ""}
    />
    {/* Other read-only displays */}
  </>
);
