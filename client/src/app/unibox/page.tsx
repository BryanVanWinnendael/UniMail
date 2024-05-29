"use client"
import { useCallback, useState } from "react";
import UniBox from "@/components/uni-box";
import { Badge } from "@/components/ui/badge"
import { Mails } from "lucide-react";

const Page = () => {
  const [emailsCount, setEmailsCount] = useState<number>(0)

  const handleSetEmailsCount = useCallback((count: number) => {
    setEmailsCount(count)
  },[])
  
  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="w-full mt-2 sm:pl-0 pl-4 pr-4 pb-2">
          <div className="h-full rounded py-1 flex gap-1 items-center justify-center bg-white">
          <Mails className="w-4 h-4 text-blue-500"/>
            <p className="text-sm capitalize">UniBox</p>
            {
              emailsCount > 0 && (
                <Badge variant="outline" className="bg-indigo-200/50 text-indigo-600">
                  {emailsCount}
                </Badge>
              )
            }
          </div>
      </div>
      <UniBox setEmailsCount={handleSetEmailsCount}/>
    </div>
  )
}

export default Page