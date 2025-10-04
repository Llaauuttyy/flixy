import PasswordForm from "components/password-form";
import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Suspense, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type { Route } from "./+types/settings";

import { useLoaderData } from "react-router-dom";
import { handleUserDataGet } from "services/api/flixy/server/user-data";

import { getAccessToken } from "../../services/api/utils";

import { Select } from "components/ui/select";
import UserDataForm from "components/user-data-form";
import i18n, { getLanguageIcon, getLanguageLabel } from "i18n/i18n";
import { useTranslation } from "react-i18next";
import type { UserDataGet } from "../../services/api/flixy/types/user";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const userDataResponse: UserDataGet = await handleUserDataGet(request);
    console.log("Got user data successfully");

    userDataResponse.accessToken = await getAccessToken(request);

    return userDataResponse;
  } catch (err: Error | any) {
    console.log("API GET /user said: ", err.message);

    var userDataError: UserDataGet = {
      name: "your-name",
      username: "your-username",
      email: "your-email",
    };

    if (err instanceof TypeError) {
      userDataError.error =
        "Service's not working properly. Please try again later.";
      return userDataError;
    }

    userDataError.error = err.message;
    return userDataError;
  }
}

export default function SettingsPage() {
  const currentUserData: UserDataGet = useLoaderData();
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const availableLanguages = i18n.options.resources
    ? Object.keys(i18n.options.resources)
    : [];

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
                    {t("settings.title")}
                  </h1>
                  <p className="text-gray-300">{t("settings.description")}</p>
                  <div className="w-full flex justify-center mt-10">
                    <div className="w-full max-w-3xl">
                      <Tabs defaultValue="ajustes" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                          <TabsTrigger
                            value="ajustes"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            {t("settings.general.tab")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="datos"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            {t("settings.data.tab")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="contrasena"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            {t("settings.password.tab")}
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ajustes" className="mt-6">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-foreground">
                                {t("settings.general.title")}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                {t("settings.general.description")}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label className="text-foreground font-bold">
                                  {t("settings.general.change_language")}
                                </Label>
                              </div>
                              <Select
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
                              />
                              <UserDataForm userData={currentUserData} />
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="datos" className="mt-6">
                          <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                              <CardTitle className="text-foreground">
                                {t("settings.data.title")}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                {t("settings.data.description")}
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
                                {t("settings.password.title")}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground">
                                {t("settings.password.description")}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <PasswordForm
                                accessToken={currentUserData.accessToken}
                              />
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
