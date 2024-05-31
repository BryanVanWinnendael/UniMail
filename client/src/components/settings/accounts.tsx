import useAuth from "@/hooks/useAuth";
import { Platforms } from "@/types";
import GoogleLogoutButton from "../google/google-logout-button";
import OutlookLogoutButton from "../outlook/outlook-logout-button";
import GoogleLoginButton from "../google/google-login-button";
import OutlookLoginButton from "../outlook/outlook-login-button";

const Accounts = () => {
  const { getEmails } = useAuth();
	const emails = getEmails()
  const platforms: Platforms[] = ["google", "outlook"]

  return (
    <div className="p-5 flex flex-col h-full">
			<div className="mb-5">
				<h4 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">Add an account</h4>
				<div className="flex flex-col gap-2 w-fit mt-3">
					<GoogleLoginButton />
					<OutlookLoginButton />
				</div>
			</div>

			<div className="mb-5 h-full flex flex-col overflow-y-auto">
				<h4 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">Remove an account</h4>
				<div className="flex flex-col gap-2 w-fit mt-3 overflow-y-auto h-full pb-2 px-2">
					{platforms.map((platform) => {
						return emails[platform].map((email) => {
							if (platform === "google") {
								return <GoogleLogoutButton key={email} email={email} />
							} else {
								return <OutlookLogoutButton key={email} email={email} />
							}
						})
					})}
				</div>
			</div>
    </div>
  )
}

export default Accounts