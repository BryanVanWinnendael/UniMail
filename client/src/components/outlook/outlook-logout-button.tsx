"use client"
import useAuth from "@/hooks/useAuth"
import EmailButton from "../email-button"

interface OutlookLogoutButtonProps {
  email: string
}

const OutlookLogoutButton = ({ email }: OutlookLogoutButtonProps) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout("outlook", email)
  }

  return <EmailButton onClick={handleLogout} platform="outlook" text={email} />
}

export default OutlookLogoutButton
