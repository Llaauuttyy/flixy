import LoginForm from "../../components/login-form"
import { MoveRight, MoveLeft } from "lucide-react"
// import Link from "next/link"
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"

import { useState } from "react"
import { Loader2 } from "lucide-react"
// import Image from "next/image"
// import { useRouter } from 'next/navigation'

import { data, redirect } from "react-router";
import type { Route } from "./+types/login";

import { useSubmit } from "react-router-dom"

import { getSession, commitSession, destroySession } from "../session/sessions.server";

export async function loader({request}: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    if (session.has("userId")) {
        // Me quedo en /home
        return null;
    }

    return redirect("/login", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    })
}

export async function action({request,}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}


export default function Home() {
    // const router = useRouter();
    const submit = useSubmit();
    const [isLoading, setIsLoading] = useState(false);
    //   const [pending, setPending] = useState(false);
    
    function signOut() {
        setIsLoading(true);

        submit(null, {
            method: "post",
        })
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <nav>
            <div onClick={signOut} 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
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
        </nav>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-10">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Welcome back to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Flixy</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
            Sign in to access your profile and continue your journey with us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-gray-300 text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-300 text-sm">Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-500"></div>
              <span className="text-gray-300 text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Flixy. All rights reserved.</p>
      </footer>
    </div>
  )
}
