import { createCookieSessionStorage } from "react-router";

type AccessTokenSessionData = {
  accessToken: string;
};

type RefreshTokenSessionData = {
  refreshToken: string;
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
