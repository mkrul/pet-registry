import NewReportForm from "../../components/reports/forms/NewReportForm";
import { useGetNewReportQuery } from "../../redux/features/reports/reportsApi";
import ComponentLoader from "../../components/common/ComponentLoader";

const ReportNewPage = () => {
  const { isLoading } = useGetNewReportQuery();

  // Loading state handled automatically by Redux

  return (
    <ComponentLoader>
      <div className="container mx-auto p-4 w-full lg:w-[40rem]" data-testid="report-new">
        <h1 className="text-3xl font-bold text-blue-600 mt-3 mb-6">Report a Lost Pet</h1>
        <NewReportForm />
      </div>
    </ComponentLoader>
  );
};

export default ReportNewPage;
