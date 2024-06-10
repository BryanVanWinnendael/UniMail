import https from "https"
import axios from "axios"

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_API_URL + "summarize"

  const authorization = req.headers.get("Authorization")
  const body = await req.text()
  const { text } = JSON.parse(body)

  const data = {
    text,
  }

  try {
    const response = await axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      data: data,
    })

    return Response.json(response.data)
  } catch (error) {
    return Response.json(error)
  }
}
