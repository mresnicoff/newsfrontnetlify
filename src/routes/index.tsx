import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import Form from "../Form";
import MostrarNotas from "../MostrarNotas";
import LayoutPublic from "../layout/LayOutPublic";
import NoticiaDetalle from "../Components/NoticiaDetalle";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/Registrarse";
import Logout from "../Components/Logout";
import ProtectedRoute from "../Components/ProtectedRoute";
import SearchForm from "../Components/SearchForm";
import ForgotPasswordForm from "../Components/ForgotPassword";
import ResetPasswordForm from "../Components/ResetPassword";
import Error404 from "../Components/Error404";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LayoutPublic />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "notas",
        element: <MostrarNotas />,
      },
      {
        path: "redactar",
        element: (
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
        ),
      },
      {
        path: "loguearse",
        element: <LoginForm />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordForm />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordForm />,
      },
      {
        path: "registrarse",
        element: <RegisterForm />,
      },
      {
        path: "noticia/:id",
        element: <NoticiaDetalle />,
      },
      {
        path: "buscar",
        element: <SearchForm />,
      },
      {
        path: "*",
        element: <Error404 rutaNoEncontrada={window.location.pathname}/>,
        errorElement: <Error404 rutaNoEncontrada={window.location.pathname} />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);