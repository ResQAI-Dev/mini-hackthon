import { useState } from "react";

import DisasterReportForm from
  "../components/reporting/DisasterReportForm";

import ReportList from
  "../components/reporting/ReportList";


function ReportingPage() {
  const [refreshTrigger, setRefreshTrigger] =
    useState(0);

  const handleReportCreated = () => {
    setRefreshTrigger(
      (previous) => previous + 1
    );
  };

  return (
    <main
      className="mx-auto max-w-[1000px] p-5"
    >
      <h1 className="mb-6 text-3xl font-bold">
        Disaster Reporting
      </h1>

      <DisasterReportForm
        onReportCreated={
          handleReportCreated
        }
      />

      <hr className="my-8 border-gray-300" />

      <ReportList
        refreshTrigger={refreshTrigger}
      />
    </main>
  );
}

export default ReportingPage;