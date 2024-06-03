
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Spinner from "../spinner"
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Platforms, Tokens } from "@/types";

interface RefreshButtonProps {
  loading: boolean
  refresh: (user?: string) => void
  users?: Tokens;
}

const RefreshButton = ({ loading, refresh, users }: RefreshButtonProps) => {
  return (
    users ? 
      <DropdownMenu>
      <DropdownMenuTrigger disabled={loading}>
        {
          loading ? <Spinner size={4}/> : 
          <Tooltip>
          <TooltipTrigger className="w-full text-left"> <RefreshCcw className="w-4 h-4 text-ring"/></TooltipTrigger>
          <TooltipContent>
            <p>refresh</p>
          </TooltipContent>
        </Tooltip>
         
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
      {
        Object.keys(users).map((platform) => (
          Object.keys(users[platform as Platforms]).map((email) => (
            <DropdownMenuItem key={email} onClick={() => refresh(email)}>
               <Tooltip>
          <TooltipTrigger className="w-full text-left">{email}</TooltipTrigger>
          <TooltipContent>
            <p>{email}</p>
          </TooltipContent>
        </Tooltip>
            </DropdownMenuItem>
          ))
        ))
      }
      </DropdownMenuContent>
    </DropdownMenu>
      : 
      
        loading ? <Spinner size={4}/> : 
        <Tooltip>
        <TooltipTrigger className="w-fit text-left"> <RefreshCcw onClick={() => refresh()} className="w-4 h-4 text-ring"/></TooltipTrigger>
        <TooltipContent>
          <p>refresh</p>
        </TooltipContent>
        </Tooltip>
  )
}

export default RefreshButton