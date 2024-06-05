import useAuth from "@/hooks/useAuth"
import { getUserEmails } from "@/services/email"
import { UserEmails } from "@/types"
import { useCallback, useEffect, useRef, useState } from "react"
import Toolbar from "./toolbar"
import { useAppSelector } from "@/redux/store"
import { toast } from "sonner"
import EmailList from "./email-list"
import Email from "./email"
import useCache from "@/hooks/useCache"

const DEFAULT_EMAILS: UserEmails = {
  user: "",
  emails: {},
  platform: "google"
}

interface IndexProps {
  setEmailsCount: (n: number) => void
}

const Index = ({ setEmailsCount } : IndexProps) => {
  const activeAccount = useAppSelector((state) => state.authReducer.value.activeEmail)

  const { getCache, updateCache } = useCache()
  const { getActiveAccessToken } = useAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [userEmails, setUserEmails] = useState<UserEmails>(DEFAULT_EMAILS)
  const [activeMail, setActiveMail] = useState<string>("") // selected mail to view
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [fullScreenEmail, setFullScreenEmail] = useState(false);

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
    setEmailsCount(0)
    setActiveMail("")
    setLoading(true)

    const { token, platform } = getActiveAccessToken()
    const res = await getUserEmails(token, platform, activeAccount)

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
      if (localStorage.getItem("activeEmail") !== res.data.user) {
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
  },[setEmailsCount, getActiveAccessToken, activeAccount, updateCache])

  const refresh = () => {
    getEmails()
  }

  const getCachedEmails = useCallback(async () => {
    const acc = localStorage.getItem("activeEmail") ?? ""
    const cachedEmails = await getCache(acc)
    if (cachedEmails) {
      setUserEmails(cachedEmails)
      setEmailsCount(Object.keys(cachedEmails.emails).length)
    }
  },[getCache, setEmailsCount])
 
  useEffect(() => {
    fetchingRef.current = false
    getCachedEmails()
    getEmails()
  }, [activeAccount, getCachedEmails, getEmails])

  useEffect(() => {
    if (!activeMail) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }
  }, [activeMail])

  return (
    <div className="h-full w-full gap-3 flex flex-col pb-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <div 
        className="bg-primary rounded-md h-full w-full p-4 overflow-hidden shadow shadow-zinc-900/5 flex flex-col" 
      >
        <Toolbar 
          emails={userEmails} 
          sortType="user" 
          setEmails={setUserEmails} 
          searchQuery={searchQuery} 
          handleBackToInbox={handleBackToInbox} 
          active_email={
            userEmails.emails[activeMail] ? 
            {
              from:  userEmails.emails[activeMail].sender_email,
              to: userEmails.emails[activeMail].receiver,
              subject: userEmails.emails[activeMail].subject,
              date: userEmails.emails[activeMail].date
            } 
            : null
          } 
          fullScreenEmail={fullScreenEmail} 
          setFullScreenEmail={setFullScreenEmail} 
          loading={loading} 
          refresh={refresh} 
          setSearchQuery={setSearchQuery} 
        />
        <div className="overflow-y-auto h-full" ref={scrollContainerRef}>
          {
            (activeMail ? <Email fullScreenEmail={fullScreenEmail} setFullScreenEmail={setFullScreenEmail} encoded_body={userEmails.emails[activeMail].body}/> 
            : <EmailList emails={userEmails.emails} searchQuery={searchQuery} handleItemClick={handleItemClick} />)
          }
        </div>
      </div>
    </div>
  )
}

export default Index
