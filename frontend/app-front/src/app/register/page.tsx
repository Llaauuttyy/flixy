"use client"

import RegisterForm from "@/components/register-form"
import { MoveRight } from "lucide-react"
import Link from "next/link"

import { useRouter } from 'next/navigation'
import Image from "next/image"


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="flex items-center gap-2">
            <Image
              src="/flixy-logo.png"
              alt="Flixy Logo"
              width={40}
              height={40}
            />
            <span className="text-white font-medium">Flixy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-10">
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
            <RegisterForm />
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Flixy. All rights reserved.</p>
      </footer>
    </div>
  )
}
