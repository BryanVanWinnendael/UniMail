'use client';
import { Settings, MailIcon, Mails } from "lucide-react";
import UsersSelect from "@/components/users-select";
import { toggleDialog } from "@/redux/features/settings-slice";
import { useDispatch } from "react-redux";
import { Active } from "@/types";
import SheetSidebar from "./sheet-sidebar";

const Index = ({ setActive, active } : { setActive: (active: Active) => void, active: Active }) => {
  const dispatch = useDispatch();

  const handleToggleDialog = () => {
    dispatch(toggleDialog());
  }
  
  return (
  <div className="md:min-h-screen bg-neutral-50 w-full">
    <div className="md:flex hidden flex-col">
      <div className="pl-4 flex h-[4.75rem] items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-main">UniMail</h1>
      </div>
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
      <div className="p-4">
        <div onClick={handleToggleDialog} 
          className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-primary hover:text-secondary duration-150`}>
          <Settings className="w-4 h-4"/>
          Settings
        </div>
      </div>
    </div>

    <div className="md:hidden flex px-4 pt-2 gap-4 items-center">
      <SheetSidebar setActive={setActive} active={active}/>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-main">UniMail</h1>
    </div>
   
  </div>
  )
}

export default Index