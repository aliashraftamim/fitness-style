import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TForgotPassword = {
  email: string | null;
  token: string | null;
};

const initialState: TForgotPassword = {
  email: null,
  token: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setForgotPassToken: (
      state,
      action: PayloadAction<{ email: string; token: string }>
    ) => {
      const { email, token } = action.payload;
      state.email = email;
      state.token = token;
    },

    removeForgotPassToken: (state) => {
      state.email = null;
      state.token = null;
    },
  },
});

export const { setForgotPassToken, removeForgotPassToken } =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
