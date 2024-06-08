"use client"
import useAuth from "@/hooks/useAuth"
import EmailButton from "../email-button"

interface YahooLogoutButtonProps {
  email: string
}

const YahooLogoutButton = ({ email }: YahooLogoutButtonProps) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout("yahoo", email)
  }

  return <EmailButton onClick={handleLogout} platform="yahoo" text={email} />
}

export default YahooLogoutButton
