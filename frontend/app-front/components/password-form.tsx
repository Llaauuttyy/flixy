import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { PasswordFormSchema } from "../lib/definitions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { handlePasswordChange } from "services/api/user-data-client";
import type { ApiResponse } from "services/api/types";

type PasswordFormProps = {
  accessToken: string | undefined;
};

type FormData = z.infer<typeof PasswordFormSchema>;

function PasswordForm({ accessToken }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PasswordFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setPending(true);

    console.log("Updating password...");

    try {
      await handlePasswordChange(accessToken, { 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      });
      console.log("Password change successfull");

      setApiResponse( { success: "Password change successfull" } );

    } catch (err: Error | any) {
      console.log("API PATCH /password said: ", err.message);
  
      if (err instanceof TypeError) {
        setApiResponse( { error: "Service's not working properly. Please try again later." } );
      } else {
        setApiResponse( { error: err.message } );
      }
    }
    setIsLoading(false);
    setPending(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
      {apiResponse?.error && (
              <p style={{ color: "red" }}>{apiResponse.error}</p>
            )}
      {apiResponse?.success && (<p className="text-green-500">{apiResponse.success}</p>)}
        <form
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div>
              <Label
                htmlFor="current-password"
                className="text-foreground font-bold"
              >
                Current password
              </Label>
            </div>
            <Input
              {...register("currentPassword")}
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="current password"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.currentPassword && (
              <p style={{ color: "red" }}>{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label
                htmlFor="new-password"
                className="text-foreground font-bold"
              >
                New password
              </Label>
            </div>
            <Input
              {...register("newPassword")}
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="new password"
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            {errors.newPassword && (
              <p style={{ color: "red" }}>{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label
                htmlFor="confirm-password"
                className="text-foreground font-bold"
              >
                Repeat new password
              </Label>
            </div>
            <Input
              {...register("confirmNewPassword")}
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              placeholder="new password"
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
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default PasswordForm;
