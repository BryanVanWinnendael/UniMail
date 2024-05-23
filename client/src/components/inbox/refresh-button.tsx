import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Spinner from "../spinner"
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

const RefreshButton = ({ loading, refresh }: { loading: boolean, refresh: (type: "hard"| "soft") => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading}>
        <Button variant="default" className="cursor-pointer rounded-md h-10 w-10 p-2 flex items-center justify-center">
        {
          loading ? <Spinner size={4}/> : <RefreshCcw className="w-4 h-4 text-white"/>
        }
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => refresh("soft")}>Soft</DropdownMenuItem>
        <DropdownMenuItem onClick={() => refresh("hard")}>Force</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RefreshButton