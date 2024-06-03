import { db } from "@/db/dexie";
import { UserEmails } from "@/types";
import { useCallback } from "react";

const useCache = () => {

  const updateCache = useCallback(async (email: string, userEmails: UserEmails) => {
    const userCacheExists = await db.emails.get(email);
    if (!userCacheExists) {
      await addCache(email, userEmails);
      return;
    }
    await db.emails.update(email, {
      userEmails: userEmails
    }
    );
  },[])

  const addCache = async (email: string, userEmails: UserEmails) => {
    await db.emails.add({
      id: email,
      userEmails: userEmails
    });
  }

  const getCache = useCallback(async (key: string) => {
    const emails = await db.emails.toArray()
    return emails.find((email) => email.id === key)?.userEmails
  },[])

  const removeCache = useCallback(async (key: string) => {
    await db.emails.delete(key)
  },[])

  return {
    getCache,
    updateCache,
    addCache,
    removeCache
  }
}

export default useCache