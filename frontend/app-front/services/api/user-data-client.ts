interface UserDataChange {
    error?: string | null;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    [key: string]: string | null | undefined;
  }

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