import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { HomePage, LoginPage } from "@/Pages";
import { ErrorBoundary, NotFoundPage } from "@/Shared/components";
import { PrivateLayout, PublicLayout } from "@/Shared/layouts";
import { ROUTE_BASE, ROUTES } from "@/Shared/utils/routes.util";

const router = createBrowserRouter([
  {
    path: ROUTE_BASE.ROOT,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.HOME} replace />,
      },
    ],
  },
  {
    path: ROUTE_BASE.ACCOUNT,
    element: <PublicLayout />,
    children: [
      {
        path: ROUTE_BASE.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: ROUTE_BASE.HOME,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: ROUTE_BASE.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
