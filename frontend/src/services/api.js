const API_BASE_URL = "http://127.0.0.1:8000";

const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return { data };
  },

  async post(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return { data };
  },
};

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
    throw new Error(data.detail || "Failed to create report");
  }

  return data;
}

export async function getDisasterReports() {
  const response = await fetch(`${API_BASE_URL}/api/disaster-report`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch reports");
  }

  return data;
}

export async function updateDisasterReportStatus(reportId, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/disaster-report/${reportId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update report status");
  }

  return data;
}

export default api;
