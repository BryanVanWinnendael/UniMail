import { db } from "@/db/dexie"
import { Platforms, UserEmails } from "@/types"
import { platform } from "os"
import { useCallback } from "react"

const useCache = () => {
  const updateCache = useCallback(
    async (
      account: { email: string; platform: Platforms },
      userEmails: UserEmails,
    ) => {
      const id = account.platform + account.email
      const userCacheExists = await db.emails.get(id)
      if (!userCacheExists) {
        await addCache(id, userEmails)
        return
      }
      await db.emails.update(id, {
        userEmails: userEmails,
      })
    },
    [],
  )

  const addCache = async (id: string, userEmails: UserEmails) => {
    await db.emails.add({
      id,
      userEmails: userEmails,
    })
  }

  const getCache = useCallback(async (id: string) => {
    const emails = await db.emails.toArray()
    return emails.find((email) => email.id === id)?.userEmails
  }, [])

  const removeCache = useCallback(async (id: string) => {
    await db.emails.delete(id)
  }, [])

  return {
    getCache,
    updateCache,
    addCache,
    removeCache,
  }
}

export default useCache
