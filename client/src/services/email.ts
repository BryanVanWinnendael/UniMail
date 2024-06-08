import { EmailResponse, Platforms, TokenObject } from "@/types"

export const getUserEmails = async (
  token: TokenObject,
  platform: Platforms,
  email: string,
): Promise<EmailResponse> => {
  const API_URL = "/api/proxy/"
  let imap_server = ""
  let imap_port = ""

  if (platform === "imap") {
    imap_server = token.imap_server || ""
    imap_port = token.imap_port || ""
  }

  return await fetch(API_URL + platform, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
      "Refresh-Token": token.refresh_token,
      Email: email,
      "Imap-Server": imap_server,
      "Imap-Port": imap_port,
    },
  })
    .then(async (response) => {
      return response.json()
    })
    .catch((error) => {
      console.log("Error fetching emails: ", error)
      return { error }
    })
}
