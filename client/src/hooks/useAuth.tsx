import { toggleDialog } from "@/redux/features/settings-slice"
import { Platforms, TokenObject, Tokens } from "@/types"
import { useCookies } from "next-client-cookies"
import { useDispatch } from "react-redux"
import { setActiveAccount } from "@/redux/features/auth-slice"
import { useAppSelector } from "@/redux/store"
import { useCallback } from "react"
import { loginRequest } from "@/config/msal"
import { useMsal } from "@azure/msal-react"
import useCache from "./useCache"
import { refreshAccessToken } from "@/services/yahoo"

type PlatformsEmails = {
  [key in Platforms]: string[]
}

const useAuth = () => {
  const { instance } = useMsal()
  const dispatch = useDispatch()
  const activeAccount =
    useAppSelector((state) => state.authReducer.value.activeAccount) || ""
  const cookies = useCookies()
  const { removeCache } = useCache()

  const getAccounts = useCallback((): {
    email: string
    platform: Platforms
  }[] => {
    const accountsEncr = cookies.get("accounts")
    if (accountsEncr) {
      const accounts = atob(accountsEncr)
      return JSON.parse(accounts)
    }
    return []
  }, [cookies])

  const setAccounts = useCallback(
    (email: string, platform: Platforms) => {
      const accounts = getAccounts()
      if (
        accounts.find(
          (account) => account.email === email && account.platform === platform,
        )
      ) {
        return
      }

      accounts.push({ email, platform })
      cookies.set("accounts", btoa(JSON.stringify(accounts)))
    },
    [cookies, getAccounts],
  )

  const removeAccount = useCallback(
    (email: string, platform: Platforms) => {
      const accounts = getAccounts()
      const index = accounts.findIndex(
        (account) => account.email === email && account.platform === platform,
      )
      if (index > -1) {
        accounts.splice(index, 1)
      }

      const countAccounts = accounts.length
      if (countAccounts === 0) {
        cookies.remove("accounts")
        localStorage.removeItem("active_account")
        localStorage.removeItem("api_key")
        localStorage.removeItem("side_view")
        localStorage.removeItem("theme")
      } else {
        cookies.set("accounts", btoa(JSON.stringify(accounts)))
      }

      removeCache(email)
    },
    [cookies, getAccounts, removeCache],
  )

  const getTokens = useCallback((): Tokens => {
    if (typeof localStorage === "undefined") {
      return {} as Tokens
    }

    const tokensEncrypted = localStorage.getItem("tokens")
    if (tokensEncrypted) {
      const tokens = atob(tokensEncrypted)
      return JSON.parse(tokens)
    }
    return {} as Tokens
  }, [])

  const setToken = useCallback(
    (token: TokenObject, platform: Platforms, email: string) => {
      const tokens = getTokens()
      const tokensPlatform = tokens[platform]
      if (tokensPlatform) {
        tokensPlatform[email] = token
        tokens[platform] = tokensPlatform
      } else {
        tokens[platform] = { [email]: token }
      }
      localStorage.setItem("tokens", btoa(JSON.stringify(tokens)))
    },
    [getTokens],
  )

  const removeToken = useCallback(
    (platform: Platforms, email: string) => {
      const tokens = getTokens()
      const tokensPlatform = tokens[platform]
      if (tokensPlatform) {
        delete tokensPlatform[email]
        tokens[platform] = tokensPlatform
      }
      const countTokens = Object.keys(tokens).reduce(
        (acc, platform) =>
          acc + Object.keys(tokens[platform as Platforms]).length,
        0,
      )

      if (countTokens === 0) {
        localStorage.removeItem("tokens")
      } else {
        localStorage.setItem("tokens", btoa(JSON.stringify(tokens)))
      }
    },
    [getTokens],
  )

  const login = useCallback(
    (
      token: TokenObject,
      platform: Platforms,
      email: string,
      setActive: boolean = true,
    ) => {
      setAccounts(email, platform)
      setToken(token, platform, email)
      if (setActive) dispatch(setActiveAccount({ email, platform }))
    },
    [dispatch, setAccounts, setToken],
  )

  const logout = (platform: Platforms, email: string) => {
    removeAccount(email, platform)
    removeToken(platform, email)
    const newUser = getFirstAccount()

    // if the active user is the one being logged out, set the active user to the first user
    if (activeAccount.email === email && activeAccount.platform) {
      const newUser = getFirstAccount()
      if (newUser) dispatch(setActiveAccount(newUser))
    }
    if (!newUser) window.location.href = "/"
    else dispatch(toggleDialog())
  }

  const getOutlookAccounts = (emailsPlatform: string[]) => {
    const accounts = instance
      .getAllAccounts()
      .map((account) => account.username)

    const res = []
    for (const account of emailsPlatform) {
      if (accounts.includes(account)) {
        res.push(account)
      } else {
        logout("outlook", account)
      }
    }
    return res
  }

  const getEmails = () => {
    const tokens = getTokens()
    const emails = {} as PlatformsEmails

    for (const platform of Object.keys(tokens)) {
      const platformTokens = tokens[platform as Platforms]
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

  const getActiveAccessToken = useCallback((): TokenObject => {
    const tokens = getTokens()

    const platformTokens = tokens[activeAccount.platform]
    const token = platformTokens[activeAccount.email]
    if (token) {
      return token
    }

    return { access_token: "", refresh_token: "" }
  }, [activeAccount.email, activeAccount.platform, getTokens])

  const getOutlookTokenSilent = useCallback(async () => {
    await instance.initialize()
    const outlook_accounts = instance.getAllAccounts()
    const accounts = getAccounts()
    if (!accounts) {
      return
    }

    for (const account of outlook_accounts) {
      if (
        accounts.find(
          (acc) => acc.email === account.username && acc.platform === "outlook",
        )
      ) {
        await instance
          .acquireTokenSilent({
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
          })
          .catch((error) => {
            console.log("Outlook silent login error: ", error)
          })
      }
    }
  }, [getAccounts, instance, login])

  const getYahooTokenSilent = useCallback(async () => {
    const accounts = getAccounts()
    if (!accounts) {
      return
    }

    for (const account of accounts) {
      if (account.platform === "yahoo") {
        const tokens = getTokens()
        const token = tokens.yahoo[account.email]
        if (token) {
          const { refresh_token } = token
          const new_access_token = await refreshAccessToken(refresh_token)
          if (new_access_token) {
            token.access_token = new_access_token
            setToken(token, "yahoo", account.email)
          }
        }
      }
    }
  }, [getAccounts, getTokens, setToken])

  const getFirstAccount = () => {
    const emails = getEmails()
    for (const platform of Object.keys(emails)) {
      const platformEmails = emails[platform as Platforms]
      if (platformEmails.length > 0) {
        return { email: platformEmails[0], platform }
      }
    }

    return ""
  }

  const getEmailsToken = useCallback(() => {
    return getTokens()
  }, [getTokens])

  const getLocalStorageActiveAccount = useCallback(() => {
    try {
      const account = localStorage.getItem("active_account")
      const parsedAccount = account ? JSON.parse(account) : ""
      const email = parsedAccount.email
      const platform = parsedAccount.platform
      return { email, platform }
    } catch (error) {
      return {
        email: "",
        platform: "",
      }
    }
  }, [])

  return {
    login,
    logout,
    getEmails,
    getActiveAccessToken,
    getOutlookTokenSilent,
    getEmailsToken,
    getLocalStorageActiveAccount,
    getYahooTokenSilent,
  }
}

export default useAuth
