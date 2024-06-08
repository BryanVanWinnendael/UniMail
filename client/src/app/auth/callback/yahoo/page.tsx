"use client"
import React, { useEffect } from "react"
import { getAccessRefreshToken } from "@/services/yahoo"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const Page = () => {
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    const handleLogin = async () => {
      const searchParams = new URLSearchParams(location.search)
      const code = searchParams.get("code") || ""
      const { access_token, refresh_token, email } =
        await getAccessRefreshToken(code)
      if (!access_token || !refresh_token || !email) {
        return
      }
      login({ access_token, refresh_token }, "yahoo", email)
      router.push("/")
    }
    handleLogin()
  }, [login, router])

  return <div>Authenticating...</div>
}

export default Page
