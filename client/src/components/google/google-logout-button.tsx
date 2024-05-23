"use client"
import useAuth from '@/hooks/useAuth';
import EmailButton from '../email-button';

const GoogleLogoutButton = ({ email }: { email: string }) => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout("google", email)
  }
  return (
    <EmailButton onClick={handleLogout} platform="google" text={email}/>
  )
}

export default GoogleLogoutButton