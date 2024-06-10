import { Check, ChevronsUpDown } from "lucide-react"
import { IMAGES, cn } from "@/lib/utils"
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
import { useState } from "react"
import useAuth from "@/hooks/useAuth"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { setActiveAccount } from "@/redux/features/auth-slice"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import Loading from "./loading"
import { Platforms } from "@/types"
import Image from "next/image"

const UsersSelect = () => {
  const { getEmails } = useAuth()
  const dispatch = useDispatch()
  const emails = getEmails()
  const [open, setOpen] = useState(false)
  const activeAccount = useAppSelector(
    (state) => state.authReducer.value.activeAccount,
  ) || { email: "", platform: "" }

  const handleSwitchAccount = (emailPlatform: string, platform: Platforms) => {
    const email = emailPlatform.split(" ")[0]
    dispatch(setActiveAccount({ email, platform }))
    setOpen(false)
  }

  return activeAccount.email ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <Tooltip>
            <TooltipTrigger className="overflow-hidden">
              {" "}
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {" "}
                {activeAccount.email}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{activeAccount.email}</p>
            </TooltipContent>
          </Tooltip>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList className="bg-primary">
            <CommandGroup>
              {Object.entries(emails).map(([platform, platformEmails]) => {
                return platformEmails.map((email) => {
                  return (
                    <CommandItem
                      key={email + platform}
                      value={email + " " + platform}
                      onSelect={(currentValue) => {
                        handleSwitchAccount(currentValue, platform as Platforms)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-main",
                          activeAccount.email === email &&
                            activeAccount.platform === platform
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Image
                        className="mr-2"
                        width={12}
                        height={12}
                        src={IMAGES[platform as Platforms]}
                        loading="lazy"
                        alt="button logo"
                      />
                      <Tooltip>
                        <TooltipTrigger className="overflow-hidden">
                          {" "}
                          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {email}
                          </p>
                        </TooltipTrigger>
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
  ) : (
    <Loading n={1} h="40px" w="193px" />
  )
}

export default UsersSelect
