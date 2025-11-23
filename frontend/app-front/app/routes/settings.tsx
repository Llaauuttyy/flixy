import PasswordForm from "components/password-form";
import { HeaderFull } from "components/ui/header-full";
import { SidebarNav } from "components/ui/sidebar-nav";
import { Suspense, useState } from "react";
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
import type { ApiResponse } from "services/api/flixy/types/overall";
import type { UserDataGet } from "../../services/api/flixy/types/user";

export async function loader({ request }: Route.LoaderArgs) {
  let apiResponse: ApiResponse = {};

  try {
    const userDataResponse: UserDataGet = await handleUserDataGet({ request });
    console.log("Got user data successfully");

    apiResponse.data = { user: userDataResponse };
    apiResponse.accessToken = await getAccessToken(request);

    return apiResponse;
  } catch (err: Error | any) {
    console.log("API GET /user said: ", err.message);

    apiResponse.data = {
      user: {
        name: "your-name",
        username: "your-username",
        email: "your-email",
        about_me: "your-about-me",
      },
    };

    if (err instanceof TypeError) {
      apiResponse.error =
        "Service's not working properly. Please try again later.";
      return apiResponse;
    }

    apiResponse.error = err.message;
    return apiResponse;
  }
}

export default function SettingsPage() {
  const apiResponse: ApiResponse = useLoaderData();
  const currentUserData: UserDataGet = apiResponse?.data?.user!;
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
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                          <TabsTrigger
                            value="ajustes"
                            className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                          >
                            {t("settings.general.tab")}
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
                              <UserDataForm
                                userData={currentUserData}
                                accessToken={String(apiResponse.accessToken)}
                              />
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
                                accessToken={String(apiResponse.accessToken)}
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
