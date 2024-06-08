import { Emails, UserEmails } from "@/types"
import Dexie, { type EntityTable } from "dexie"

interface EmailCache {
  id: string
  userEmails: UserEmails
}

const db = new Dexie("EmailCache") as Dexie & {
  emails: EntityTable<
    EmailCache,
    "id" // primary key "id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  emails: "id, userEmails", // primary key "id" (for the runtime!)
})

export type { EmailCache }
export { db }
