import React from 'react';
import { ReportProps } from '../../reports/types/Report';
import ItemPreview from '../../../shared/components/common/ItemPreview';
import StatusPill from '../../../shared/components/common/StatusPill';

interface ReportPreviewProps {
  report: ReportProps;
  onClick: (report: ReportProps) => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, onClick }) => {
  const getStatusPill = () => {
    if (report.status === 'archived') {
      return <StatusPill status="Archived" variant="default" />;
    }
    return <StatusPill status="Active" variant="info" />;
  };

  return (
    <ItemPreview
      item={report}
      onClick={onClick}
      imageUrl={report.image?.variantUrl}
      title={report.title}
      statusPill={getStatusPill()}
      isArchived={report.status === 'archived'}
    />
  );
};

export default ReportPreview;
