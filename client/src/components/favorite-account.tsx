import useAuth from "@/hooks/useAuth"
import { useAppSelector } from "@/redux/store"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"
import { setFavoriteAccount } from "@/redux/features/settings-slice"
import { Platforms } from "@/types"

const FavoriteAccount = () => {
  const { getEmails } = useAuth()
  const dispatch = useDispatch()
  const emails = getEmails()
  const [open, setOpen] = useState(false)
  const favoriteAccount = useAppSelector(
    (state) => state.settingsReducer.value.favoriteAccount,
  )

  const handleSwitchAccount = (emailPlatform: string, platform: Platforms) => {
    const email = emailPlatform.split(" ")[0]
    dispatch(
      setFavoriteAccount({
        email,
        platform,
      }),
    )
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full  justify-between overflow-hidden"
        >
          <Tooltip>
            <TooltipTrigger className="overflow-hidden">
              {" "}
              <p className="truncate"> {favoriteAccount.email || "none"}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{favoriteAccount.email || "none"}</p>
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
                          favoriteAccount.email === email &&
                            favoriteAccount.platform === platform
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Tooltip>
                        <TooltipTrigger className="overflow-hidden">
                          {" "}
                          <p className="truncate">{email}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </CommandItem>
                  )
                })
              })}

              <CommandItem
                defaultChecked={true}
                key="none"
                value="none"
                onSelect={(currentValue) => {
                  handleSwitchAccount(currentValue, "gmail")
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-main",
                    favoriteAccount.email === "none" || !favoriteAccount.email
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <Tooltip>
                  <TooltipTrigger className="overflow-hidden">
                    {" "}
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      none
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>none</p>
                  </TooltipContent>
                </Tooltip>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default FavoriteAccount
