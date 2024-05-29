import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownWideNarrow } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Emails, UniMails, UserEmails } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { dateSortUserMails, senderSortUserMails, subjectSortUserMails } from "@/lib/sort-mails";


const TYPES = [
  {
    name: "Date",
    description: "Sort by date"
  },
  {
    name: "Sender",
    description: "Sort by sender"
  },
  {
    name: "Subject",
    description: "Sort by subject"
  }
]

interface SortButtonProps {
  setEmails: Dispatch<SetStateAction<UserEmails>> | Dispatch<SetStateAction<UniMails>>
  sortType: "user" | "uni"
  emails: UserEmails | UniMails
}

const SortButton = ({ setEmails, sortType, emails }: SortButtonProps) => {
  const [sortTypesOrder, setSortTypesOrder] = useState<{[key: string]: "asc" | "desc"}>({
    Date: "asc",
    Sender: "asc",
    Subject: "asc"
  })

  const handleSort = (type: string) => {
    if (sortType === "user") {
      handleSortUserMails(type, setEmails as Dispatch<SetStateAction<UserEmails>>)
    } else {
      handleSortUniMails(type, setEmails as Dispatch<SetStateAction<UniMails>>)
    }
    
  }
  
  const handleSortUserMails = (type: string, setNewMails: Dispatch<SetStateAction<UserEmails>>) => {
    const userEmail = emails as UserEmails
    const toSortEmails = userEmail.emails
    let sorted: Emails = {}
    if (type === "Date") {
      sorted = dateSortUserMails(toSortEmails, sortTypesOrder.Date)
      setSortTypesOrder((prev) => {
        return {
          ...prev,
          Date: prev.Date === "asc" ? "desc" : "asc"
        };
      });
    } else if (type === "Sender") {
      sorted = senderSortUserMails(toSortEmails, sortTypesOrder.Sender)
      setSortTypesOrder((prev) => {
        return {
          ...prev,
          Sender: prev.Sender === "asc" ? "desc" : "asc"
        };
      });
    } else if (type === "Subject") {
      sorted = subjectSortUserMails(toSortEmails, sortTypesOrder.Sender)
      setSortTypesOrder((prev) => {
        return {
          ...prev,
          Sender: prev.Subject === "asc" ? "desc" : "asc"
        };
      });
    }

    setNewMails((prev) => {
      return {
        ...prev,
        emails: sorted
      }
    })
  };

  const handleSortUniMails = (type: string, setNewMails: Dispatch<SetStateAction<UniMails>>) => {
    const uniMails = emails as UniMails
    Object.keys(uniMails).forEach((key) => {
      const toSortEmails = uniMails[key].emails
      let sorted: Emails = {}

      if (type === "Date") {
        sorted = dateSortUserMails(toSortEmails, sortTypesOrder.Date)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Date: prev.Date === "asc" ? "desc" : "asc"
          };
        });
      } else if (type === "Sender") {
        sorted = senderSortUserMails(toSortEmails, sortTypesOrder.Sender)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Sender === "asc" ? "desc" : "asc"
          };
        });
      } else if (type === "Subject") {
        sorted = subjectSortUserMails(toSortEmails, sortTypesOrder.Sender)
        setSortTypesOrder((prev) => {
          return {
            ...prev,
            Sender: prev.Subject === "asc" ? "desc" : "asc"
          };
        });
      }

      setNewMails((prev) => {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            emails: sorted
          }
        }
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger className="w-full text-left"> <ArrowDownWideNarrow className="w-4 h-4 text-black"/></TooltipTrigger>
          <TooltipContent>
            <p>sort</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>

        {
          TYPES.map((type) => (
            <DropdownMenuItem key={type.name} onClick={() => handleSort(type.name)}>
              <Tooltip>
                <TooltipTrigger className="w-full text-left">{type.name}</TooltipTrigger>
                <TooltipContent>
                  <p>{type.description}</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortButton