// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../hooks/axios";

// Fetch users thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth-data"));
      const token = authData ? authData.access_token : null;
      if (!token) throw new Error("No auth token found");

      const response = await apiClient.get("/user/fetch", {
        headers: {
          Authorization: token,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return response.data.users;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default userSlice.reducer;
