import { SummarizeResponse } from "@/types"

export const summarize = async (text: string): Promise<SummarizeResponse> => {
  const token = localStorage.getItem("api_key")
  if (!token) return { error: { response: "No API key found" } }

  const url = "/api/proxy/summarize"
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      return { error }
    })
}
