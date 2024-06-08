import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownWideNarrow, Calendar, Mail, Send } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Emails, UniMails, UserEmails } from "@/types"
import { Dispatch, SetStateAction, useState } from "react"
import {
  dateSortUserMails,
  senderSortUserMails,
  subjectSortUserMails,
} from "@/lib/sort-mails"

const TYPES = [
  {
    name: "Date",
    description: "Sort by date",
    icon: <Calendar className="w-4 h-4 text-ring" />,
  },
  {
    name: "Sender",
    description: "Sort by sender",
    icon: <Send className="w-4 h-4 text-ring" />,
  },
  {
    name: "Subject",
    description: "Sort by subject",
    icon: <Mail className="w-4 h-4 text-ring" />,
  },
]

interface SortButtonProps {
  setEmails:
    | Dispatch<SetStateAction<UserEmails>>
    | Dispatch<SetStateAction<UniMails>>
  sortType: "user" | "uni"
  emails: UserEmails | UniMails
}

const SortButton = ({ setEmails, sortType, emails }: SortButtonProps) => {
  const [sortTypesOrder, setSortTypesOrder] = useState<{
    [key: string]: "asc" | "desc"
  }>({
    Date: "asc",
    Sender: "asc",
    Subject: "asc",
  })

  const handleSort = (type: string) => {
    switch (sortType) {
      case "user":
        handleSortUserMails(
          type,
          setEmails as Dispatch<SetStateAction<UserEmails>>,
        )
        break
      case "uni":
        handleSortUniMails(
          type,
          setEmails as Dispatch<SetStateAction<UniMails>>,
        )
        break
    }
  }

  const handleSortUserMails = (
    type: string,
    setNewMails: Dispatch<SetStateAction<UserEmails>>,
  ) => {
    const userEmail = emails as UserEmails
    const toSortEmails = userEmail.emails
    let sorted: Emails = {}
    switch (type) {
      case "Date":
        sorted = dateSortUserMails(toSortEmails, sortTypesOrder.Date)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Date: prev.Date === "asc" ? "desc" : "asc",
          }
        })
        break
      case "Sender":
        sorted = senderSortUserMails(toSortEmails, sortTypesOrder.Sender)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Sender === "asc" ? "desc" : "asc",
          }
        })
        break
      case "Subject":
        sorted = subjectSortUserMails(toSortEmails, sortTypesOrder.Sender)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Subject === "asc" ? "desc" : "asc",
          }
        })
        break
    }

    setNewMails((prev) => {
      return {
        ...prev,
        emails: sorted,
      }
    })
  }

  const handleSortUniMails = (
    type: string,
    setNewMails: Dispatch<SetStateAction<UniMails>>,
  ) => {
    const uniMails = emails as UniMails
    let sorted: Emails = {}
    let sortedUniMails: UniMails = {}
    Object.keys(uniMails).forEach((key) => {
      const toSortEmails = uniMails[key].emails

      switch (type) {
        case "Date":
          sorted = dateSortUserMails(toSortEmails, sortTypesOrder.Date)
          break
        case "Sender":
          sorted = senderSortUserMails(toSortEmails, sortTypesOrder.Sender)
          break
        case "Subject":
          sorted = subjectSortUserMails(toSortEmails, sortTypesOrder.Sender)
          break
      }

      sortedUniMails[key] = {
        ...uniMails[key],
        emails: sorted,
      }
    })

    switch (type) {
      case "Date":
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Date: prev.Date === "asc" ? "desc" : "asc",
          }
        })
        break
      case "Sender":
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Sender === "asc" ? "desc" : "asc",
          }
        })
        break
      case "Subject":
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Subject === "asc" ? "desc" : "asc",
          }
        })
        break
    }

    setNewMails(sortedUniMails)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger className="w-full text-left">
            <ArrowDownWideNarrow className="w-4 h-4 text-ring" />
          </TooltipTrigger>
          <TooltipContent>
            <p>sort</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-primary">
        {TYPES.map((type) => (
          <DropdownMenuItem
            key={type.name}
            onClick={() => handleSort(type.name)}
          >
            <Tooltip>
              <TooltipTrigger className="w-full text-left flex justify-between">
                <div className=" flex gap-2 items-center">
                  {type.icon}
                  {type.name}
                </div>
                {sortTypesOrder[type.name] === "asc" ? (
                  <ArrowDownWideNarrow className="w-4 h-4 text-ring" />
                ) : (
                  <ArrowDownWideNarrow className="w-4 h-4 text-ring transform rotate-180" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{type.description}</p>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortButton
