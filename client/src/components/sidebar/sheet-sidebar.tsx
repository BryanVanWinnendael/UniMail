import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { Inbox, Mails, Menu, Settings } from "lucide-react"
import UsersSelect from "../users-select"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { toggleDialog } from "@/redux/features/settings-slice"
import { useDispatch } from "react-redux"

const SheetSidebar = () => {
  const pathname = usePathname()
  const dispatch = useDispatch()

  const handleToggleDialog = () => {
    dispatch(toggleDialog())
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          <Menu className="w-4 h-4 text-ring" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
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
          </div>
          <div
            onClick={handleToggleDialog}
            className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-muted dark:hover:text-zinc-100 hover:text-black duration-100 transition`}
          >
            <Settings className="w-4 h-4" />
            <p className="text-sm">Settings</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetSidebar
