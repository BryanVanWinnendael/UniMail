"use client"
import { Settings, Mails, Inbox } from "lucide-react"
import UsersSelect from "@/components/users-select"
import { toggleDialog } from "@/redux/features/settings-slice"
import { useDispatch } from "react-redux"
import SheetSidebar from "./sheet-sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

const Index = () => {
  const dispatch = useDispatch()
  const pathname = usePathname()

  const handleToggleDialog = () => {
    dispatch(toggleDialog())
  }

  return (
    <div className="md:min-h-screen w-full">
      <div className="md:flex hidden flex-col">
        <div className="pl-4 flex gap-2 h-fit py-2 items-center">
          <svg
            className="w-8 h-8 fill-secondary-foreground stroke-primary"
            viewBox="0 0 85 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="85" height="57" rx="10" />
            <path
              d="M60 20L55.5975 31.7971C54.43 34.9257 51.4419 37 48.1024 37H42"
              stroke-width="3"
            />
            <path
              d="M25 20L29.4025 31.7971C30.57 34.9257 33.5581 37 36.8976 37H43"
              stroke-width="3"
            />
          </svg>

          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight">
            UniMail
          </h1>
        </div>
        <div className="grow px-4">
          <UsersSelect />
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/"
              className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted dark:hover:text-zinc-100 hover:text-black duration-100 transition ${pathname === "/" && "bg-muted dark:text-zinc-100 text-zinc-900"}`}
            >
              <Inbox className="w-4 h-4 text-indigo-500" />
              <p className="text-sm">Inbox</p>
            </Link>
            <Link
              href="/unibox"
              className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted dark:hover:text-zinc-100 hover:text-black duration-100 transition ${pathname === "/unibox" && "bg-muted dark:text-zinc-100 text-zinc-900"}`}
            >
              <Mails className="w-4 h-4 text-blue-500" />
              <p className="text-sm">UniBox</p>
            </Link>
            <div
              onClick={handleToggleDialog}
              className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted dark:hover:text-zinc-100 hover:text-black duration-100 transition`}
            >
              <Settings className="w-4 h-4" />
              <p className="text-sm">Settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex px-4 pt-2 gap-4 items-center">
        <SheetSidebar />
        <h1 className="text-4xl font-semibold tracking-tight">UniMail</h1>
      </div>
    </div>
  )
}

export default Index
