import Item from './item';
import { Emails } from '@/types';

interface EmailListProps {
  emails: Emails;
  searchQuery: string;
  handleItemClick: (id: string) => void;
}

const EmailList = ({ emails, searchQuery, handleItemClick }: EmailListProps) => {
  const filteredEmails = Object.keys(emails).filter((key) => {
    const email = emails[key];
    const subject = email.subject?.toLowerCase() || '';
    const sender = email.sender_email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return subject.includes(query) || sender.includes(query);
  });

  if (filteredEmails.length === 0) {
    return <p>No emails</p>;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {filteredEmails.map((key) => {
        const email = emails[key];
        return (
          <Item key={key} id={key} email={email} handleItemClick={handleItemClick} />
        );
      })}
    </div>
  );
};

export default EmailList;
