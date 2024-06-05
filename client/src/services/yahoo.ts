export const getAccessRefreshToken = async (code: string) => {
  const TOKEN_URL = 'https://api.login.yahoo.com/oauth2/get_token'
  const CLIENT_ID = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_YAHOO_CLIENT_SECRET
  const REDIRECT_URI = process.env.NEXT_PUBLIC_YAHOO_REDIRECT_URI

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Yahoo Client ID or Client Secret');
  }
  
  const data = {
    'code': code,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'redirect_uri': REDIRECT_URI,
    'grant_type': 'authorization_code'
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data as any).toString(),
  })

  const responseBody = await response.text();
  const parsedBody = JSON.parse(responseBody)
  const { access_token, refresh_token } = parsedBody

  return { access_token, refresh_token }
}

