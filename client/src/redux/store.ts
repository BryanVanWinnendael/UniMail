import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth-slice"
import settingsReducer from "./features/settings-slice"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    authReducer,
    settingsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector