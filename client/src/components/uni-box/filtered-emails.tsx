import { Emails, UniMails } from "@/types"
import EmailList from "./email-list"

interface FilteredEmailsProps {
  userEmails: UniMails
  searchQuery: string
  handleItemClick: (email: string, id: string) => void
}

const FilteredEmails = ({
  userEmails,
  searchQuery,
  handleItemClick,
}: FilteredEmailsProps) => {
  const lowerCaseSearchQuery = searchQuery.toLowerCase()
  const filteredEmails = Object.keys(userEmails)
    .map((email) => {
      const filteredMessages = Object.keys(userEmails[email].emails)
        .filter((key) => {
          const message = userEmails[email].emails[key]
          const subject = message.subject?.toLowerCase() || ""
          const sender = message.sender_email?.toLowerCase() || ""
          return (
            subject.includes(lowerCaseSearchQuery) ||
            sender.includes(lowerCaseSearchQuery)
          )
        })
        .reduce((acc, key) => {
          acc[key] = userEmails[email].emails[key]
          return acc
        }, {} as Emails)

      return {
        email,
        messages: filteredMessages,
        platform: userEmails[email].platform,
      }
    })
    .filter(
      ({ email, messages }) =>
        email.toLowerCase().includes(lowerCaseSearchQuery) ||
        Object.keys(messages).length > 0,
    )

  if (filteredEmails.length === 0) {
    return <p>No matching emails found</p>
  }

  return <EmailList emails={filteredEmails} handleItemClick={handleItemClick} />
}

export default FilteredEmails
