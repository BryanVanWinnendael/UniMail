import useAuth from "@/hooks/useAuth"
import { getUserEmails } from "@/services/email"
import { UserEmails } from "@/types"
import { useCallback, useEffect, useRef, useState } from "react"
import Toolbar from "../toolbar"
import { useAppSelector } from "@/redux/store"
import { toast } from "sonner"
import EmailList from "./email-list"
import Email from "@/components/email"
import useCache from "@/hooks/useCache"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { summarize } from "@/services/summarize"

const DEFAULT_EMAILS: UserEmails = {
  user: "",
  emails: {},
  platform: "gmail",
}

interface IndexProps {
  setEmailsCount: (n: number) => void
}

const Index = ({ setEmailsCount }: IndexProps) => {
  const activeAccount = useAppSelector(
    (state) => state.authReducer.value.activeAccount,
  )
  const sideView = useAppSelector(
    (state) => state.settingsReducer.value.sideView,
  )

  const { getCache, updateCache } = useCache()
  const { getActiveAccessToken, getLocalStorageActiveAccount } = useAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [userEmails, setUserEmails] = useState<UserEmails>(DEFAULT_EMAILS)
  const [activeMail, setActiveMail] = useState<string>("") // selected mail to view
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [fullScreenEmail, setFullScreenEmail] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
  const fetchingRef = useRef<boolean>(false)

  const handleItemClick = (id: string) => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop
      scrollContainerRef.current.scrollTop = 0
    }
    setActiveMail(id)
  }

  const handleBackToInbox = () => {
    setActiveMail("")
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current
    }
  }

  const getEmails = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setActiveMail("")
    setLoading(true)

    const token = getActiveAccessToken()
    const res = await getUserEmails(
      token,
      activeAccount.platform,
      activeAccount.email,
    )

    if (res.error) {
      setUserEmails(DEFAULT_EMAILS)
      toast(`Error fetching emails, please try again later`, {
        id: "error-toast",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
        classNames: {
          toast: "!bg-red-600",
          title: "!text-white",
        },
      })
    } else if (res.data) {
      const { email } = getLocalStorageActiveAccount()

      if (email !== res.data.user) {
        fetchingRef.current = false
        setLoading(false)
        return
      }
      const data = res.data
      const emails = data.emails
      updateCache(activeAccount, data)
      setUserEmails(data)
      setEmailsCount(Object.keys(emails).length)
    }

    fetchingRef.current = false
    setLoading(false)
  }, [
    setEmailsCount,
    getActiveAccessToken,
    activeAccount,
    getLocalStorageActiveAccount,
    updateCache,
  ])

  const refresh = () => {
    getEmails()
  }

  const getCachedEmails = useCallback(async () => {
    const { email, platform } = getLocalStorageActiveAccount()
    const id = platform + email
    const cachedEmails = await getCache(id)
    if (cachedEmails) {
      setUserEmails(cachedEmails)
      setEmailsCount(Object.keys(cachedEmails.emails).length)
    }
  }, [getCache, getLocalStorageActiveAccount, setEmailsCount])

  const summarizeText = async () => {
    if (!activeMail) return { data: { response: "" } }
    const encoded_body = userEmails.emails[activeMail].body
    const decode = (str: string): string =>
      Buffer.from(str, "base64").toString("utf-8")
    const decoded_body = decode(encoded_body)
    return await summarize(decoded_body)
  }

  useEffect(() => {
    fetchingRef.current = false
    getCachedEmails()
    getEmails()
  }, [getCachedEmails, getEmails, activeAccount])

  useEffect(() => {
    if (!activeMail) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }
  }, [activeMail])

  return (
    <div className="h-full w-full gap-3 flex flex-col pb-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <div className="bg-primary rounded-md h-full w-full p-4 overflow-hidden shadow shadow-zinc-900/5 flex flex-col">
        <Toolbar
          emails={userEmails}
          sortType="user"
          setEmails={setUserEmails}
          searchQuery={searchQuery}
          handleBackToInbox={handleBackToInbox}
          active_email={
            userEmails.emails[activeMail]
              ? {
                  from: userEmails.emails[activeMail].sender_email,
                  to: userEmails.emails[activeMail].receiver,
                  subject: userEmails.emails[activeMail].subject,
                  date: userEmails.emails[activeMail].date,
                }
              : null
          }
          fullScreenEmail={fullScreenEmail}
          setFullScreenEmail={setFullScreenEmail}
          loading={loading}
          refresh={refresh}
          setSearchQuery={setSearchQuery}
          summarizeText={summarizeText}
        />

        {sideView ? (
          <ResizablePanelGroup direction="horizontal" className="gap-2 h-full">
            <ResizablePanel className="!overflow-y-scroll">
              <EmailList
                emails={userEmails.emails}
                searchQuery={searchQuery}
                handleItemClick={handleItemClick}
              />
            </ResizablePanel>
            {activeMail && (
              <>
                <ResizableHandle />
                <ResizablePanel>
                  <Email
                    fullScreenEmail={fullScreenEmail}
                    setFullScreenEmail={setFullScreenEmail}
                    encoded_body={userEmails.emails[activeMail].body}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        ) : (
          <div className="overflow-y-auto h-full" ref={scrollContainerRef}>
            {activeMail ? (
              <Email
                fullScreenEmail={fullScreenEmail}
                setFullScreenEmail={setFullScreenEmail}
                encoded_body={userEmails.emails[activeMail].body}
              />
            ) : (
              <EmailList
                emails={userEmails.emails}
                searchQuery={searchQuery}
                handleItemClick={handleItemClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
