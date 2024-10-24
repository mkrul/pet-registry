import { Link } from "react-router-dom";
import { IReport } from "../../types/reports/Report";
import formatDate from "../../lib/formatDate";
interface ReportProps {
  report: IReport;
}

const ReportCard = ({ report }: ReportProps) => {
  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      <Link to={`/reports/${report.id}`} className="block">
        <div className="p-4 bg-white rounded-lg flex w-full">
          <div className="flex-shrink-0">
            {report.image && (
              <img
                src={report.image.thumbnailUrl}
                alt={report.title}
                className="w-48 h-48 object-cover report__image"
              />
            )}
          </div>
          <div className="flex flex-col justify-between h-full report__title">
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <div className="text-gray-500 text-sm mt-2">Mebane, North Carolina</div>
            {report.createdAt !== report.updatedAt && (
              <div className="text-gray-500 text-sm mt-2">
                Updated: {formatDate(report.updatedAt)}
              </div>
            )}
            <div className="text-gray-500 text-md mt-2">
              {report.description.length > 100
                ? `${report.description.substring(0, 100)}...`
                : report.description}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportCard;
