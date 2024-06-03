import { Input } from "@/components/ui/input"
import RefreshButton from "./refresh-button";
import { ChevronLeft, Maximize2, Ungroup } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import SortButton from "./sort-button";
import { Tokens, UniMails, UserEmails } from "@/types";
import { Dispatch, SetStateAction } from "react";
import UsersScroll from "../uni-box/users-scroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getDateTime } from "@/lib/utils";
import { useDispatch } from "react-redux";

interface ToolbarProps {
  loading: boolean;
  refresh: (user?: string) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  setFullScreenEmail: (full: boolean) => void;
  fullScreenEmail: boolean;
  active_email: {
    from: string;
    to: string;
    subject: string;
    date: string;
  } | null;
  handleBackToInbox: () => void;
  setEmails: Dispatch<SetStateAction<UserEmails>> | Dispatch<SetStateAction<UniMails>>;
  emails: UserEmails | UniMails;
  sortType: "user" | "uni";
  users?: Tokens;
}

const Toolbar = ({ loading, refresh, setSearchQuery, searchQuery, setFullScreenEmail, fullScreenEmail, active_email, handleBackToInbox, setEmails, sortType, emails, users } : ToolbarProps) => {
  const toggleFullScreen = () => {
    setFullScreenEmail(!fullScreenEmail)
  }

  return (
    <div className="w-full h-fit items-center">
      <div className="grid grid-cols-[0.8fr_0.2fr] gap-2 items-center">
        <div className="flex items-center gap-2 py-4 pr-2 overflow-x-hidden">
          {
            active_email ? (
              <Tooltip>
                <TooltipTrigger><ChevronLeft onClick={handleBackToInbox} className="w-4 h-4 text-ring cursor-pointer" /></TooltipTrigger>
                <TooltipContent>
                  <p>go back</p>
                </TooltipContent>
              </Tooltip>
              
            ) :
            <RefreshButton users={users} refresh={refresh} loading={loading}/>
          }
          {
            active_email ? (
              <Accordion className="bg-primary p-2 rounded-lg border border-border truncate" type="single" collapsible>
                <AccordionItem value="item-1" className="border-none truncate">
                  <AccordionTrigger className="p-0 border-none truncate">
                  <p className="truncate pr-2">
                    <b>From:</b> {active_email.from}
                  </p> 
                </AccordionTrigger>
                  <AccordionContent>
                  <p className="truncate">
                    <b>To:</b> {active_email.to}
                  </p> 
                  <p className="truncate">
                    <b>Date:</b> {getDateTime(active_email.date)}
                  </p> 
                  <p className="truncate">
                    <b>Subject:</b> {active_email.subject}
                  </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
            :
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search"/>
          }
        </div>
        

        <div className="flex w-full justify-end gap-2">
          {
            (users && !active_email) &&   (
              <UsersScroll users={users}/>
            )
          }
          {
            active_email ?  (
              <Tooltip>
                <TooltipTrigger><Maximize2 className="w-4 h-4 text-ring cursor-pointer" onClick={toggleFullScreen}/></TooltipTrigger>
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