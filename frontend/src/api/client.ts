import axios from 'axios';

// Pointing to your FastAPI server URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

export const startAnalysis = async (data: { location_name: string; latitude: number; longitude: number; radius_km: number; start_year: number; end_year: number }) => {
  const response = await api.post('/analysis', data);
  return response.data;
};

export const getJobStatus = async (id: string) => {
  const response = await api.get(`/analysis/${id}/status`);
  return response.data;
};

export const getAnalysisResult = async (id: string) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};