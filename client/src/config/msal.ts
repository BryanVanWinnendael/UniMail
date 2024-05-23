import { BrowserCacheLocation, PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/common`,
    redirectUri: '/',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
 }
};

const msalInstance = new PublicClientApplication(msalConfig);

const loginRequest = {
  scopes:  ["https://graph.microsoft.com/.default"],
  redirectUri: "/"
};


export { msalInstance, loginRequest };

