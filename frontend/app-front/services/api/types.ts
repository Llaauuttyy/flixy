export type LoginCredentials = {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export type RegistrationData = {
  name: FormDataEntryValue | null;
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export type PasswordData = {
  currentPassword: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
};

export interface ApiResponse {
  error?: string | null
  success?: string | null;
  [key: string]: string | null | undefined;
}

