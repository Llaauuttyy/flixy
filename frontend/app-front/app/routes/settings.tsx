import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { SidebarNav } from "components/ui/sidebar-nav"
import { HeaderFull } from "components/ui/header-full"
import { Suspense } from "react"

export default function SettingsPage()
{
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
                                <CardTitle className="text-foreground">General Settings</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Update profile data and app preferences.
                                </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-foreground font-bold">Name</Label>
                                    <Input id="username" defaultValue="joao" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-foreground font-bold">Username</Label>
                                    <Input id="username" defaultValue="user128" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground font-bold">Email</Label>
                                    <Input id="email" type="email" defaultValue="usuario.demo@example.com" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Save</Button>
                                </CardContent>
                            </Card>
                            </TabsContent>

                            <TabsContent value="datos" className="mt-6">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                <CardTitle className="text-foreground">Data Management</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Visualize and manage your personal data.
                                </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="data-export" className="text-foreground font-bold">Export data</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Require a copy of all your personal data stored in the application.
                                    </p>
                                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Require export</Button>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="data-delete" className="text-foreground font-bold md:text-red-400">Delete account</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Deleting your account will remove all your personal data from our servers. <span className="font-bold md:text-red-500">It cannot be undone</span>.
                                    </p>
                                    <Button variant="destructive" className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-750 hover:to-red-800">Delete account</Button>
                                </div>
                                </CardContent>
                            </Card>
                            </TabsContent>

                            <TabsContent value="contrasena" className="mt-6">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                <CardTitle className="text-foreground">Change Password</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Update your password to keep your account secure.
                                </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password" className="text-foreground font-bold">Current password</Label>
                                    <Input id="current-password" type="password" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-foreground font-bold">New password</Label>
                                    <Input id="new-password" type="password" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-foreground font-bold">Repeat new password</Label>
                                    <Input id="confirm-password" type="password" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
                                </div>
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">Update</Button>
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
  )
}
