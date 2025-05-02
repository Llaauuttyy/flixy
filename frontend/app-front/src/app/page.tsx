import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-violet-600 to-purple-500 opacity-95"></div>

      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-violet-400 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
      <div className="absolute top-[30%] left-[10%] w-[25%] h-[25%] rounded-full bg-violet-200 opacity-10 blur-2xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-[30%] h-[30%] rounded-full bg-indigo-300 opacity-15 blur-3xl"></div>

      {/* Animated floating shapes */}
      <div className="absolute top-[10%] left-[20%] w-16 h-16 rounded-full bg-violet-300 opacity-20 animate-pulse"></div>
      <div
        className="absolute bottom-[30%] right-[25%] w-24 h-24 rounded-full bg-purple-400 opacity-15 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-[60%] left-[15%] w-20 h-20 rounded-full bg-indigo-300 opacity-10 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Content container with increased z-index */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="mx-auto w-full max-w-md space-y-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl">
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-indigo-600 font-sans" style={{ marginBottom: -30 }}>Flixy</span>
              <div className="relative mb-2 w-50 h-50">
                <Image
                  src="/flixy-logo.png"
                  alt="Flixy Logo"
                  fill
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500">Sign in to continue rating and sharing your opinions</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  className="h-11 border-gray-200 focus-visible:ring-violet-600"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link className="text-sm font-medium text-violet-600 hover:text-violet-700" href="#">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  className="h-11 border-gray-200 focus-visible:ring-violet-600"
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
            </div>
            <Button className="h-11 w-full bg-violet-600 text-white hover:bg-violet-700">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Separator className="flex-1" />
              <span>OR CONTINUE WITH</span>
              <Separator className="flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-11 border-gray-200 bg-white text-gray-900 hover:bg-gray-50" variant="outline">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
                Google
              </Button>
              <Button className="h-11 border-gray-200 bg-white text-gray-900 hover:bg-gray-50" variant="outline">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                </svg>
                Facebook
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="font-medium text-violet-600 hover:text-violet-700" href="#">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="relative z-10 py-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} Flixy. All rights reserved.
      </footer>
    </div>
  )
}
