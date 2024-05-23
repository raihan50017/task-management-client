// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";
import categoryReducer from "../features/categories/categorySlice";
import taskListReducer from "../features/taskLists/taskListSlice";
import userReducer from "../features/users/userSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    categories: categoryReducer,
    taskLists: taskListReducer,
    users: userReducer,
  },
});

export default store;
