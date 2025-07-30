import { Github, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useActionData } from "react-router-dom";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LoginForm() {
  const actionData = useActionData();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">
          {t("login.sign_in_title")}
        </h2>
        <p className="text-gray-400 text-sm">
          {t("login.sign_in_description")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            onClick={() => setIsLoading(true)}
          >
            <Github className="mr-2 size-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            onClick={() => setIsLoading(true)}
          >
            <Mail className="mr-2 size-4" />
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-800 px-2 text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        <form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              {t("login.username")}
            </Label>
            <Input
              id="username"
              // Se pone nombre para que llegue en el request a routes/login.tsx
              name="username"
              type="username"
              placeholder={t("login.username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                {t("login.password")}
              </Label>
              <Link
                to="#"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                {t("login.forgot_password")}
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border-gray-700 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
            >
              Remember me
            </label>
          </div>

          {actionData?.error && (
            <p className="text-red-500">{actionData.error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("login.sign_in_button_loading")}
              </>
            ) : (
              t("login.sign_in_button")
            )}
          </Button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          {t("login.dont_have_account")}{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            {t("login.sign_up")}
          </Link>
        </p>
      </div>
    </div>
  );
}
