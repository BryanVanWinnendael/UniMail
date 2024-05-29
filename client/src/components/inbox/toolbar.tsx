import { Input } from "@/components/ui/input"
import RefreshButton from "./refresh-button";
import { ChevronLeft, Maximize2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import SortButton from "./sort-button";
import { Tokens, UniMails, UserEmails } from "@/types";
import { Dispatch, SetStateAction } from "react";
import UsersScroll from "../uni-box/users-scroll";

interface ToolbarProps {
  loading: boolean;
  refresh: (type: "hard" | "soft") => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  setFullScreenEmail: (full: boolean) => void;
  fullScreenEmail: boolean;
  sender_email: string | null;
  handleBackToInbox: () => void;
  setEmails: Dispatch<SetStateAction<UserEmails>> | Dispatch<SetStateAction<UniMails>>;
  emails: UserEmails | UniMails;
  sortType: "user" | "uni";
  users?: Tokens;
}

const Toolbar = ({ loading, refresh, setSearchQuery, searchQuery, setFullScreenEmail, fullScreenEmail, sender_email, handleBackToInbox, setEmails, sortType, emails, users } : ToolbarProps) => {
  const toggleFullScreen = () => {
    setFullScreenEmail(!fullScreenEmail)
  }

  return (
    <div className="w-full h-12 items-center pb-12">
      <div className="grid grid-cols-[0.8fr_0.2fr] gap-2 items-center">
        <div className="flex items-center gap-2">
        {
          sender_email ? (
            <Tooltip>
              <TooltipTrigger><ChevronLeft onClick={handleBackToInbox} className="w-4 h-4 text-black cursor-pointer" /></TooltipTrigger>
              <TooltipContent>
                <p>go back</p>
              </TooltipContent>
            </Tooltip>
            
          ) :
          <RefreshButton refresh={refresh} loading={loading}/>
        }

        
        {
          sender_email ? (
            <p className="bg-white p-2 rounded-lg border border-slate-200 truncate w-fit">
            <b>From:</b> {sender_email}
            </p> 
          )

          :
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search"/>
        }
        </div>
        

        <div className="flex w-full justify-end gap-2">
          {
            (users && !sender_email) &&   (
              <UsersScroll users={users}/>
            )
          }
          {
            sender_email ?  (
              <Tooltip>
                <TooltipTrigger><Maximize2 className="w-4 h-4 text-black cursor-pointer" onClick={toggleFullScreen}/></TooltipTrigger>
                <TooltipContent>
                  <p>full screen email</p>
                </TooltipContent>
              </Tooltip>
            )
            :
            <SortButton emails={emails} sortType={sortType} setEmails={setEmails}/>
          }
        </div>
      </div>
    </div>
  )
}

export default Toolbar