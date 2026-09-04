import { useState } from "react";
import DisasterReportForm from "../components/reporting/DisasterReportForm";
import ReportList from "../components/reporting/ReportList";

function ReportingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReportCreated = () => {
    setRefreshTrigger((previous) => previous + 1);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Disaster Reporting</h1>
      <p className="page-subtitle">
        Submit and monitor community disaster reports in your area.
      </p>

      <DisasterReportForm
        onReportCreated={handleReportCreated}
      />

      <ReportList
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}

export default ReportingPage;
