import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPassword } from "lib/definitions";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormData = z.infer<typeof ForgotPassword>;

function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ForgotPassword),
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
          {t("forgot_password.title")}
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
              <Label htmlFor="email" className="text-gray-300">
                {t("forgot_password.email")}
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
            <p className="text-gray-400 text-sm">
              {t("forgot_password.description")}
            </p>
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
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
                {t("forgot_password.send_button_loading")}
              </>
            ) : (
              t("forgot_password.send_button")
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
