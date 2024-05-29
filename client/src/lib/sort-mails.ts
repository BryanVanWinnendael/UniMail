import { Emails, UniMails, UserEmails } from "@/types";

export const dateSortUserMails = (emails: Emails, type: "asc" | "desc"): Emails  => {
  const sorted = Object.keys(emails).sort((a, b) => {
    if (type === "asc") {
      return new Date(emails[a].date).getTime() - new Date(emails[b].date).getTime()
    }
    return new Date(emails[b].date).getTime() - new Date(emails[a].date).getTime()
  }).reduce((acc, key) => {
    acc[key] = emails[key]
    return acc

  }, {} as Emails)

  return sorted
}

export const senderSortUserMails = (emails: Emails, type: "asc" | "desc"): Emails  => {
  const sorted = Object.keys(emails).sort((a, b) => {
    if (type === "asc") {
      return emails[a].sender.localeCompare(emails[b].sender)
    }
    return emails[b].sender.localeCompare(emails[a].sender)
  }).reduce((acc, key) => {
    acc[key] = emails[key]
    return acc

  }, {} as Emails)

  return sorted
}

export const subjectSortUserMails = (emails: Emails, type: "asc" | "desc"): Emails  => {
  const sorted = Object.keys(emails).sort((a, b) => {
    if (type === "asc") {
      return emails[a].subject.localeCompare(emails[b].subject)
    }
    return emails[b].subject.localeCompare(emails[a].subject)
  }).reduce((acc, key) => {
    acc[key] = emails[key]
    return acc

  }, {} as Emails)

  return sorted
}