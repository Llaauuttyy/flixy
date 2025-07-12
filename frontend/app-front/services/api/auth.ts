import type { LoginCredentials, PasswordData, RegistrationData } from "./types";
import { getAccessToken } from "./utils";

export async function handleLogin(credentials: LoginCredentials) {
  const response = await fetch(process.env.VITE_API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handleRegistration(userData: RegistrationData) {
  const response = await fetch(process.env.VITE_API_URL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json.id;
}

export async function handlePasswordChange(
  userData: PasswordData,
  request: Request
) {
  const token = await getAccessToken(request);

  const response = await fetch(process.env.VITE_API_URL + "/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }
}
