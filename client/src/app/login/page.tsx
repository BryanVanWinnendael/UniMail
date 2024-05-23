"use client"
import GoogleLoginButton from "@/components/google/google-login-button";
import OutlookLoginButton from "@/components/outlook/outlook-login-button";

export default function LoginPage() {

  return (
    <div className="flex flex-col">
      <GoogleLoginButton />
      <OutlookLoginButton />
    </div>
  )
}
