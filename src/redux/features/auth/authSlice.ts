import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../../store";

export type TUser = {
  _id: string;
  email: string;
  firstName: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      if (user.role !== "ADMIN" && user.role !== "SUPPER_ADMIN") {
        throw new Error("Please login as a administrator");
      }

      state.user = user;
      if (token) {
        state.token = `Bearer ${token}`;
      }

      Cookies.set("authToken", token, { expires: 7, path: "/" });
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("authToken", { path: "/" });
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
