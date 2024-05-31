import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: {
    ambientColor: [number, number, number] | null,
  }
}

const initialState: InitialState = {
  value: {
    ambientColor: null
  }
}

export const ambientColor = createSlice({
  name: 'ambient-color',
  initialState: initialState,
  reducers: {
    setAmbientColor: (state, action: PayloadAction<[number, number, number] | null>) => {
      state.value.ambientColor = action.payload;
    }
  }
});

export const { setAmbientColor } = ambientColor.actions;
export default ambientColor.reducer;