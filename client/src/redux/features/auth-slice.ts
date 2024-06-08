import { Platforms } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

const getActiveAccount = () => {
  const favoriteAccount =
    typeof localStorage != "undefined"
      ? localStorage.getItem("favorite_account") ?? "{}"
      : "{}"
  const favoriteEmail = JSON.parse(favoriteAccount)?.email
  if (favoriteEmail !== "none" && favoriteEmail) {
    localStorage.setItem("active_account", favoriteAccount)
    return JSON.parse(favoriteAccount)
  }
  const activeAccount =
    typeof localStorage != "undefined"
      ? localStorage.getItem("active_account") || "{}"
      : "{}"
  return JSON.parse(activeAccount)
}

type InitialState = {
  value: {
    activeAccount: {
      email: string
      platform: Platforms
    }
  }
}

const initialState: InitialState = {
  value: {
    activeAccount: getActiveAccount(),
  },
}

export const auth = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setActiveAccount: (state, action) => {
      state.value.activeAccount = action.payload
      if (typeof localStorage != "undefined") {
        localStorage.setItem("active_account", JSON.stringify(action.payload))
      }
    },
  },
})

export const { setActiveAccount } = auth.actions
export default auth.reducer
