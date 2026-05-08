const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchWithAuth(endpoint: string, options: any = {}) {
  const token = localStorage.getItem("token"); // Get the token saved during login

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Attach the token here
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If token is expired, send user back to login
    window.location.href = "/login";
  }

  return response.json();
}