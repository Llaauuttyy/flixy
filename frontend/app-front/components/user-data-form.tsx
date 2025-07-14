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

import { useSubmit } from "react-router-dom";


interface UserDataGet {
  error?: string | null
  name: string;
  username: string;
  email: string;
  accessToken?: string | undefined;
  [key: string]: string | null | undefined;
}

function UserDataForm({ userData }: { userData: UserDataGet }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit() {
    setIsLoading(true);
    setPending(true);

    const formData = new FormData(formRef.current!);
    formData.append("intent", "update-user-data");

    submit(formData, { method: "post" })
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form
          method="post"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div>
              <Label
                htmlFor="name"
                className="text-foreground font-bold"
              >
                Name
              </Label>
            </div>
            <Input
              id="name"
              name="name"
              defaultValue={ userData.name }
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label
                htmlFor="username"
                className="text-foreground font-bold"
              >
                Username
              </Label>
            </div>
            <Input
              id="username"
              name="username"
              defaultValue={ userData.username }
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label
                htmlFor="email"
                className="text-foreground font-bold"
              >
                Email
              </Label>
            </div>
            <Input
              id="email"
              name="email"
              defaultValue={ userData.email }
              // required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
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
              "Save"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default UserDataForm;
