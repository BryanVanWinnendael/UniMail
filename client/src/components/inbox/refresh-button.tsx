
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

interface RefreshButtonProps {
  loading: boolean
  refresh: (type: "hard"| "soft") => void
}

const RefreshButton = ({ loading, refresh }: RefreshButtonProps) => {
  return (
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
        <DropdownMenuItem onClick={() => refresh("soft")}>
        <Tooltip>
          <TooltipTrigger className="w-full text-left">Soft</TooltipTrigger>
          <TooltipContent>
            <p>only refresh uncached emails</p>
          </TooltipContent>
        </Tooltip>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => refresh("hard")}>
        <Tooltip>
          <TooltipTrigger className="w-full text-left">Force</TooltipTrigger>
          <TooltipContent>
            <p>refresh all emails</p>
          </TooltipContent>
        </Tooltip>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RefreshButton