'use client';
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const { getOutlookTokenSilent } = useAuth();

  useEffect(() => {
    try{
      getOutlookTokenSilent();
    } catch (error) {
      console.log("Error getting outlook token silently: ", error);
    }
  }, [getOutlookTokenSilent]);

  return (
    <>
      { children }
    </>
  );
};

export default AuthProvider;
