import PasswordForm from "components/password-form";
import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Suspense } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type { Route } from "./+types/settings";

import { useRef } from "react";

import { data } from "react-router";
import { useLoaderData } from "react-router-dom";
import { handlePasswordChange, handleUserDataGet } from "services/api/user-data";

interface UserDataGet {
  error?: string | null
  name: string;
  username: string;
  email: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const userDataResponse: UserDataGet = await handleUserDataGet(request);
    console.log("Got user data successfully");

    return userDataResponse;

  } catch (err: Error | any) {
    console.log("API GET /user said: ", err.message);

    var userDataError: UserDataGet = {
      name: "your-name",
      username: "your-username",
      email: "your-email",
    }

    if (err instanceof TypeError) {
      // return data(
      //   { error: "Service's not working properly. Please try again later." },
      //   { status: 500 }
      // );

      userDataError.error = "Service's not working properly. Please try again later."
      
      return userDataError;
    }

    // return data({ error: err.message }, { status: 400 });

    userDataError.error = err.message;

    return userDataError
  }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const old_password = form.get("currentPassword");
  const new_password = form.get("newPassword");

  try {
    await handlePasswordChange({ old_password, new_password }, request);
    console.log("Password change successfull");
  } catch (err: Error | any) {
    console.log("API PATCH /password said: ", err.message);

    if (err instanceof TypeError) {
      return data(
        { error: "Service's not working properly. Please try again later." },
        { status: 500 }
      );
    }

    return data({ error: err.message }, { status: 400 });
  }
}

export default function SettingsPage() {
  const currentUserData: UserDataGet = useLoaderData();

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function updateUserData() {
    // TODO: Call API to update user data.
    const name = nameRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;

    // var dateToUpdate = new Map<string, string | undefined>()

    // if (name && name !== 'joao') {
    //     dateToUpdate.set("name", name)
    // }

    // const nameUpdate = dateToUpdate.get("name")
    console.log({ name, username, email });
    // console.log({ nameUpdate })
  }

  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <HeaderFull />
            <main className="flex-1 overflow-auto">
              <Suspense></Suspense>
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Settings
                  </h1>
                  <p className="text-gray-300">
                    Update your personal data or password.
                  </p>
                  <div className="w-full flex justify-center mt-10">
                    <div className="w-full max-w-3xl">
                      <Tabs defaultValue="ajustes" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                          <TabsTrigger
                            value="ajustes"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            Settings
                          </TabsTrigger>
                          <TabsTrigger
                            value="datos"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            Data
                          </TabsTrigger>
                          <TabsTrigger
                            value="contrasena"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            Update password
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ajustes" className="mt-6">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-foreground">
                                General Settings
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                Update profile data and app preferences.
                              </CardDescription>
                              {currentUserData?.error && (<p className="text-red-500">{currentUserData.error}</p>)}
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="name"
                                  className="text-foreground font-bold"
                                >
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  ref={nameRef}
                                  defaultValue={currentUserData?.name}
                                  className="focus-visible:ring-purple-500 bg-input border-gray-700 text-foreground placeholder:text-muted-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="username"
                                  className="text-foreground font-bold"
                                >
                                  Username
                                </Label>
                                <Input
                                  id="username"
                                  ref={usernameRef}
                                  defaultValue={currentUserData?.username}
                                  className="focus-visible:ring-purple-500 bg-input border-gray-700 text-foreground placeholder:text-muted-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="email"
                                  className="text-foreground font-bold"
                                >
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  ref={emailRef}
                                  type="email"
                                  defaultValue={currentUserData?.email}
                                  className="bg-input border-gray-700 text-foreground placeholder:text-muted-foreground"
                                />
                              </div>
                              <Button
                                onClick={updateUserData}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                Save
                              </Button>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="datos" className="mt-6">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-foreground">
                                Data Management
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                Visualize and manage your personal data.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="data-export"
                                  className="text-foreground font-bold"
                                >
                                  Export data
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                  Require a copy of all your personal data
                                  stored in the application.
                                </p>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                  Require export
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="data-delete"
                                  className="text-foreground font-bold md:text-red-400"
                                >
                                  Delete account
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                  Deleting your account will remove all your
                                  personal data from our servers.{" "}
                                  <span className="font-bold md:text-red-500">
                                    It cannot be undone
                                  </span>
                                  .
                                </p>
                                <Button
                                  variant="destructive"
                                  className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-750 hover:to-red-800"
                                >
                                  Delete account
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="contrasena" className="mt-6">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-foreground">
                                Change Password
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                Update your password to keep your account
                                secure.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <PasswordForm />
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
