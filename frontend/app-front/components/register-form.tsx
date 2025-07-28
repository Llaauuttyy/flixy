import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { SignupFormSchema } from "../lib/definitions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Tipo derivado del esquema con zod
type FormData = z.infer<typeof SignupFormSchema>;

function RegisterForm() {
  // Estados reactivos que re-renderizan el componente al actualizarse.
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setPending(true);

    formRef.current?.submit();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">
          {t("register.sign_up_title")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-800 px-2 text-gray-400"></span>
          </div>
        </div>

        <form
          method="post"
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                {t("register.name")}
              </Label>
            </div>
            <Input
              {...register("name")}
              id="name"
              name="name"
              type="name"
              placeholder={t("register.name")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                {t("register.username")}
              </Label>
            </div>
            <Input
              {...register("username")}
              id="username"
              name="username"
              type="username"
              placeholder={t("register.username")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                {t("register.email")}
              </Label>
            </div>
            <Input
              {...register("email")}
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  {t("register.password")}
                </Label>
              </div>
            </div>
            <Input
              {...register("password")}
              id="password"
              name="password"
              type="password"
              placeholder={t("register.password")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("confirmPassword")}
              id="password"
              name="confirmPassword"
              type="password"
              placeholder={t("register.confirm_password")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.confirmPassword && (
              <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            disabled={pending}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("register.sign_up_button_loading")}
              </>
            ) : (
              t("register.sign_up_button")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
