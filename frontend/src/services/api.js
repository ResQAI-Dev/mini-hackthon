const API_BASE_URL = "http://127.0.0.1:8000";

export async function createDisasterReport(reportData) {
  const response = await fetch(`${API_BASE_URL}/api/disaster-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to submit disaster report");
  }

  return data;
}

export async function getDisasterReports() {
  const response = await fetch(`${API_BASE_URL}/api/disaster-report`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load disaster reports");
  }

  return data;
}