/**
 * Mobile API Client for TrustLabel Mobile App
 * Connects directly to deployed Render backend: https://safefood.onrender.com
 */

export const API_BASE = 'https://safefood.onrender.com/api/v1';

export async function loginApi(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
  return json;
}

export async function registerApi({ name, email, password, role = 'citizen', district = 'DHULE' }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
      role: role === 'officer' ? 'officer' : 'citizen',
      district: district ? district.trim().toUpperCase() : 'DHULE',
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || json?.message || 'Registration failed. Please check details.';
    throw new Error(message);
  }
  return json;
}
