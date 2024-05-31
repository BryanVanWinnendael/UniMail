"use client"
import Inbox from "@/components/inbox";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Inbox as InboxImage } from "lucide-react";

const Page = ()  => {
  const [emailsCount, setEmailsCount] = useState<number>(0)

  const handleSetEmailsCount = useCallback((count: number) => {
    setEmailsCount(count)
  },[])
  
  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="w-full mt-2 sm:pl-0 pl-4 pr-4 pb-2">
          <div className="h-full rounded py-1 flex gap-1 items-center justify-center bg-primary">
          <InboxImage className="w-4 h-4 text-indigo-500"/>
            <p className="text-sm capitalize">Inbox</p>
            {
              emailsCount > 0 && (
                <Badge className="bg-indigo-300/50 dark:bg-indigo-400/50 text-indigo-500 dark:text-indigo-600">
                  {emailsCount}
                </Badge>
              )
            }
          </div>
      </div>
      <Inbox setEmailsCount={handleSetEmailsCount}/>
    </div>
  )
}

export default Page