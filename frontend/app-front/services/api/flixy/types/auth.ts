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

export type RefreshTokenData = {
  refresh_token: string | null;
};
