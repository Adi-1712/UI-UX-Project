export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('Missing VITE_API_BASE_URL (set it in frontend/.env)');
  }
  const base = API_BASE_URL.replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${base}/${p}`;
}

