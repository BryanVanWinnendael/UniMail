"use client"
import useAuth from "@/hooks/useAuth"
import EmailButton from "../email-button"

interface GmailLogoutButtonProps {
  email: string
}

const GmailLogoutButton = ({ email }: GmailLogoutButtonProps) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout("gmail", email)
  }
  return <EmailButton onClick={handleLogout} platform="gmail" text={email} />
}

export default GmailLogoutButton
