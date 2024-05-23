import { Emails, Platforms, TokenObject } from "@/types"

enum EnumPlatforms {
  google = 'gmail',
  outlook = 'outlook',
}

export const getUserEmails = async (token: TokenObject, type: Platforms, email: string): Promise<Emails | {error: any}> => {
  const platform = EnumPlatforms[type]
  const latest_time = localStorage.getItem("latest_time") || "{}"
  const latest_time_json = JSON.parse(latest_time)
  const latest_time_email = String(latest_time_json[email] || 0) 
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  return await fetch(API_URL + platform, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
      'Refresh-Token': token.refresh_token,
      'Latest-Email-Time': latest_time_email,
      'Email': email, 
    }
  })
  .then((response) => {
    return response.json()
  })
  .catch((error) => {
    return {error}
  })
}