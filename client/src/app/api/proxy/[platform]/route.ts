import https from 'https';
import axios from 'axios';

export async function GET(req: Request, { params }: { params: { platform: string } }) {
  const url = process.env.NEXT_PUBLIC_API_URL + params.platform
  const authorization = req.headers.get("Authorization");
  const email = req.headers.get("Email");
  const refreshToken = req.headers.get("Refresh-Token");

  try {
    const response = await axios({
      url,
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
        'Refresh-Token': refreshToken,
        'Email': email,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false 
      }),
      data: req.body
    });

    return Response.json(response.data)
  } catch (error) {
    return Response.json(error)
  }
};

