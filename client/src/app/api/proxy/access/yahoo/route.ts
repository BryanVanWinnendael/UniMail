import https from "https"
import axios from "axios"

export async function POST(req: Request) {
  const url = "https://api.login.yahoo.com/oauth2/get_token"
  const CLIENT_ID = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_YAHOO_CLIENT_SECRET
  const REDIRECT_URI = process.env.NEXT_PUBLIC_YAHOO_REDIRECT_URI

  const body = await req.text()
  const { code } = JSON.parse(body)

  const data = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
  } as any).toString()

  try {
    const tokenResponse = await axios({
      url,
      method: "POST",
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: data,
    })
    const { access_token, refresh_token } = tokenResponse.data

    const infoUrl = "https://api.login.yahoo.com/openid/v1/userinfo"
    const emailResponse = await axios({
      url: infoUrl,
      method: "GET",
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const email = emailResponse.data.email

    return Response.json({ access_token, refresh_token, email })
  } catch (error) {
    console.log(error)
    return Response.json(error)
  }
}
