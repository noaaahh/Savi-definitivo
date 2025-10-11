// Central API configuration for the frontend
const DEFAULT_BASE = 'http://localhost:3000';

export const API_CONFIG = {
  BASE_URL: (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || DEFAULT_BASE,
  // backward compatibility
  baseUrl: (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) || DEFAULT_BASE
};

export function buildApiUrl(path = '') {
  const base = API_CONFIG.BASE_URL || API_CONFIG.baseUrl || DEFAULT_BASE;
  // ensure no double slashes
  if (!path) return base;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export default API_CONFIG;
