import { EmailResponse, Platforms, TokenObject } from "@/types"

enum EnumPlatforms {
  google = 'gmail',
  outlook = 'outlook',
}

export const getUserEmails = async (token: TokenObject, type: Platforms, email: string): Promise<EmailResponse> => {
  const platform = EnumPlatforms[type]
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  return await fetch(API_URL + platform, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
      'Refresh-Token': token.refresh_token,
      'Email': email, 
    }
  })
  .then(async (response) => {
    return response.json()
  })
  .catch((error) => {
    return { error }
  })
}