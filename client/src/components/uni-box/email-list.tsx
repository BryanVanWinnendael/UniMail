import { Emails, Platforms } from "@/types";
import Item from "@/components/inbox/item";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_COLOR } from "@/lib/utils";

interface EmailListProps {
  emails: { email: string; messages: Emails, platform: Platforms }[];
  handleItemClick: (email: string, id: string) => void;
}

const EmailList = ({ emails, handleItemClick }: EmailListProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      { Object.keys(emails).length > 0 &&  emails.map(({ email, messages, platform }) => (
        Object.keys(messages).length > 0 && (
          <div key={email} id={email}>
            <Badge style={{
              backgroundColor: PLATFORM_COLOR[platform].bg,
              color: PLATFORM_COLOR[platform].text
            }}>
              {email}
            </Badge>
            <div className="flex flex-col gap-2 w-full mt-2">
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
        )
        
      ))}
    </div>
  );
};

export default EmailList;
