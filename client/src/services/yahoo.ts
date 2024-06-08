export const getAccessRefreshToken = async (code: string) => {
  const TOKEN_URL = "/api/proxy/access/yahoo"

  const data = {
    code,
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const parsedBody = await response.json()
  const { access_token, refresh_token, email } = parsedBody

  return { access_token, refresh_token, email }
}

export const refreshAccessToken = async (refresh_token: string) => {
  const url = "/api/proxy/refresh/yahoo"

  const data = {
    refresh_token,
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": " application/json",
    },
    body: JSON.stringify(data),
  })

  const parsedBody = await response.json()
  const { access_token: new_access_token } = parsedBody

  return new_access_token
}
