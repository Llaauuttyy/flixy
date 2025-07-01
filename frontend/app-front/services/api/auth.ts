import type { LoginCredentials, RegistrationData } from './utils';

export async function handleLogin(credentials: LoginCredentials) {

    const response = await fetch(process.env.API_URL + "/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const response_json = await response.json();

    if (!response.ok) {
        throw new Error(`${response_json.detail}`);
    }

    return response_json.access_token;
}

export async function handleRegistration(userData: RegistrationData) {

    const response = await fetch(process.env.API_URL + "/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const response_json = await response.json();

    if (!response.ok) {
        throw new Error(`${response_json.detail}`);
    }

    return response_json.id;
}
  