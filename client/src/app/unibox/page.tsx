"use client"
import { useCallback, useState } from "react"
import UniBox from "@/components/uni-box"
import { Badge } from "@/components/ui/badge"
import { Mails } from "lucide-react"

const Page = () => {
  const [emailsCount, setEmailsCount] = useState<number>(0)

  const handleSetEmailsCount = useCallback((count: number) => {
    setEmailsCount(count)
  }, [])

  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="w-full mt-2 sm:pl-0 pl-4 pr-4 pb-2">
        <div className="h-full rounded py-1 flex gap-1 items-center justify-center bg-primary">
          <Mails className="w-4 h-4 text-blue-500" />
          <p className="text-sm">UniBox</p>
          {emailsCount > 0 && (
            <Badge className="bg-blue-300/50 dark:bg-blue-500/50 text-blue-500 dark:text-blue-400">
              {emailsCount}
            </Badge>
          )}
        </div>
      </div>
      <UniBox setEmailsCount={handleSetEmailsCount} />
    </div>
  )
}

export default Page
