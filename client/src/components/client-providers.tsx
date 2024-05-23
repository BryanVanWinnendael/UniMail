'use client';
import { MsalProvider } from "@azure/msal-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReduxProvider } from "@/redux/provider";
import { msalInstance } from "@/config/msal";

const ClientProviders = ({ children }: {children: React.ReactNode}) => {
  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ReduxProvider>
            {children}
          </ReduxProvider>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
};

export default ClientProviders;
