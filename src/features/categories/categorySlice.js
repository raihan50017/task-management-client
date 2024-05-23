// src/features/categories/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../hooks/axios";

// Fetch categories thunk
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    const response = await apiClient.get("/category/fetch", {
      headers: {
        Authorization: token,
      },
    });

    return response.data.categories;
  }
);

// Add new category thunk
export const addNewCategory = createAsyncThunk(
  "categories/addNewCategory",
  async (categoryData, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      const response = await apiClient.post("/category/create", categoryData, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.category;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Delete category thunk
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      await apiClient.delete(`/category/${categoryId}`, {
        headers: {
          Authorization: token,
        },
      });
      return categoryId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default categorySlice.reducer;
