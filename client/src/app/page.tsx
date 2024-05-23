"use client"
import Sidebar from "@/components/sidebar";
import Inbox from "@/components/inbox";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Active } from "@/types";
import UniBox from "@/components/uni-box";

export default function Home() {
  const { getOutlookTokenSilent } = useAuth()
  const [active, setActive] = useState<Active>('inbox')

  useEffect(() => {
    getOutlookTokenSilent()
  },[getOutlookTokenSilent])
  
  return (
    <div className="h-screen w-full flex md:flex-row flex-col">
      <div className="md:w-64 w-fit md:h-full h-fit">
        <Sidebar setActive={setActive} active={active}/>
      </div>
      <main className="grid w-full md:h-screen h-full lg:overflow-auto overflow-hidden">
        {
          {
            inbox: <Inbox />,
            uniBox: <UniBox />,
          }[active]
        }
      </main>
    </div>
  )
}
