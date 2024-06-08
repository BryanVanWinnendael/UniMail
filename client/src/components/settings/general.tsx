import Link from "next/link"
import ApiKey from "../api-key"
import FavoriteAccount from "../favorite-account"
import SideViewToggle from "../side-view-toggle"
import ThemeToggle from "./theme-toggle"
import { SquareArrowOutUpRight } from "lucide-react"

const General = () => {
  return (
    <div className="p-5 flex flex-col h-full">
      <div className="w-full flex justify-between mt-6">
        <div>
          <p className="text-lg font-semibold">Theme</p>
          <p className="text-muted-foreground">Change your theme</p>
        </div>
        <div className="flex justify-end w-full h-full items-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full grid justify-between grid-cols-[0.7fr_0.3fr] mt-6">
        <div className="w-full flex flex-col">
          <p className="text-lg font-semibold">Default email</p>
          <p className="text-muted-foreground">
            Change the default email that is used for your inbox
          </p>
        </div>
        <div className="flex justify-end w-full h-full items-center">
          <FavoriteAccount />
        </div>
      </div>

      <div className="w-full grid justify-between grid-cols-[0.7fr_0.3fr] mt-6">
        <div className="w-full flex flex-col">
          <p className="text-lg font-semibold">Side View</p>
          <p className="text-muted-foreground">
            When enabled, email viewer will be next to your inbox
          </p>
        </div>
        <div className="flex justify-end w-full h-full items-center">
          <SideViewToggle />
        </div>
      </div>

      <div className="w-full grid justify-between grid-cols-[0.7fr_0.3fr] mt-6">
        <div className="w-full flex flex-col">
          <p className="text-lg font-semibold flex gap-1 items-center">Summarizer API Key <Link target="_blank" href="https://console.groq.com/keys"><SquareArrowOutUpRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400"/></Link></p>
          <p className="text-muted-foreground">
            Add your API key for the summarizer.
          </p>
        </div>
        <div className="flex justify-end w-full h-full items-center">
          <ApiKey />
        </div>
      </div>
    </div>
  )
}

export default General
