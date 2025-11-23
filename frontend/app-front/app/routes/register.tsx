import { Link, useActionData } from "react-router-dom";
import RegisterForm from "../../components/register-form";

import type { Route } from "./+types/login";

import { useTranslation } from "react-i18next";
import { redirect } from "react-router";
import { handleRegistration } from "services/api/flixy/server/auth";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const name = form.get("name");
  const username = form.get("username");
  const email = form.get("email");
  const password = form.get("password");

  try {
    const userId = await handleRegistration({
      name,
      username,
      email,
      password,
    });
    console.log("Registration OK:", userId);

    return redirect("/");
  } catch (err: Error | any) {
    console.log("API POST /register said: ", err.message);

    return {
      error:
        err.message ||
        "Service's not working properly. Please try again later.",
    };
  }
}

export default function Register() {
  const actionData = useActionData() as { error?: string } | undefined;
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <Link to="/login" className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <img
                src="/flixy-logo.png"
                alt="Flixy Logo"
                width={40}
                height={40}
              />
              <span className="text-white font-medium">Flixy</span>
            </div>
          </div>
        </Link>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-10">
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
            <RegisterForm />
            {actionData?.error && (
              <p style={{ color: "red" }}>{actionData.error}</p>
            )}
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Flixy. {t("general.rights_reserved")}
        </p>
      </footer>
    </div>
  );
}
