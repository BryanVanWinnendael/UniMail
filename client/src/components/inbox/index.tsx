import useAuth from "@/hooks/useAuth"
import { getUserEmails } from "@/services/email"
import { UserEmails } from "@/types"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Toolbar from "./toolbar"
import { useAppSelector } from "@/redux/store"
import Loading from "./loading"
import { toast } from "sonner"
import EmailList from "./email-list"
import Email from "./email"

const DEFAULT_EMAILS: UserEmails = {
  user: "",
  emails: {},
  platform: "google"
}

interface IndexProps {
  setEmailsCount: (n: number) => void
}

const Index = ({ setEmailsCount } : IndexProps) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [userEmails, setUserEmails] = useState<UserEmails>(DEFAULT_EMAILS)
  const countEmails = useMemo(() => Object.keys(userEmails.emails).length, [userEmails])
  const [activeMail, setActiveMail] = useState<string>("")
  const { getActiveAccessToken } = useAuth()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
  const activeAccount = useAppSelector((state) => state.authReducer.value.activeEmail)
  const [hardRefresh, setHardRefresh] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [fullScreenEmail, setFullScreenEmail] = useState(false);

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

  const getEmails = useCallback(async (refresh?: boolean) => {
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
      const data = res.data
      const emails = data.emails
      setUserEmails(data)
      setEmailsCount(Object.keys(emails).length)

      if (refresh) {
        const countNewEmails = Object.keys(emails).length
        const newEmails = countNewEmails - countEmails

        toast(`You have ${newEmails} new emails`, {
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
          classNames: {
            toast: "!bg-primary",
          },
        })
      }

      const latest_times = localStorage.getItem("latest_time")
      const latest_times_json = JSON.parse(latest_times || "{}")

      const latest_time = Math.max(...Object.values(emails).map((email) => {
        if (!email.date) {
          return 0
        }
        return new Date(email.date).getTime()
      }))

      latest_times_json[activeAccount] = latest_time
      localStorage.setItem("latest_time", JSON.stringify(latest_times_json))
    }

    setLoading(false)
    setHardRefresh(false)
  },[activeAccount, getActiveAccessToken, setEmailsCount, countEmails])

  const refresh = (type: "hard" | "soft") => {
    if (type === "hard") {
      const latest_times = localStorage.getItem("latest_time")
      const latest_times_json = JSON.parse(latest_times || "{}")
      latest_times_json[activeAccount] = 0
      localStorage.setItem("latest_time", JSON.stringify(latest_times_json))
      setHardRefresh(true)
    }
    getEmails(true)
  }

  useEffect(() => {
    getEmails()
  }, [activeAccount, getEmails])

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
          sortType="user" setEmails={setUserEmails} searchQuery={searchQuery} handleBackToInbox={handleBackToInbox} 
          active_email={userEmails.emails[activeMail] ? {
            from:  userEmails.emails[activeMail].sender_email,
            to: userEmails.emails[activeMail].receiver,
            subject: userEmails.emails[activeMail].subject,
            date: userEmails.emails[activeMail].date
          } : null} fullScreenEmail={fullScreenEmail} 
          setFullScreenEmail={setFullScreenEmail} loading={loading} refresh={refresh} setSearchQuery={setSearchQuery} />
        <div className="overflow-y-auto h-full" ref={scrollContainerRef}>
          {hardRefresh ? <Loading n={10} /> 
          : 
            (activeMail ? <Email fullScreenEmail={fullScreenEmail} setFullScreenEmail={setFullScreenEmail} encoded_body={userEmails.emails[activeMail].body}/> 
            : <EmailList emails={userEmails.emails} searchQuery={searchQuery} handleItemClick={handleItemClick} />)
          }
        </div>
      </div>
    </div>
  )
}

export default Index
