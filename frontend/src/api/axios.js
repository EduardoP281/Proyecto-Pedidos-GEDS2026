import axios from 'axios';

const DEFAULT_API_URL = 'https://backend-development-8ce5.up.railway.app/api';

const normalizeApiBaseUrl = (value) => {
  if (!value) return '';

  let normalized = value.trim();

  if (normalized.startsWith('[') && normalized.includes('](')) {
    normalized = normalized.slice(1, normalized.indexOf(']('));
  } else if (normalized.startsWith('[') && normalized.endsWith(']')) {
    normalized = normalized.slice(1, -1);
  }

  if (normalized.startsWith('(') && normalized.endsWith(')')) {
    normalized = normalized.slice(1, -1);
  }

  return normalized.replace(/\/+$/, '');
};

const getApiBaseUrl = () => {
  const envUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

  if (envUrl) {
    return envUrl;
  }

  return DEFAULT_API_URL;
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;