import useAuth from "@/hooks/useAuth";
import { getUserEmails } from "@/services/email";
import { Emails, Platforms } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Toolbar from "../inbox/toolbar";
import Loading from "../inbox/loading";
import FilteredEmails from "./filtered-emails";
import Email from "../inbox/email";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";

type UniMails = {
  [key: string]: Emails; // Key is the email address
};

const Index = () => {
  const [activeMail, setActiveMail] = useState<{
    email: string;
    id: string;
  }>({
    email: "",
    id: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [emails, setEmails] = useState<UniMails>({});
  const { getEmailsToken } = useAuth();
  const emailsCount = useMemo(
    () =>
      Object.keys(emails).reduce(
        (acc, email) => acc + Object.keys(emails[email]).length,
        0
      ),
    [emails]
  );
  const scrollPositionRef = useRef<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [newUser, setNewUser] = useState<boolean>(true);
  const activeAccount = useAppSelector(
    (state) => state.authReducer.value.activeEmail
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    }
    getEmails(true);
  };

  const getEmails = useCallback(async (refresh?: boolean) => {
    setLoading(true);
    const emailsToken = getEmailsToken();
    const fetchPromises = [];

    for (const platform in emailsToken) {
      const emails = emailsToken[platform as Platforms];
      for (const email in emails) {
        const token = emails[email];
        fetchPromises.push(getUserEmails(token, platform as Platforms, email));
      }
    }

    try {
      const results = await Promise.all(fetchPromises);
      const newEmails: UniMails = {};

      results.forEach((res, index) => {
        if (res.error) {
          console.error("Error fetching emails:", res.error);
          toast(`Error fetching emails, please try again later`, {
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
            duration: 999000,
          });
        }
        const platform = Object.keys(emailsToken)[Math.floor(index / Object.keys(emailsToken[Object.keys(emailsToken)[0] as Platforms]).length)]
        const email = Object.keys(emailsToken[platform as Platforms])[index % Object.keys(emailsToken[platform as Platforms]).length]
        newEmails[email] = res;
      });

      if (refresh) {
        const count_new = Object.keys(newEmails).reduce(
          (acc, email) => acc + Object.keys(newEmails[email]).length,
          0
        ) - emailsCount;
        toast(`You have ${count_new} new emails`, {
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

      setEmails(newEmails);
      setLoading(false);
      setNewUser(false);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }, [emailsCount, getEmailsToken]);

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
    <div className="lg:h-screen h-full w-full bg-neutral-50 gap-3 flex flex-col py-4 lg:pl-0 pl-4 pr-4 overflow-hidden">
      <Toolbar
        loading={loading}
        refresh={refresh}
        emailsCount={emailsCount}
        setSearchQuery={setSearchQuery}
      />
      <div
        className="bg-white rounded-md h-full w-full overflow-y-auto p-4 border border-slate-200 shadow-md"
        ref={scrollContainerRef}
      >
        {newUser ? <Loading n={10} /> : (activeMail.id ? <Email sender_email={emails[activeMail.email][activeMail.id].sender_email} encoded_body={emails[activeMail.email][activeMail.id].body} handleBackToInbox={handleBackToInbox} /> : <FilteredEmails emails={emails} searchQuery={searchQuery} handleItemClick={handleItemClick} />)}
      </div>
    </div>
  )
};

export default Index;
