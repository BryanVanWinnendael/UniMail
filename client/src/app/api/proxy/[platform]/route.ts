import https from "https"
import axios from "axios"

// Proxy for fetching emails form the server
export async function GET(
  req: Request,
  { params }: { params: { platform: string } },
) {
  const url = process.env.NEXT_PUBLIC_API_URL + params.platform
  const authorization = req.headers.get("Authorization")
  const email = req.headers.get("Email")
  const refreshToken = req.headers.get("Refresh-Token")
  const imapServer = req.headers.get("Imap-Server")
  const imapPort = req.headers.get("Imap-Port")

  try {
    const response = await axios({
      url,
      method: "GET",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        "Refresh-Token": refreshToken,
        Email: email,
        "Imap-Server": imapServer,
        "Imap-Port": imapPort,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: req.body,
    })

    return Response.json(response.data)
  } catch (error) {
    return Response.json(error)
  }
}
