import { toggleDialog } from "@/redux/features/settings-slice";
import { Platforms, TokenObject, Tokens } from "@/types";
import { useCookies } from "next-client-cookies";
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux";
import { setActiveEmail } from "@/redux/features/auth-slice";
import { useAppSelector } from "@/redux/store";
import { useCallback } from "react";
import { loginRequest } from "@/config/msal";
import { useMsal } from "@azure/msal-react";
import useCache from "./useCache";

type PlatformsEmails= {
  [key in Platforms]: string[];
}

const useAuth = () => {
  const { instance } = useMsal();
  const router = useRouter()
  const dispatch = useDispatch();
  const activeEmail = useAppSelector((state) => state.authReducer.value.activeEmail) || ""
  const cookies = useCookies()
  const { removeCache } = useCache()

  const getAccounts = useCallback((): string[] => {
    const accountsEncr = cookies.get("accounts")
    if (accountsEncr) {
      const accounts = atob(accountsEncr)
      return JSON.parse(accounts)
    }
    return []
  },[cookies])

  const setAccounts = useCallback((email: string) => {
    const accounts = getAccounts()
    if (!accounts.includes(email)) {
      accounts.push(email)
    } 
    cookies.set("accounts", btoa(JSON.stringify(accounts)))
  },[cookies, getAccounts])

  const removeAccount = useCallback((email: string) => {
    const accounts = getAccounts()
    const index = accounts.indexOf(email)
    if (index > -1) {
      accounts.splice(index, 1)
    }
    localStorage.setItem("accounts", btoa(JSON.stringify(accounts)))
    removeCache(email)
  },[getAccounts, removeCache])

  const getTokens = useCallback((): Tokens => {
    if (typeof localStorage === 'undefined') {
      return {
        google: {},
        outlook: {},
        yahoo: {}
      };
    }
    
    const tokensEncrypted = localStorage.getItem("tokens")
    if (tokensEncrypted) {
      const tokens = atob(tokensEncrypted)
      return JSON.parse(tokens)
    }
    return {
      google: {},
      outlook: {},
      yahoo: {}
    }
  },[])

  const setToken = useCallback((token: TokenObject, platform: Platforms, email: string) => {
    const tokens = getTokens()
    const tokensPlatform = tokens[platform]
    if (tokensPlatform) {
      tokensPlatform[email] = token
      tokens[platform] = tokensPlatform
    } else {
      tokens[platform] = { [email]: token }
    }
    localStorage.setItem("tokens", btoa(JSON.stringify(tokens)))
  },[getTokens])

  const removeToken = useCallback((platform: Platforms, email: string) => {
    const tokens = getTokens()
    const tokensPlatform = tokens[platform]
    if (tokensPlatform) {
      delete tokensPlatform[email]
      tokens[platform] = tokensPlatform
    }
    localStorage.setItem("tokens", btoa(JSON.stringify(tokens)))
  },[getTokens])
  
  const login = useCallback((token: TokenObject, platform: Platforms, email: string, setActive: boolean = true) => {
    setAccounts(email)
    setToken(token, platform, email)
    if (setActive) dispatch(setActiveEmail(email))
  },[dispatch, setAccounts, setToken])

  const logout = (platform: Platforms, email: string) => {
    removeAccount(email)
    removeToken(platform, email)
    dispatch(toggleDialog());

    // if the active user is the one being logged out, set the active user to the first user
    if (activeEmail === email) {
      const newUser = getFirstAccount()
      dispatch(setActiveEmail(newUser))
    }
    router.refresh()
  }
 
  const getOutlookAccounts = (emailsPlatform: string[]) =>{
    const accounts = instance.getAllAccounts().map((account) => account.username);

    const res = []
    for (const account of emailsPlatform) {
      if (accounts.includes(account)) {
        res.push(account)
      } else {
        logout("outlook", account)
      }
    }
    return res
  };

  const getEmails = () => {
    const tokens = getTokens()
    const emails: PlatformsEmails = {
      google: [],
      outlook: [],
      yahoo: []
    }

    for (const platform of Object.keys(tokens)) {
      const platformTokens = tokens[platform as Platforms];
      let emailsPlatform = Object.keys(platformTokens)
      if (platform === "outlook") {
        emailsPlatform = getOutlookAccounts(emailsPlatform)
      }

      emails[platform as Platforms] = emailsPlatform
    }

    // count emils for combined platforms
    let count = 0
    for (const platform of Object.keys(emails)) {
      count += emails[platform as Platforms].length
    }

    if (count === 0) {
      cookies.remove("accounts")
    }

    return emails
  }

  const getActiveAccessToken = useCallback((): { token: TokenObject; platform: Platforms } => {
    const tokens = getTokens()
    
    for (const platform of Object.keys(tokens)) {
      const platformTokens = tokens[platform as Platforms];
      const token = platformTokens[activeEmail];
      if (token) {
        return {
          token,
          platform: platform as Platforms
        };
      }
    }
    
    return {
      token: { access_token: "", refresh_token: "" },
      platform: "google"
    };
  }, [activeEmail, getTokens]);

  const getOutlookTokenSilent = useCallback(async () => {
    await instance.initialize();
    const outlook_accounts = instance.getAllAccounts()
    const accounts = getAccounts()
    if (!accounts) {
      return;
    }

    for (const account of outlook_accounts) {
      if (accounts.includes(account.username)) {
        await instance.acquireTokenSilent({
          ...loginRequest,
          account: account,
        })
        .then((response) => {
          if (!response) {
            return
          }
          const access_token = response.accessToken
          const account = response.account
          const email = account.username
          login({ access_token, refresh_token: "" }, "outlook", email, false)
        }).catch((error) => {
          console.log("Outlook silent login error: ", error)
        })
      }
    }
    
  },[getAccounts, instance, login])

  const getFirstAccount = () => {
    const emails = getEmails()
    for (const platform of Object.keys(emails)) {
      const platformEmails = emails[platform as Platforms]
      if (platformEmails.length > 0) {
        return platformEmails[0]
      }
    }

    return ""
  }

  const getEmailsToken = useCallback(() => {
    return getTokens()
  },[getTokens])

  return {
    login,
    logout,
    getEmails,
    getActiveAccessToken,
    getOutlookTokenSilent,
    getEmailsToken
  }
}

export default useAuth