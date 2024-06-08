import useAuth from "@/hooks/useAuth"
import { getUserEmails } from "@/services/email"
import { Platforms, UniMails } from "@/types"
import { useCallback, useEffect, useRef, useState } from "react"
import Toolbar from "@/components/toolbar"
import FilteredEmails from "./filtered-emails"
import Email from "@/components/email"
import { toast } from "sonner"
import useCache from "@/hooks/useCache"
import { summarize } from "@/services/summarize"

interface IndexProps {
  setEmailsCount: (n: number) => void
}

const Index = ({ setEmailsCount }: IndexProps) => {
  const { getCache, updateCache } = useCache()
  const { getEmailsToken } = useAuth()

  const [activeMail, setActiveMail] = useState<{
    email: string
    id: string
  }>({
    email: "",
    id: "",
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [userEmails, setUserEmails] = useState<UniMails>({})
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [fullScreenEmail, setFullScreenEmail] = useState(false)

  const scrollPositionRef = useRef<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const fetchingRef = useRef<boolean>(false)

  const handleBackToInbox = () => {
    setActiveMail({
      email: "",
      id: "",
    })
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current
    }
  }

  const handleItemClick = (email: string, id: string) => {
    setActiveMail({
      email,
      id,
    })
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop
      scrollContainerRef.current.scrollTop = 0
    }
  }

  const getEmails = useCallback(
    async (user?: string | null) => {
      if (fetchingRef.current) return
      fetchingRef.current = true
      setLoading(true)

      const emailsToken = getEmailsToken()
      const fetchPromises = []
      const newEmails: UniMails = {}
      let countNewEmails = 0

      for (const platform in emailsToken) {
        const emails = emailsToken[platform as Platforms]
        for (const email in emails) {
          if (user) {
            if (email !== user) {
              continue
            }
          }
          const token = emails[email]
          fetchPromises.push(getUserEmails(token, platform as Platforms, email))
        }
      }

      try {
        const results = await Promise.all(fetchPromises)

        results.forEach((res, _) => {
          if (res.error) {
            toast(
              `Error fetching emails for ${res.error.user}, please try again later`,
              {
                id: "error-toast",
                action: {
                  label: "Close",
                  onClick: () => console.log("Close"),
                },
                classNames: {
                  toast: "!bg-red-600",
                  title: "!text-white",
                },
              },
            )
          } else if (res.data) {
            const email = res.data.user
            const userEmails = res.data
            newEmails[email] = userEmails
            countNewEmails += Object.keys(userEmails.emails).length
            updateCache(
              {
                email,
                platform: res.data.platform,
              },
              userEmails,
            )
          }
        })

        fetchingRef.current = false
        setEmailsCount(countNewEmails)
        setUserEmails((prev) => ({
          ...prev,
          ...newEmails,
        }))
      } catch (error) {
        console.error("Error fetching emails:", error)
      }

      setLoading(false)
    },
    [getEmailsToken, setEmailsCount, updateCache],
  )

  const refresh = (user?: string) => {
    getEmails(user)
  }

  const summarizeText = async () => {
    if (!activeMail) return { data: { response: "" } }
    const encoded_body =  userEmails[activeMail.email].emails[activeMail.id].body
    const decode = (str: string): string =>
      Buffer.from(str, "base64").toString("utf-8")
    const decoded_body = decode(encoded_body)
    return await summarize(decoded_body)
  } 

  useEffect(() => {
    const getCachedEmails = async () => {
      const emailsToken = getEmailsToken()
      const fetchPromises = []

      for (const platform in emailsToken) {
        const emails = emailsToken[platform as Platforms]
        for (const email in emails) {
          const id = platform + email
          fetchPromises.push(getCache(id))
        }
      }
      try {
        const results = await Promise.all(fetchPromises)
        const unimail = {} as UniMails
        let countEmails = 0
        results.forEach((res, _) => {
          const userEmail = res?.user
          if (userEmail) {
            countEmails += Object.keys(res.emails).length
            unimail[userEmail] = res
          }
        })
        setUserEmails(unimail)
        setEmailsCount(countEmails)
      } catch (error) {
        console.error("Error fetching cached emails:", error)
      }
    }

    fetchingRef.current = false
    getCachedEmails()
    getEmails()
  }, [getCache, getEmails, getEmailsToken, setEmailsCount])

  useEffect(() => {
    if (!activeMail.id) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }
  }, [activeMail])

  return (
    <div className="h-full w-full gap-3 flex flex-col pb-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <div className="bg-primary rounded-md h-full w-full p-4 overflow-hidden shadow shadow-zinc-900/5 dark:shadow-zing-100/5 flex flex-col">
        <Toolbar
          searchQuery={searchQuery}
          handleBackToInbox={handleBackToInbox}
          fullScreenEmail={fullScreenEmail}
          setFullScreenEmail={setFullScreenEmail}
          loading={loading}
          refresh={refresh}
          setSearchQuery={setSearchQuery}
          active_email={
            userEmails[activeMail.email]
              ? {
                  from: userEmails[activeMail.email].emails[activeMail.id]
                    .sender_email,
                  to: userEmails[activeMail.email].emails[activeMail.id]
                    .receiver,
                  date: userEmails[activeMail.email].emails[activeMail.id].date,
                  subject:
                    userEmails[activeMail.email].emails[activeMail.id].subject,
                }
              : null
          }
          setEmails={setUserEmails}
          sortType="uni"
          emails={userEmails}
          users={getEmailsToken()}
          summarizeText={summarizeText}
        />
        <div className="overflow-y-auto h-full" ref={scrollContainerRef}>
          {activeMail.id ? (
            <Email
              fullScreenEmail={fullScreenEmail}
              setFullScreenEmail={setFullScreenEmail}
              encoded_body={
                userEmails[activeMail.email].emails[activeMail.id].body
              }
            />
          ) : (
            <FilteredEmails
              userEmails={userEmails}
              searchQuery={searchQuery}
              handleItemClick={handleItemClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
