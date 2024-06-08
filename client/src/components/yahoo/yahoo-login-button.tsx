"use client"
import EmailButton from "../email-button"

const YahooLoginButton = () => {
  const clientId = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID || ""
  const redirectUri = process.env.NEXT_PUBLIC_YAHOO_REDIRECT_URI || ""
  const authEndpoint = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`

  const handleLogin = () => {
    window.location.href = authEndpoint
  }

  return <EmailButton onClick={handleLogin} platform="yahoo" text="" />
}

export default YahooLoginButton
