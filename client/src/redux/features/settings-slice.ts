import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  value: {
    isOpen: boolean,
    favoriteAccount: string,
  }
}

const initialState: InitialState = {
  value: {
    isOpen: false,
    favoriteAccount: (typeof localStorage != 'undefined') ? localStorage.getItem("favoriteAccount") ?? "" : "",
  }
}

export const settings = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    toggleDialog(state) {
      state.value.isOpen = !state.value.isOpen;
    },
    setFavoriteAccount(state, action) {
      localStorage.setItem("favoriteAccount", action.payload);
      state.value.favoriteAccount = action.payload;
    }
  }
});

export const { toggleDialog, setFavoriteAccount } = settings.actions;
export default settings.reducer;