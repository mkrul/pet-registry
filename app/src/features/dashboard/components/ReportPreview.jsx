import React from 'react';
import ItemPreview from '../../../shared/components/common/ItemPreview.jsx';
import StatusPill from '../../../shared/components/common/StatusPill.jsx';

const ReportPreview = ({ report, onClick }) => {
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
