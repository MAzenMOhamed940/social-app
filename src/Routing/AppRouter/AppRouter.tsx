import { createBrowserRouter } from "react-router";
import Layout from "../../Components/Layout/Layout";
import Posts from "../../Pages/Posts/Posts";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import NotFound from "../../Pages/NotFoumd/NotFound";
import ProtectedRoute from "../../Components/ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "../../Components/AuthProtectedRoute/AuthProtectedRoute";
import ChangePassword from "../../Pages/ChangePassword/ChangePassword";
import ProfilePage from "../../Pages/ProfilePage/ProfilePage";
import PostDetails from "../../Pages/Posts/PostDetails/PostDetails";





export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Posts /></ProtectedRoute> },
      { path: "posts", element: <ProtectedRoute><Posts /></ProtectedRoute> },
      { path: "profilePage", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
      { path: "changePassword", element: <ProtectedRoute><ChangePassword /></ProtectedRoute> },
      { path: "login", element:<AuthProtectedRoute><Login /></AuthProtectedRoute>  },
      { path: "register", element:<AuthProtectedRoute><Register /></AuthProtectedRoute>  },
      { path: "*", element: <NotFound /> },
    ],
  },
])

