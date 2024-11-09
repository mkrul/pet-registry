import React from "react";
import { IReport } from "../../types/reports/Report";
import { Link } from "react-router-dom";
import EditReportForm from "./EditReportForm";

interface ShowReportFormContainerProps {
  report: IReport;
  errors?: string[]; // Ensure the 'errors' prop is included here
}

const ShowReportFormContainer: React.FC<ShowReportFormContainerProps> = ({ report, errors }) => {
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
      <div className="flex justify-end">
        <Link
          to="/reports"
          className="ml-4 mb-4 px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
        >
          Back to Reports
        </Link>
      </div>
      <EditReportForm report={report} errors={errors} />
    </div>
  );
};

export default ShowReportFormContainer;
