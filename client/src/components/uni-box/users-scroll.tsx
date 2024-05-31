import { Platforms, Tokens } from '@/types'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { GalleryVertical } from 'lucide-react'
import { PLATFORM_COLOR } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface UsersScrollProps {
  users: Tokens
}

const UsersScroll = ({ users }: UsersScrollProps) => {
  const { theme, systemTheme } = useTheme()

  const scrollToEmail = (email: string) => {
    const emailDoc = document.getElementById(email)
    if (emailDoc) {
      emailDoc.scrollIntoView({ behavior: "smooth" })
    }
  }

  const getPlatformColors =(platform: Platforms) => {
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      const bg = PLATFORM_COLOR[platform].dark.bg
      const text = PLATFORM_COLOR[platform].dark.text
      return {
        bg,
        text
      }
    } 
    const bg = PLATFORM_COLOR[platform].light.bg
    const text = PLATFORM_COLOR[platform].light.text
    return {
      bg,
      text
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {
          <Tooltip>
          <TooltipTrigger><GalleryVertical className="w-4 h-4 text-ring"/></TooltipTrigger>
          <TooltipContent>
            <p>scroll to</p>
          </TooltipContent>
        </Tooltip>
         
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {
          Object.keys(users).map((platform) => {
            const emails = users[platform as Platforms]
            return Object.keys(emails).map((email) => {
              return (
                <DropdownMenuItem onClick={() => scrollToEmail(email)} key={email}>
                  <Tooltip>
                    <TooltipTrigger className="text-left flex gap-2 items-center w-28">
                      <div style={{
                        backgroundColor: getPlatformColors(platform as Platforms).text,
                      }} className='flex-shrink-0 w-4 h-4 rounded-full'></div>
                      <p className='truncate w-full'> {email}</p>
                    </TooltipTrigger>
                    <TooltipContent >
                      <p>{email}</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
              )
            })
          })
        }
      
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UsersScroll