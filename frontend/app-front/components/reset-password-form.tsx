import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ResetPassword } from "../lib/definitions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormData = z.infer<typeof ResetPassword>;

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ResetPassword),
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
          {t("reset_password.title")}
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
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  {t("reset_password.subtitle")}
                </Label>
              </div>
            </div>
            <Input
              {...register("newPassword")}
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder={t("reset_password.new_password")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.newPassword && (
              <p style={{ color: "red" }}>{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("confirmNewPassword")}
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              placeholder={t("reset_password.confirm_new_password")}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.confirmNewPassword && (
              <p style={{ color: "red" }}>
                {errors.confirmNewPassword.message}
              </p>
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
                {t("reset_password.reset_button_loading")}
              </>
            ) : (
              t("reset_password.reset_button")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
