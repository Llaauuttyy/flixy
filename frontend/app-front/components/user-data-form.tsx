import { useRef, useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { handleUserDataChange } from "services/api//flixy/client/user-data-client";
import type {
  UserDataChange,
  UserDataGet,
} from "services/api/flixy/types/user";

function UserDataForm({ userData }: { userData: UserDataGet }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const [currentUserDataReactive, setCurrentUserData] =
    useState<UserDataChange>(userData);

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function updateUserData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setPending(true);

    currentUserDataReactive.error = null;
    currentUserDataReactive.success = null;
    setCurrentUserData({ ...currentUserDataReactive });

    const name = nameRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;

    const updates: { [key: string]: string | undefined } = {
      name,
      username,
      email,
    };
    const dataToUpdate: UserDataChange = {};

    for (const key in updates) {
      if (updates[key] && updates[key] !== currentUserDataReactive[key]) {
        dataToUpdate[key] = updates[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      console.log("No changes detected, not calling API.");

      setCurrentUserData({
        ...currentUserDataReactive,
        error: "No changes detected. Please modify at least one field.",
      });
    } else {
      try {
        const userDataChangeResponse: UserDataChange =
          await handleUserDataChange(userData.accessToken, dataToUpdate);
        console.log("Change user data successfully");

        setCurrentUserData({
          ...userDataChangeResponse,
          success: "User data updated successfully.",
        });
      } catch (err: Error | any) {
        console.log("API PATCH /user said: ", err.message);

        if (err instanceof TypeError) {
          currentUserDataReactive.error =
            "Service's not working properly. Please try again later.";
        }

        currentUserDataReactive.error = err.message;

        setCurrentUserData({ ...currentUserDataReactive });
      }
    }

    setIsLoading(false);
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {currentUserDataReactive?.error && (
          <p className="text-red-500">{currentUserDataReactive.error}</p>
        )}
        {currentUserDataReactive?.success && (
          <p className="text-green-500">{currentUserDataReactive.success}</p>
        )}
        <form method="post" onSubmit={updateUserData} className="space-y-4">
          <div className="space-y-2">
            <div>
              <Label htmlFor="name" className="text-foreground font-bold">
                Name
              </Label>
            </div>
            <Input
              id="name"
              name="name"
              ref={nameRef}
              defaultValue={currentUserDataReactive?.name ?? ""}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="username" className="text-foreground font-bold">
                Username
              </Label>
            </div>
            <Input
              id="username"
              name="username"
              ref={usernameRef}
              defaultValue={currentUserDataReactive?.username ?? ""}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label htmlFor="email" className="text-foreground font-bold">
                Email
              </Label>
            </div>
            <Input
              id="email"
              name="email"
              ref={emailRef}
              defaultValue={currentUserDataReactive?.email ?? ""}
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
