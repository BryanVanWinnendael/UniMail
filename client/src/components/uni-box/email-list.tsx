import { Emails } from "@/types";
import Item from "@/components/inbox/item";
import { Badge } from "@/components/ui/badge";

interface EmailListProps {
  emails: { email: string; messages: Emails }[];
  handleItemClick: (email: string, id: string) => void;
}

const EmailList = ({ emails, handleItemClick }: EmailListProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {emails.map(({ email, messages }) => (
        <div key={email}>
          <Badge variant="default" className="mb-2">
            {email}
          </Badge>
          <div className="flex flex-col gap-2 w-full">
            {Object.keys(messages).map((key) => (
              <Item
                key={key}
                id={key}
                handleItemClick={() => handleItemClick(email, key)}
                email={messages[key]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
