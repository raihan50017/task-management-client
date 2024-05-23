import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../hooks/axios";

// Utility function to handle rejected promises
const handleRejected = (state, action) => {
  state.status = "failed";
  state.error = action.payload ? action.payload : action.error.message;
};

// Fetch tasks thunk
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const authData = JSON.parse(localStorage.getItem("auth-data"));
  const token = authData ? authData.access_token : null;
  const response = await apiClient.get("/task/fetch", {
    headers: {
      Authorization: token,
    },
  });
  return response.data.tasks;
});

// Fetch tasks thunk
export const fetchTaskAssignedtoMe = createAsyncThunk(
  "tasks/fetchTaskAssignedtoMe",
  async () => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    const response = await apiClient.get("/task/fetch-assignedto-me", {
      headers: {
        Authorization: token,
      },
    });
    return response.data.tasks;
  }
);

// Create task thunk
export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (taskData, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      const response = await apiClient.post("/task/create", taskData, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.task;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Delete task thunk
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      await apiClient.delete(`/task/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });
      return taskId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Update task thunk
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    const authData = JSON.parse(localStorage.getItem("auth-data"));
    const token = authData ? authData.access_token : null;
    try {
      const response = await apiClient.patch(`/task/${taskId}`, taskData, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.task;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  taskAssignedtoMe: [],
  status: "idle",
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, handleRejected)
      .addCase(fetchTaskAssignedtoMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTaskAssignedtoMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.taskAssignedtoMe = action.payload;
      })
      .addCase(fetchTaskAssignedtoMe.rejected, handleRejected)
      .addCase(addNewTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.push(action.payload);
      })
      .addCase(addNewTask.rejected, handleRejected)
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, handleRejected)
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, handleRejected);
  },
});

export default taskSlice.reducer;
