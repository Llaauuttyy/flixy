import { MoveRight } from "lucide-react";
import { data, redirect } from "react-router";
import { Link } from "react-router-dom";
import LoginForm from "../../components/login-form";
import { commitSession, getSession } from "../session/sessions.server";
import type { Route } from "./+types/login";

import { Select } from "components/ui/select";
import i18n, { getLanguageIcon, getLanguageLabel } from "i18n/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleLogin } from "services/api/flixy/server/auth";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  const username = form.get("username");
  const password = form.get("password");

  try {
    const { access_token, expiration_time } = await handleLogin({
      username,
      password,
    });
    console.log("Login successful:", access_token);

    session.set("accessToken", access_token);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session, { maxAge: expiration_time }),
      },
    });
  } catch (err: Error | TypeError | any) {
    console.log("API POST /login said: ", err.code);

    if (err instanceof TypeError) {
      return data(
        { error: "Service's not working properly. Please try again later." },
        { status: 500 }
      );
    }

    return data({ error: err.message }, { status: 400 });
  }
}

export default function Login() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const availableLanguages = i18n.options.resources
    ? Object.keys(i18n.options.resources)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <img src="./flixy-logo.png" alt="Flixy Logo" width={40} height={40} />
          <span className="text-white font-medium">Flixy</span>
        </div>
        <nav>
          <Link
            to="/register"
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            {t("login.create_account")} <MoveRight className="size-4" />
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-10">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t("login.welcome_title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Flixy
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
            {t("login.welcome_description")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-gray-300 text-sm">
                99.9% {t("login.welcome_item_uptime")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-300 text-sm">
                {t("login.welcome_item_secure_access")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-500"></div>
              <span className="text-gray-300 text-sm">
                {t("login.welcome_item_support")}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
            <LoginForm />
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 border-t border-gray-800 flex items-center justify-between relative">
        <div className="flex items-center justify-between w-full relative">
          <p className="text-gray-500 text-sm mx-auto">
            © {new Date().getFullYear()} Flixy. {t("general.rights_reserved")}
          </p>
          <Select
            className="absolute right-0"
            options={availableLanguages.map((lang) => ({
              value: lang,
              label: getLanguageLabel(lang),
              iconUrl: getLanguageIcon(lang),
            }))}
            selected={language}
            onChange={(value) => {
              setLanguage(value);
              i18n.changeLanguage(value);
            }}
            openDirection="up"
          />
        </div>
      </footer>
    </div>
  );
}
