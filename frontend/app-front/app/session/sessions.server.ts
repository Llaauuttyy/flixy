import { createCookieSessionStorage } from "react-router";
import type { UserDataGet } from "services/api/flixy/types/user";

type AccessTokenSessionData = {
  accessToken: string;
};

type RefreshTokenSessionData = {
  refreshToken: string;
};

type UserSessionData = {
  user: UserDataGet;
};

const accessTokenStorage = createCookieSessionStorage<AccessTokenSessionData>({
  cookie: {
    name: "__access_token",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["super_secret_secret"],
    secure: true,
  },
});

const refreshTokenStorage = createCookieSessionStorage<RefreshTokenSessionData>(
  {
    cookie: {
      name: "__refresh_token",
      httpOnly: true,
      maxAge: 60 * 60 * 6,
      path: "/",
      sameSite: "lax",
      secrets: ["super_secret_secret"],
      secure: true,
    },
  }
);

const userDataStorage = createCookieSessionStorage<UserSessionData>({
  cookie: {
    name: "__user_data",
    httpOnly: true,
    maxAge: 60 * 60 * 6,
    path: "/",
    sameSite: "lax",
    secrets: ["super_secret_secret"],
    secure: true,
  },
});

export const {
  getSession: getAccessSession,
  commitSession: commitAccessSession,
  destroySession: destroyAccessSession,
} = accessTokenStorage;
export const {
  getSession: getRefreshSession,
  commitSession: commitRefreshSession,
  destroySession: destroyRefreshSession,
} = refreshTokenStorage;
export const {
  getSession: getUserSession,
  commitSession: commitUserSession,
  destroySession: destroyUserSession,
} = userDataStorage;
