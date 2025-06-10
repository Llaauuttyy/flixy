import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Loader2, Github, Mail } from "lucide-react"
// import Link from "next/link"
import { Link } from 'react-router-dom';

// import { useRouter } from 'next/navigation'

export default function LoginForm() {
  // const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Here you would normally redirect to dashboard or handle errors
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
        <p className="text-gray-400 text-sm">Enter your credentials below to access your account</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            onClick={() => setIsLoading(true)}
          >
            <Github className="mr-2 size-4" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            onClick={() => setIsLoading(true)}
          >
            <Mail className="mr-2 size-4" />
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-800 px-2 text-gray-400">or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Link to="#" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border-gray-700 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
            >
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
