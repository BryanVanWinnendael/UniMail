import { TokenObject } from "@/types"

export const tryConnection = async (
  token: TokenObject,
  email: string,
): Promise<{
  success: boolean
  message: string
}> => {
  const url = process.env.NEXT_PUBLIC_API_URL + "imap"
  const body = {
    email,
    imap_server: token.imap_server,
    imap_port: token.imap_port,
  }

  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      console.log("Error trying connection: ", error)
      return { success: false, message: "Error trying connection" }
    })
}
