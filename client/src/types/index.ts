export type Platforms = "gmail" | "outlook" | "yahoo" | "imap"

export type TokenObject = {
  access_token: string
  refresh_token: string
  imap_server?: string
  imap_port?: string
}

export type EmailResponse = {
  data?: UserEmails
  error?: {
    user: string
    message: string
  }
}

export type Email = {
  subject: string
  sender: string
  sender_email: string
  receiver: string
  date: string
  body: string
}

export type Emails = {
  [key: string]: Email
}

export type UserEmails = {
  user: string
  emails: Emails
  platform: Platforms
}

export type UniMails = {
  [key: string]: UserEmails
}

export type User = {
  email: string
  name: string
  [key: string]: any
}

export type Tokens = {
  [key in Platforms]: {
    [key: string]: TokenObject
  }
}

export type PlatformsEmails = {
  [key in Platforms]: string[]
}

export type SummarizeResponse = {
  data?:{
    response: string
  }
  error?: {
    response: string
  }
}
