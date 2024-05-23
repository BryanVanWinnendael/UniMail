import useAuth from "@/hooks/useAuth"
import { getUserEmails } from "@/services/email"
import { Emails } from "@/types"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Toolbar from "./toolbar"
import { useAppSelector } from "@/redux/store"
import Loading from "./loading"
import { toast } from "sonner"
import EmailList from "./email-list"
import Email from "./email"

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [emails, setEmails] = useState<Emails>({})
  const emailsCount = useMemo(() => Object.keys(emails).length, [emails])
  const [activeMail, setActiveMail] = useState<string>("")
  const { getActiveAccessToken } = useAuth()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
  const activeAccount = useAppSelector((state) => state.authReducer.value.activeEmail)
  const [newUser, setNewUser] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")

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
    setActiveMail("")
    setLoading(true)
    const { token, platform } = getActiveAccessToken()
    const res_emails = await getUserEmails(token, platform, activeAccount)
    if (res_emails.error) {
      setLoading(false)
      setNewUser(false)
      setEmails({})
      return toast(`Error fetching emails, please try again later`, {
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
        classNames: {
          toast: '!bg-red-600',
          title: '!text-secondary',
          actionButton: '!bg-secondary',
          cancelButton: '!bg-secondary',
          closeButton: '!bg-secondary',
        },
      })
    }
    const count_new = Object.keys(res_emails).length - emailsCount
    if (refresh) {
      toast(`You have ${count_new} new emails`, {
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
        classNames: {
          toast: '!bg-primary',
          title: '!text-secondary',
          actionButton: '!bg-secondary',
          cancelButton: '!bg-secondary',
          closeButton: '!bg-secondary',
        },
      })
    }

    const latest_times = localStorage.getItem("latest_time")
    const latest_times_json = JSON.parse(latest_times || "{}")

    const latest_time = Math.max(...Object.values(res_emails).map((email) => {
      if (!email.date) {
        return 0
      }
      return new Date(email.date).getTime()
    }))
    latest_times_json[activeAccount] = latest_time
    localStorage.setItem("latest_time", JSON.stringify(latest_times_json))
    setEmails(res_emails)
    setLoading(false)
    setNewUser(false)
  }, [activeAccount, emailsCount, getActiveAccessToken])

  const refresh = (type: "hard" | "soft") => {
    if (type === "hard") {
      const latest_times = localStorage.getItem("latest_time")
      const latest_times_json = JSON.parse(latest_times || "{}")
      latest_times_json[activeAccount] = 0
      localStorage.setItem("latest_time", JSON.stringify(latest_times_json))
      setNewUser(true)
    }
    getEmails(true)
  }

  useEffect(() => {
    setNewUser(true)
    getEmails()
  }, [getEmails, activeAccount])

  useEffect(() => {
    if (!activeMail) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }
  }, [activeMail])

  return (
    <div className="lg:h-screen h-full w-full bg-neutral-50 gap-3 flex flex-col py-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <Toolbar loading={loading} refresh={refresh} emailsCount={emailsCount} setSearchQuery={setSearchQuery} />
      <div 
        className="bg-white rounded-md h-full w-full overflow-y-auto p-4 border border-slate-200 shadow-md" 
        ref={scrollContainerRef}
      >
        {newUser ? <Loading n={10} /> : (activeMail ? <Email sender_email={emails[activeMail].sender_email} encoded_body={emails[activeMail].body} handleBackToInbox={handleBackToInbox} /> : <EmailList emails={emails} searchQuery={searchQuery} handleItemClick={handleItemClick} />)}
      </div>
    </div>
  )
}

export default Index
