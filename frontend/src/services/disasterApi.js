const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/disaster';

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail = payload?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          : `Server returned status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export const analyzeRisk = (district, condition) =>
  postJson('/analyze', { district, condition });

export const askDisasterQuestion = (question, district) =>
  postJson('/chat', { question, district: district || null });
