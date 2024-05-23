import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Home from "./pages/home/Home.jsx";
import Registration from "./pages/registration/Registration.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Task from "./pages/task/Task.jsx";
import Category from "./pages/category/Category.jsx";
import TaskCategory from "./pages/taskCategory/TaskCategory.jsx";
import TaskList from "./pages/taskList/TaskList.jsx";
import AssignTask from "./pages/assignTask/AssignTask.jsx";
import TaskAssignedtoMe from "./pages/taskAssignedtoMe/TaskAssignedtoMe.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<Layout />}>
        <Route index element={<ProtectedRoute element={<Home />} />} />
        <Route path="task" element={<ProtectedRoute element={<Task />} />} />
        <Route
          path="category"
          element={<ProtectedRoute element={<Category />} />}
        />
        <Route
          path="task-category"
          element={<ProtectedRoute element={<TaskCategory />} />}
        />
        <Route
          path="task-list"
          element={<ProtectedRoute element={<TaskList />} />}
        />
        <Route
          path="assign-task"
          element={<ProtectedRoute element={<AssignTask />} />}
        />
        <Route
          path="assignedto-me"
          element={<ProtectedRoute element={<TaskAssignedtoMe />} />}
        />
      </Route>
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
