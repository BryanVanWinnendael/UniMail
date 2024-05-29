import useAuth from "@/hooks/useAuth";
import { getUserEmails } from "@/services/email";
import { Platforms, UniMails } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "../inbox/toolbar";
import Loading from "../inbox/loading";
import FilteredEmails from "./filtered-emails";
import Email from "../inbox/email";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";

interface IndexProps {
  setEmailsCount: (n: number) => void;
}

const Index = ({ setEmailsCount } : IndexProps) => {
  const [activeMail, setActiveMail] = useState<{
    email: string;
    id: string;
  }>({
    email: "",
    id: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmails, setUserEmails] = useState<UniMails>({});
  const emailsCount = useMemo(
    () =>
      Object.keys(userEmails).reduce(
        (acc, email) => acc + Object.keys(userEmails[email].emails).length,
        0
      ),
    [userEmails]
  );
  const { getEmailsToken } = useAuth();
  const scrollPositionRef = useRef<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hardRefresh, setHardRefresh] = useState<boolean>(true);
  const activeAccount = useAppSelector(
    (state) => state.authReducer.value.activeEmail
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fullScreenEmail, setFullScreenEmail] = useState(false);

  const handleBackToInbox = () => {
    setActiveMail({
      email: "",
      id: "",
    });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current
    }
  };

  const handleItemClick = (email: string, id: string) => {
    setActiveMail({
      email,
      id,
    });
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop
      scrollContainerRef.current.scrollTop = 0
    }
  };

  const refresh = (type: "hard" | "soft") => {
    if (type === "hard") {
      const latest_times = localStorage.getItem("latest_time");
      const latest_times_json = JSON.parse(latest_times || "{}");
      for (const email in latest_times_json) {
        latest_times_json[email] = 0;
      }

      localStorage.setItem("latest_time", JSON.stringify(latest_times_json));
      setHardRefresh(true)
    }
    getEmails(true);
  };

  const getEmails = useCallback(async (refresh?: boolean) => {
    setEmailsCount(0)
    setLoading(true);
    const emailsToken = getEmailsToken();
    const fetchPromises = [];
    const newEmails: UniMails = {};
    let countNewEmails = 0

    for (const platform in emailsToken) {
      const emails = emailsToken[platform as Platforms];
      for (const email in emails) {
        const token = emails[email];
        fetchPromises.push(getUserEmails(token, platform as Platforms, email));
      }
    }

    try {
      const results = await Promise.all(fetchPromises);
     
      results.forEach((res, _) => {
        if (res.error) {
          console.error("Error fetching emails:", res.error);
          toast(`Error fetching emails, please try again later`, {
            id: "error-toast",
            action: {
              label: "Close",
              onClick: () => console.log("Close"),
            },
            classNames: {
              toast: "!bg-red-600",
              title: "!text-secondary",
              actionButton: "!bg-secondary",
              cancelButton: "!bg-secondary",
              closeButton: "!bg-secondary",
            },
          });
        } else if (res.data) {
          const email = res.data.user
          newEmails[email] = res.data;
          
          countNewEmails += Object.keys(res.data.emails).length
        } 
      });

      setLoading(false);
      
      setEmailsCount(countNewEmails);
      setUserEmails(newEmails);

      if (refresh) {
        console.log(emailsCount, countNewEmails)
        const newEmails = countNewEmails - emailsCount;
        toast(`You have ${newEmails} new emails`, {
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
          classNames: {
            toast: "!bg-primary",
            title: "!text-secondary",
            actionButton: "!bg-secondary",
            cancelButton: "!bg-secondary",
            closeButton: "!bg-secondary",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }

    setHardRefresh(false);
  }, [emailsCount, getEmailsToken, setEmailsCount]);

  useEffect(() => {
    getEmails();
  }, [getEmails, activeAccount]);

  useEffect(() => {
    if (!activeMail.id) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current
      }
    }
  }, [activeMail])

  return (
    <div className="h-full w-full gap-3 flex flex-col pb-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <div 
        className="bg-white rounded-md h-full w-full p-4 overflow-hidden shadow shadow-zinc-900/5 flex flex-col" 
      >
        <Toolbar
          searchQuery={searchQuery}
          handleBackToInbox={handleBackToInbox}
          fullScreenEmail={fullScreenEmail} 
          setFullScreenEmail={setFullScreenEmail}
          loading={loading}
          refresh={refresh}
          setSearchQuery={setSearchQuery}
          sender_email={userEmails[activeMail.email] ? userEmails[activeMail.email].emails[activeMail.id].sender_email : null}
          setEmails={setUserEmails}
          sortType="uni"
          emails={userEmails}
          users={getEmailsToken()}
        />
        <div className="overflow-y-auto h-full"
        ref={scrollContainerRef}
        >
          {hardRefresh ? <Loading n={10} /> 
          : (activeMail.id ? <Email fullScreenEmail={fullScreenEmail} setFullScreenEmail={setFullScreenEmail} encoded_body={userEmails[activeMail.email].emails[activeMail.id].body}/> 
          : <FilteredEmails userEmails={userEmails} searchQuery={searchQuery} handleItemClick={handleItemClick} />)}
        </div>
      </div>
    </div>
  )
};

export default Index;
