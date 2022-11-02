import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: null | any;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;
