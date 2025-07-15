export interface UserDataGet {
    error?: string | null
    name: string;
    username: string;
    email: string;
    accessToken?: string | undefined;
    [key: string]: string | null | undefined;
  }
  
export interface UserDataChange {
    error?: string | null;
    success?: string | null;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    [key: string]: string | null | undefined;
}

export type PasswordData = {
    currentPassword: FormDataEntryValue | null;
    newPassword: FormDataEntryValue | null;
};