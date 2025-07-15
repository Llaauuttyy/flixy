import type { PasswordData, UserDataChange } from "../types/user";

export async function handleUserDataChange(
  accessToken: string | undefined,
  dataToUpdate: UserDataChange
) {
  const response = await fetch(import.meta.env.VITE_API_URL_CLIENT + "/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dataToUpdate),
  });

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }

  return response_json;
}

export async function handlePasswordChange(
  accessToken: string | undefined,
  userData: PasswordData
) {
  const request_body = {
    old_password: userData.currentPassword,
    new_password: userData.newPassword,
  };

  const response = await fetch(
    import.meta.env.VITE_API_URL_CLIENT + "/password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request_body),
    }
  );

  const response_json = await response.json();

  if (!response.ok) {
    throw new Error(`${response_json.detail}`);
  }
}
