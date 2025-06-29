import { createCookieSessionStorage } from "react-router";

type SessionData = {
  accessToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",

        // all of these are optional
        // domain: "reactrouter.com",

        // maxAge overrides expires
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true, // Para no ser accesible via JS.
        maxAge: 60,
        path: "/",
        sameSite: "lax",

        //TODO: Cambiar por una variable de entorno.
        secrets: ["super_secret_secret"],
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession };
