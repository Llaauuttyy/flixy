import type { PasswordData } from "./types";
import { getAccessToken } from "./utils";

// interface UserDataChange {
//     error?: string | null;
//     name?: string | null;
//     username?: string | null;
//     email?: string | null;
//     [key: string]: string | null | undefined;
//   }

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

export async function handleUserDataGet(
    request: Request
  ) {
    const token = await getAccessToken(request);
  
    const response = await fetch(process.env.VITE_API_URL + "/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  
    const response_json = await response.json();
  
    if (!response.ok) {
      throw new Error(`${response_json.detail}`);
    }

    return response_json;
  }

  // export async function handleUserDataChange(
  //   accessToken: string | undefined,
  //   dataToUpdate: UserDataChange
  // ) {
  //   // const token = await getAccessToken(request);
  
  //   const response = await fetch(process.env.VITE_API_URL + "/user", {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify(dataToUpdate),
  //   });
  
  //   const response_json = await response.json();
  
  //   if (!response.ok) {
  //     throw new Error(`${response_json.detail}`);
  //   }

  //   return response_json;
  // }
  