"use client"
import useAuth from "@/hooks/useAuth"
import { useEffect } from "react"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getOutlookTokenSilent, getYahooTokenSilent } = useAuth()

  useEffect(() => {
    try {
      getOutlookTokenSilent()
      getYahooTokenSilent()
    } catch (error) {
      console.log("Error getting outlook token silently: ", error)
    }
  }, [getOutlookTokenSilent, getYahooTokenSilent])

  return <>{children}</>
}

export default AuthProvider
