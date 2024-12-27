import React from "react";
import { BasicInfoFields } from "./BasicInfoFields";
import { LocationDisplay } from "./LocationDisplay";
import { IReportForm } from "../../types/Report";

interface ReportViewModeProps {
  formData: IReportForm;
}

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
