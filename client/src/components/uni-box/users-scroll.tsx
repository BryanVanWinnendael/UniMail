import { Platforms, Tokens } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { GalleryVertical } from "lucide-react"
import { IMAGES } from "@/lib/utils"
import Image from "next/image"

interface UsersScrollProps {
  users: Tokens
}

const UsersScroll = ({ users }: UsersScrollProps) => {
  const scrollToEmail = (email: string) => {
    const emailDoc = document.getElementById(email)
    if (emailDoc) {
      emailDoc.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {
          <Tooltip>
            <TooltipTrigger>
              <GalleryVertical className="w-4 h-4 text-ring" />
            </TooltipTrigger>
            <TooltipContent>
              <p>scroll to</p>
            </TooltipContent>
          </Tooltip>
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(users).map((platform) => {
          const emails = users[platform as Platforms]
          return Object.keys(emails).map((email) => {
            return (
              <DropdownMenuItem
                onClick={() => scrollToEmail(email)}
                key={email}
              >
                <Tooltip>
                  <TooltipTrigger className="text-left flex gap-2 items-center w-28">
                    <Image
                      width={12}
                      height={12}
                      src={IMAGES[platform as Platforms]}
                      loading="lazy"
                      alt="button logo"
                    />
                    <p className="truncate w-full"> {email}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{email}</p>
                  </TooltipContent>
                </Tooltip>
              </DropdownMenuItem>
            )
          })
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UsersScroll
