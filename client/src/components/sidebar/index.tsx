'use client';
import { Settings, Mails, Inbox } from "lucide-react";
import UsersSelect from "@/components/users-select";
import { toggleDialog } from "@/redux/features/settings-slice";
import { useDispatch } from "react-redux";
import SheetSidebar from "./sheet-sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Index = () => {
  const dispatch = useDispatch();
  const pathname = usePathname() 

  const handleToggleDialog = () => {
    dispatch(toggleDialog());
  }
  
  return (
  <div className="md:min-h-screen w-full">
    <div className="md:flex hidden flex-col">
      <div className="pl-4 flex h-fit py-2 items-center">
        <h1 className="scroll-m-20 text-lg text-[#1A1E23] font-semibold tracking-tight">UniMail</h1>
      </div>
      <div className="grow px-4">
        <UsersSelect />
        <div className="mt-4 flex flex-col gap-2">
          <Link  
            href="/"
            className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-zinc-200 hover:text-zinc-900 duration-100 transition ${pathname === "/" && "bg-zinc-200 text-zinc-900"}`}>
            <Inbox className="w-4 h-4 text-indigo-500"/>
            <p className="text-sm">Inbox</p>
          </Link>
          <Link
            href="/unibox"
            className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-zinc-200 hover:text-zinc-900 duration-100 transition ${pathname === "/unibox" && "bg-zinc-200 text-zinc-900"}`}>
              <Mails className="w-4 h-4 text-blue-500"/>
              <p className="text-sm">UniBox</p>
          </Link>
          <div
            onClick={handleToggleDialog}
            className={`text-[#71717a] flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-zinc-200 hover:text-zinc-900 duration-100 transition`}>
             <Settings className="w-4 h-4"/>
             <p className="text-sm">Settings</p>
          </div>
        </div>
      </div>
    </div>

    <div className="md:hidden flex px-4 pt-2 gap-4 items-center">
      <SheetSidebar/>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-main">UniMail</h1>
    </div>
   
  </div>
  )
}

export default Index