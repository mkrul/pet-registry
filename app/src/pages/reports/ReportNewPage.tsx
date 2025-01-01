import NewReportForm from "../../components/reports/new/NewReportForm";

const ReportNewPage = () => {
  return (
    <div className="container mx-auto p-4 w-full lg:w-[40rem]" data-testid="report-new">
      <h1 className="text-3xl font-bold text-blue-600 mt-3 mb-6">Report a Lost Pet</h1>
      <NewReportForm />
    </div>
  );
};

export default ReportNewPage;
