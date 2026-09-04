import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/disaster';

export const analyzeRisk = async (district, condition) => {
  const response = await axios.post(`${API_BASE_URL}/analyze`, { district, condition });
  return response.data;
};

export const askDisasterQuestion = async (question, district) => {
  const response = await axios.post(`${API_BASE_URL}/chat`, { question, district });
  return response.data;
};