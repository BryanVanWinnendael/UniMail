import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { MailIcon, Mails, Menu } from "lucide-react"
import UsersSelect from "../users-select"
import { usePathname } from "next/navigation"

const SheetSidebar = () => {
  const pathname = usePathname() 
  return (
    <Sheet>
      <SheetTrigger>
        <Button><Menu className="w-4 h-4"/></Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
      <div className="grow px-4">
        <UsersSelect />
        <div className="mt-4 flex flex-col gap-2">
          <div
            className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-primary hover:text-secondary duration-150 ${pathname === "inbox" && "bg-primary text-secondary"}`}>
            <MailIcon className="w-4 h-4"/>
            Inbox
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-primary hover:text-secondary duration-150 ${pathname === "uniBox" && "bg-primary text-secondary"}`}>
              <Mails className="w-4 h-4"/>
              UniBox
          </div>
        </div>
      </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetSidebar