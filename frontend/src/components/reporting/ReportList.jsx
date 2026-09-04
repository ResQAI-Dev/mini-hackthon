import { useEffect, useState } from "react";

import {
  getDisasterReports,
  updateDisasterReportStatus,
} from "../../services/api";

function ReportList({ refreshTrigger }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getDisasterReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);

      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to load disaster reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  const handleStatusChange = async (reportId, status) => {
    try {
      await updateDisasterReportStatus(
        reportId,
        status
      );

      await fetchReports();
    } catch (error) {
      console.error(
        "Failed to update report status:",
        error
      );

      alert("Failed to update report status.");
    }
  };

  if (loading) {
    return (
      <p className="py-8 text-center text-gray-500">
        Loading disaster reports...
      </p>
    );
  }

  return (
    <section className="pb-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Disaster Reports
        </h2>

        <button
          type="button"
          onClick={fetchReports}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Refresh Reports
        </button>
      </div>

      {errorMessage && (
        <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {reports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-gray-500">
          No disaster reports found.
        </p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {report.disaster_type}
                </h3>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {report.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-800">
                    Location:
                  </strong>{" "}
                  {report.location}
                </p>

                <p>
                  <strong className="text-gray-800">
                    Severity:
                  </strong>{" "}
                  {report.severity}
                </p>

                <p>
                  <strong className="text-gray-800">
                    Status:
                  </strong>{" "}
                  {report.status}
                </p>

                <p>
                  <strong className="text-gray-800">
                    Description:
                  </strong>{" "}
                  {report.description}
                </p>

                <p>
                  <strong className="text-gray-800">
                    Coordinates:
                  </strong>{" "}
                  {report.latitude}, {report.longitude}
                </p>

                {report.affected_people !== null &&
                  report.affected_people !== undefined && (
                    <p>
                      <strong className="text-gray-800">
                        Affected People:
                      </strong>{" "}
                      {report.affected_people}
                    </p>
                  )}

                {report.contact_number && (
                  <p>
                    <strong className="text-gray-800">
                      Contact:
                    </strong>{" "}
                    {report.contact_number}
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-gray-200 pt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Update Status:
                </label>

                <select
                  value={report.status}
                  onChange={(event) =>
                    handleStatusChange(
                      report.id,
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-auto"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Verified">
                    Verified
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReportList;