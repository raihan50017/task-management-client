import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../hooks/axios";

// Utility function to handle rejected promises
const handleRejected = (state, action) => {
  state.status = "failed";
  state.error = action.payload ? action.payload : action.error.message;
};

// Fetch task lists thunk
export const fetchTaskLists = createAsyncThunk(
  "taskLists/fetchTaskLists",
  async () => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    const response = await apiClient.get("/tasklist/fetch", {
      headers: {
        Authorization: token,
      },
    });
    return response.data.taskLists;
  }
);

// Create task list thunk
export const addNewTaskList = createAsyncThunk(
  "taskLists/addNewTaskList",
  async (taskListData, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      const response = await apiClient.post("/tasklist/create", taskListData, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.taskList;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Delete task list thunk
export const deleteTaskList = createAsyncThunk(
  "taskLists/deleteTaskList",
  async (taskListId, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      await apiClient.delete(`/tasklist/${taskListId}`, {
        headers: {
          Authorization: token,
        },
      });
      return taskListId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Update task list thunk
export const updateTaskList = createAsyncThunk(
  "taskLists/updateTaskList",
  async ({ taskListId, taskListData }, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      const response = await apiClient.patch(
        `/tasklist/${taskListId}`,
        taskListData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.taskList;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  taskLists: [],
  status: "idle",
  error: null,
};

const taskListSlice = createSlice({
  name: "taskLists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskLists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTaskLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskLists = action.payload;
      })
      .addCase(fetchTaskLists.rejected, handleRejected)
      .addCase(addNewTaskList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewTaskList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskLists.push(action.payload);
      })
      .addCase(addNewTaskList.rejected, handleRejected)
      .addCase(deleteTaskList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTaskList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskLists = state.taskLists.filter(
          (taskList) => taskList._id !== action.payload
        );
      })
      .addCase(deleteTaskList.rejected, handleRejected)
      .addCase(updateTaskList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskLists = state.taskLists.map((taskList) =>
          taskList._id === action.payload._id ? action.payload : taskList
        );
      })
      .addCase(updateTaskList.rejected, handleRejected);
  },
});

export default taskListSlice.reducer;
