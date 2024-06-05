import { createSlice } from '@reduxjs/toolkit';


const getActiveEmail = () => {
  const favoriteAccount = (typeof localStorage != 'undefined') ? localStorage.getItem("favoriteAccount") ?? "" : "";
  if (favoriteAccount === "none" || !favoriteAccount) {
    return (typeof localStorage != 'undefined') ? localStorage.getItem("activeEmail") ?? "" : "";
  }
  localStorage.setItem("activeEmail", favoriteAccount);
  return favoriteAccount;
}

type InitialState = {
  value: {
    activeEmail: string,
  }
}

const initialState: InitialState = {
  value: {
    activeEmail: getActiveEmail(),
  }
}

export const auth = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setActiveEmail: (state, action) => {
      localStorage.setItem("activeEmail", action.payload);
      state.value.activeEmail = action.payload;
    }
  }
});

export const { setActiveEmail } = auth.actions;
export default auth.reducer;