"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"
import { getCurrentUser } from "@/lib/auth"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "client") {
        router.push("/auth/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="client" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
