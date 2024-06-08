import { createSlice } from "@reduxjs/toolkit"

type InitialState = {
  value: {
    isOpen: boolean
    favoriteAccount: {
      email: string
      platform: string
    }
    sideView: boolean
  }
}

const getFavoriteEmail = () => {
  const favoriteAccount =
    typeof localStorage != "undefined"
      ? localStorage.getItem("favorite_account") || "{}"
      : "{}"
  return JSON.parse(favoriteAccount)
}

const getSideView = () => {
  const sideView =
    typeof localStorage != "undefined"
      ? localStorage.getItem("side_view") || "false"
      : "false"
  return sideView === "true"
}

const initialState: InitialState = {
  value: {
    isOpen: false,
    favoriteAccount: getFavoriteEmail(),
    sideView: getSideView(),
  },
}

export const settings = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    toggleDialog(state) {
      state.value.isOpen = !state.value.isOpen
    },
    setFavoriteAccount(state, action) {
      localStorage.setItem("favorite_account", JSON.stringify(action.payload))
      state.value.favoriteAccount = action.payload
    },
    setSideView(state, action) {
      localStorage.setItem("side_view", action.payload.toString())
      state.value.sideView = action.payload
    },
  },
})

export const { toggleDialog, setFavoriteAccount, setSideView } =
  settings.actions
export default settings.reducer
