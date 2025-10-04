import type {
  LoginCredentials,
  RefreshTokenData,
  RegistrationData,
} from "../types/auth";

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

export async function handleRefreshToken(refresh_token: RefreshTokenData) {
  const response = await fetch(process.env.VITE_API_URL + "/refresh_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refresh_token),
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
