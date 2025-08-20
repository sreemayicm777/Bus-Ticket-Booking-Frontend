import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
