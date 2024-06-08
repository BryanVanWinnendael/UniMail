"use client"
import { CodeResponse, useGoogleLogin } from "@react-oauth/google"
import useAuth from "@/hooks/useAuth"
import { getAccessRefreshToken } from "@/services/gmail"
import EmailButton from "../email-button"
import { useRouter } from "next/navigation"

const GmailLoginButton = () => {
  const { login } = useAuth()
  const router = useRouter()

  const getUserInfo = async (token: string) => {
    const res = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = await res.json()
    return data
  }

  const handleGoogleLoginSuccess = async (response: CodeResponse) => {
    try {
      const token = response.code

      const { access_token, refresh_token } = await getAccessRefreshToken(token)
      const user = await getUserInfo(access_token)
      const email = user.email
      login({ access_token, refresh_token }, "gmail", email)
      router.push("/")
    } catch (error) {
      console.error("Error fetching user info: ", error)
    }
  }

  const handleGoogleLoginError = (error: any) => {
    console.error("Gmail login error: ", error)
  }

  const handleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "auth-code",
    scope: "email profile https://www.googleapis.com/auth/gmail.readonly",
  })

  return <EmailButton onClick={handleLogin} platform="gmail" text="Gmail" />
}

export default GmailLoginButton
