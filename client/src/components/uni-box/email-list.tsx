import { Emails, Platforms } from "@/types";
import Item from "@/components/inbox/item";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_COLOR } from "@/lib/utils";
import { useTheme } from "next-themes";

interface EmailListProps {
  emails: { email: string; messages: Emails, platform: Platforms }[];
  handleItemClick: (email: string, id: string) => void;
}

const EmailList = ({ emails, handleItemClick,  }: EmailListProps) => {
  const { theme, systemTheme } = useTheme()

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
    <div className="flex flex-col gap-4 w-full">
      { Object.keys(emails).length > 0 &&  emails.map(({ email, messages, platform }) => (
        Object.keys(messages).length > 0 && (
          <div key={email} id={email}>
            <Badge 
              style={{
                backgroundColor: getPlatformColors(platform).bg,
                color: getPlatformColors(platform).text
              }}
            >
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
