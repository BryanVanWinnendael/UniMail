import { EmailResponse, Platforms, TokenObject } from "@/types"

enum EnumPlatforms {
  google = 'gmail',
  outlook = 'outlook',
  yahoo = 'yahoo'
}

export const getUserEmails = async (token: TokenObject, type: Platforms, email: string): Promise<EmailResponse> => {
  const platform = EnumPlatforms[type]
  const API_URL = '/api/proxy/'
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