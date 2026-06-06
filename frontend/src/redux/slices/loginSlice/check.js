import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
    initialState: {
    token: typeof window !== "undefined"
      ? localStorage.getItem("token")
      : window.location.pathname === "/login",
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export const selectToken = (state) => state.auth.token; 
export default authSlice.reducer;