import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { MailIcon, Mails, Menu } from "lucide-react"
import UsersSelect from "../users-select"
import { Active } from "@/types"

const SheetSidebar = ({ setActive, active }:{ setActive: (active: Active) => void, active: Active }) => {
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
            onClick={() => setActive("inbox")}
            className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-primary hover:text-secondary duration-150 ${active === "inbox" && "bg-primary text-secondary"}`}>
            <MailIcon className="w-4 h-4"/>
            Inbox
          </div>
          <div
            onClick={() => setActive("uniBox")}
            className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-primary hover:text-secondary duration-150 ${active === "uniBox" && "bg-primary text-secondary"}`}>
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