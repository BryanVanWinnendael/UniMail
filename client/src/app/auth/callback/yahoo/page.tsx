"use client"
import React, { useEffect } from 'react';
import { getAccessRefreshToken } from "@/services/yahoo";

const Page = () => {
  useEffect(() => {
    const handleLogin = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code') || '';
      const res = await getAccessRefreshToken(code);
      console.log(res);
    }
    handleLogin()
  }, []);

  return <div>Authenticating...</div>;
};

export default Page;