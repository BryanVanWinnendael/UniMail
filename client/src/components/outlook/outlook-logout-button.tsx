"use client"
import useAuth from "@/hooks/useAuth";
import { msalInstance } from "@/config/msal";
import EmailButton from "../email-button";

const OutlookLogoutButton = ({ email }: { email: string }) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    const accounts = msalInstance.getAllAccounts();
    const accountToLogout = accounts.find(account => account.username === email);
    
    await msalInstance.logoutPopup({
      account: accountToLogout
    }).then(()  => {
      logout("outlook", email)
    }).catch((error) => {
      console.log(error)
    })
  }
  
  return (
    <EmailButton onClick={handleLogout} platform="outlook" text={email}/>
  )
}

export default OutlookLogoutButton