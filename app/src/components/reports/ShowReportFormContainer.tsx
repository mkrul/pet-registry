import React from "react";
import { IReport } from "../../types/Report";
import { useLocation, useNavigate } from "react-router-dom";
import EditReportForm from "./EditReportForm";

interface ShowReportFormContainerProps {
  report: IReport;
  errors?: string[];
}

const ShowReportFormContainer: React.FC<ShowReportFormContainerProps> = ({ report, errors }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (location.state?.isNewReport) {
      navigate("/reports"); // Go to reports index without params
    } else {
      // Existing back navigation logic
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto p-4 w-full md:w-[50rem] lg:w-[50rem]">
      {errors && errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">
            {errors.length} error(s) prohibited this report from being saved:
          </strong>
          <ul className="mt-2 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <EditReportForm report={report} errors={errors} />
    </div>
  );
};

export default ShowReportFormContainer;
