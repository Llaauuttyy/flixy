import { Button } from "components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Input } from "components/ui/input";
import { Bell, Search } from "lucide-react";
import { useSubmit } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useState } from "react";
import { redirect } from "react-router";

export function HeaderFull() {
    const submit = useSubmit();
    const [isLoading, setIsLoading] = useState(false);

    function signOut() {
        setIsLoading(true);

        submit(null, {
            method: "post",
            action: "/signout",
        });
    }

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
    <div className="flex justify-between items-center">
    <div className="flex-1 max-w-md">
        <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
            placeholder="Buscar películas, usuarios, reseñas..."
            className="pl-10 bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-purple-500"
        />
        </div>
    </div>

    <div className="flex items-center space-x-4">
        <div onClick={signOut} 
            className="md:text-pink-600 hover:text-red-600 hover:font-bold hover:cursor-pointer transition-colors flex items-center gap-1 text-sm"
            >
            {isLoading ? (
            <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing out...
                </> 
            ) : (
            "Sign out" 
                )}
        </div>
        <Button
        variant="ghost"
        size="icon"
        className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
        <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-gray-700 text-gray-300">
            JD
        </AvatarFallback>
        </Avatar>
    </div>
    </div>
</header>
  );
}
