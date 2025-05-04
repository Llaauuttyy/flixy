"use client"

import type React from "react"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Github, Mail } from "lucide-react"
import Link from "next/link"

import { signup } from "@/app/actions/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmed_password, setConfirmedPassword] = useState("")

  const [state, action, pending] = useActionState(signup, undefined)

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false)
  //     // Here you would normally redirect to dashboard or handle errors
  //   }, 1500)
  // }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-800 px-2 text-gray-400"></span>
          </div>
        </div>

        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                Name
                </Label>
                <Input
                id="name"
                name="name"
                type="name"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                />
            </div>
            {state?.errors?.name && <p className="text-red-600">{state.errors.name}</p>}

            <div className="space-y-2">
                <Label htmlFor="surname" className="text-gray-300">
                Surname
                </Label>
                <Input
                id="surname"
                name="surname"
                type="surname"
                placeholder="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                />
            </div>
            {state?.errors?.surname && <p className="text-red-600">{state.errors.surname}</p>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
          </div>
          {state?.errors?.email && <p className="text-red-600">{state.errors.email}</p>}

          <div className="space-y-2">
              <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                  Password
              </Label>
              </div>
              <Input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
          </div>
          {state?.errors?.password && (
            <div>
              <p className="font-bold text-red-600">Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li className="text-red-600" key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
              <Input
              id="password"
              name="confirmPassword"
              type="password"
              placeholder="confirm password"
              value={confirmed_password}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
              />
          </div>
          {state?.errors?.confirmPassword && <p className="text-red-600">{state.errors.confirmPassword[0]}</p>}

          <Button
            disabled={pending}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
