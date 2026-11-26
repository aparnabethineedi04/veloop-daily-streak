import axios from 'axios';

const TOKEN_KEY = 'veloop_token';
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('veloop:logout'));
    }
    return Promise.reject(err);
  }
);

/** Turns any failure into a safe { code, message } - raw Axios/Mongo errors never reach the UI. */
export function toApiError(err) {
  const data = err?.response?.data;
  if (data?.code) return { code: data.code, message: data.message, nextClaimAt: data.nextClaimAt };
  if (err?.code === 'ECONNABORTED' || !err?.response) {
    return { code: 'NETWORK', message: 'Unable to reach the server. Please check your connection and try again.' };
  }
  return { code: 'SERVER_ERROR', message: 'Unable to process your reward. Please try again.' };
}

export default api;
