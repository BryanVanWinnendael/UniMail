import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  value: {
    isOpen: boolean,
  }
}

const initialState: InitialState = {
  value: {
    isOpen: false,
  }
}

export const settings = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    toggleDialog(state) {
      state.value.isOpen = !state.value.isOpen;
    },
  }
});

export const { toggleDialog } = settings.actions;
export default settings.reducer;