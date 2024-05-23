import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { CookiesProvider } from 'next-client-cookies/server';
import ClientProviders from "@/components/client-providers";
import SettingsDialog from "@/components/settings-dialog";
import { Toaster } from "@/components/ui/sonner"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <ClientProviders>
        <CookiesProvider>
          <body className={cn(
              "min-h-screen bg-background font-sans antialiased flex items-start justify-between",
              fontSans.variable
            )}>
              
              {children}
              <SettingsDialog />
              <Toaster />
          </body>
        </CookiesProvider>
      </ClientProviders>
    </html>
  );
}
