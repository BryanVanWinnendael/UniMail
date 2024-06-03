'use client';
import { MsalProvider } from "@azure/msal-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReduxProvider } from "@/redux/provider";
import { msalInstance } from "@/config/msal";
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import AuthProvider from "./auth-provider";
import ThemeProvider from "./theme-provider";


const Index = ({ children }: {children: React.ReactNode}) => {
  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
       
          <ReduxProvider>
            <TooltipProvider>
              <AuthProvider>
                <ThemeProvider
                 attribute="class"
                 defaultTheme="dark"
                 enableSystem
                 disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </AuthProvider>
            </TooltipProvider>
          </ReduxProvider>
      </GoogleOAuthProvider>
    </MsalProvider>

  );
};

export default Index;
