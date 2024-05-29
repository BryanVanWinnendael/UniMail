'use client';
import { MsalProvider } from "@azure/msal-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReduxProvider } from "@/redux/provider";
import { msalInstance } from "@/config/msal";
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import AuthProvider from "./auth-provider";

const ClientProviders = ({ children }: {children: React.ReactNode}) => {
  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ReduxProvider>
            <TooltipProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </TooltipProvider>
          </ReduxProvider>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
};

export default ClientProviders;
