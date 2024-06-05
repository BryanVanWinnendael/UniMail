import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useRef, useState } from "react"
import useAuth from "@/hooks/useAuth"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { setActiveEmail } from "@/redux/features/auth-slice"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import Loading from "./inbox/loading"

const UsersSelect = () => {
  const { getEmails } = useAuth()
  const dispatch = useDispatch();
  const emails = getEmails()
  const [open, setOpen] = useState(false)
  const activeEmail = useAppSelector((state) => state.authReducer.value.activeEmail)

  const handleSwitchAccount = (email: string) => {
    dispatch(setActiveEmail(email))
    setOpen(false)
  }

  return (
    activeEmail ?
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <Tooltip>
            <TooltipTrigger className="overflow-hidden"> <p className="overflow-hidden text-ellipsis whitespace-nowrap"> {activeEmail}</p></TooltipTrigger>
            <TooltipContent>
              <p>{activeEmail}</p>
            </TooltipContent>
          </Tooltip>
          
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList className="bg-primary">
            <CommandGroup>
              {
                Object.entries(emails).map(([platform, platformEmails]) => {
                  return platformEmails.map((email) => {
                    return (
                      <CommandItem
                      key={email}
                      value={email}
                      onSelect={(currentValue) => {
                        handleSwitchAccount(currentValue)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-main",
                          activeEmail === email ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Tooltip>
                        <TooltipTrigger className="overflow-hidden"> <p className="overflow-hidden text-ellipsis whitespace-nowrap">{email}</p></TooltipTrigger>
                        <TooltipContent>
                          <p>{email}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                    </CommandItem>
                    )
                })
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    : <Loading n={1} h="40px" w="193px"/>
  )
}

export default UsersSelect