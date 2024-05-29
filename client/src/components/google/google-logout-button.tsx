"use client"
import useAuth from '@/hooks/useAuth';
import EmailButton from '../email-button';

interface GoogleLogoutButtonProps {
  email: string;
}

const GoogleLogoutButton = ({ email }: GoogleLogoutButtonProps) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout("google", email)
  }
  return (
    <EmailButton onClick={handleLogout} platform="google" text={email}/>
  )
}

export default GoogleLogoutButton