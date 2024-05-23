import { createSlice } from "@reduxjs/toolkit";

// Check if token exists in local storage
const authData = JSON.parse(localStorage.getItem("auth-data"));
const token = authData ? authData.access_token : null;
const initialState = {
  token: token, // Set token from local storage
  isAuthenticated: !!token, // Set isAuthenticated based on token existence
  data: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.data = action.payload.user;
      state.token = action.payload.token;

      // Store token in local storage upon successful login
      localStorage.setItem(
        "auth-data",
        JSON.stringify({
          access_token: action.payload.token,
          data: action.payload.data,
        })
      );
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.data = null;
      state.token = null;

      // Clear token from local storage upon logout
      localStorage.removeItem("auth-data");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
