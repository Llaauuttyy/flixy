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
  old_password: FormDataEntryValue | null;
  new_password: FormDataEntryValue | null;
};
