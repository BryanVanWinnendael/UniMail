import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: {
    activeEmail: string,
  }
}

const initialState: InitialState = {
  value: {
    activeEmail: (typeof localStorage != 'undefined') ? localStorage.getItem("activeEmail") ?? "" : "",
  }
}

export const auth = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setActiveEmail: (state, action: PayloadAction<string>) => {
      localStorage.setItem("activeEmail", action.payload);
      state.value.activeEmail = action.payload;
    }
  }
});

export const { setActiveEmail } = auth.actions;
export default auth.reducer;