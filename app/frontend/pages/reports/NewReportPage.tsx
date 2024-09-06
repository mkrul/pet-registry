import React from "react";
import LostPetReportForm from "../../components/reports/LostPetReportForm";

const NewReportPage = () => {
  return (
    <div className="container mx-auto p-4 w-full lg:w-[40rem]">
      <h1 className="text-3xl font-bold text-blue-600 mt-3 mb-6">
        Report a Lost Pet
      </h1>
      <LostPetReportForm />
    </div>
  );
};

export default NewReportPage;
