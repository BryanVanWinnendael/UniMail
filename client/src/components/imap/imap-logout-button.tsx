"use client"
import useAuth from "@/hooks/useAuth"
import EmailButton from "../email-button"

interface ImapLogoutButtonProps {
  email: string
}

const ImapLogoutButton = ({ email }: ImapLogoutButtonProps) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout("imap", email)
  }
  return <EmailButton onClick={handleLogout} platform="imap" text={email} />
}

export default ImapLogoutButton
