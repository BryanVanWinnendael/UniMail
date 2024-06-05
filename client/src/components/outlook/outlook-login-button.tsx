"use client"
import useAuth from "@/hooks/useAuth";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import EmailButton from "../email-button";
import { useRouter } from 'next/navigation'

const request = {
  scopes: ["User.Read", "Mail.Read", "Mail.ReadWrite"],
  prompt: 'select_account'
}

const OutlookLoginButton = () => {
  const { login } = useAuth()
  const { login: loginOutlook } = useMsalAuthentication(InteractionType.Silent, request);
  const router = useRouter()
  
  const handleLogin = async () => {
    await loginOutlook(InteractionType.Popup, request)
    .then((response) => {
      if (!response) {
        return
      }
      const access_token = response.accessToken
      const account = response.account
      const email = account.username
      login({ access_token, refresh_token: "" }, "outlook", email)
      router.push("/")
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  return (
    <EmailButton onClick={handleLogin} platform="outlook" text=""/>
  )
}

export default OutlookLoginButton