export type Platforms = "google" | "outlook" 

export type TokenObject ={
  access_token: string;
  refresh_token: string;
}

export type Email = {
  subject: string;
  sender: string;
  sender_email: string;
  date: string;
  body: string;
}

export type Emails = {
  [key: string]: Email;
}

export type User = {
  email: string;
  name: string;
  [key: string] : any
}

export type Active = "inbox" | "uniBox"

export type Tokens = {
  [key in Platforms]: {
    [key: string]: TokenObject;
  }
}