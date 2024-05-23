import { Emails } from "@/types";
import EmailList from "./email-list";

interface FilteredEmailsProps {
  emails: { [key: string]: Emails };
  searchQuery: string;
  handleItemClick: (email: string, id: string) => void;
}

const FilteredEmails = ({
  emails,
  searchQuery,
  handleItemClick,
}: FilteredEmailsProps) => {
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const filteredEmails = Object.keys(emails)
    .map((email) => {
      const filteredMessages = Object.keys(emails[email])
        .filter((key) => {
          const message = emails[email][key];
          const subject = message.subject?.toLowerCase() || "";
          const sender = message.sender_email?.toLowerCase() || "";
          return (
            subject.includes(lowerCaseSearchQuery) ||
            sender.includes(lowerCaseSearchQuery)
          );
        })
        .reduce((acc, key) => {
          acc[key] = emails[email][key];
          return acc;
        }, {} as Emails);

      return { email, messages: filteredMessages };
    })
    .filter(
      ({ email, messages }) =>
        email.toLowerCase().includes(lowerCaseSearchQuery) ||
        Object.keys(messages).length > 0
    );

  if (filteredEmails.length === 0) {
    return <p>No matching emails found</p>;
  }

  return <EmailList emails={filteredEmails} handleItemClick={handleItemClick} />;
};

export default FilteredEmails;
