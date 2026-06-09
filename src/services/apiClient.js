import { AUTH_STORAGE_KEY } from "@/constants";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

class ApiClientError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    return parsedUser?.token || "";
  } catch {
    return "";
  }
}

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const authToken = token === undefined ? getStoredToken() : token;
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiClientError(responseBody?.message || "API request failed.", response.status);
  }

  if (!responseBody) {
    throw new ApiClientError("API returned an invalid response.", response.status);
  }

  return responseBody;
}

export { ApiClientError, apiRequest };
