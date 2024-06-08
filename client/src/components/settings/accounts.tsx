import useAuth from "@/hooks/useAuth"
import { Platforms } from "@/types"
import GmailLoginButton from "../gmail/gmail-login-button"
import GmailLogoutButton from "../gmail/gmail-logout-button"
import OutlookLoginButton from "../outlook/outlook-login-button"
import OutlookLogoutButton from "../outlook/outlook-logout-button"
import ImapLoginButton from "../imap/imap-login-button"
import ImapLogoutButton from "../imap/imap-logout-button"

const Accounts = () => {
  const { getEmails } = useAuth()
  const emails = getEmails()

  return (
    <div className="p-5 flex flex-col h-full w-full">
      <div className="mb-5 w-full">
        <h4 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Add an account
        </h4>
        <div className="flex flex-col gap-2 w-full mt-3">
          <GmailLoginButton />
          <OutlookLoginButton />
          <ImapLoginButton />
        </div>
      </div>

      <div className="mb-5 h-full flex flex-col overflow-y-auto">
        <h4 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Remove an account
        </h4>
        <div className="w-full flex flex-col gap-2 mt-3 overflow-y-auto overflow-x-hidden h-full pb-2 px-2">
          {Object.keys(emails).map((platform, index) => {
            const platformEmails = emails[platform as Platforms]
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  {platformEmails.map((email, index) => {
                    switch (platform) {
                      case "gmail":
                        return <GmailLogoutButton key={index} email={email} />
                      case "outlook":
                        return <OutlookLogoutButton key={index} email={email} />
                      case "imap":
                        return <ImapLogoutButton key={index} email={email} />
                      default:
                        return null
                    }
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Accounts
