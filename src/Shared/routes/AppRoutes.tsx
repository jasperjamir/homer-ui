import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import {
  EducatorDashboardPage,
  LearningModuleEditorPage,
  LearningModulesPage,
  LoginPage,
  StudentDashboardPage,
  StudentSubmissionsPage,
  UsersPage,
} from "@/Pages";
import { ErrorBoundary, NotFoundPage } from "@/Shared/components";
import { PrivateLayout, PublicLayout } from "@/Shared/layouts";
import { ROUTE_BASE, ROUTES } from "@/Shared/utils/routes.util";

const router = createBrowserRouter([
  {
    path: ROUTE_BASE.ROOT,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />,
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
    path: ROUTE_BASE.STUDENT_DASHBOARD,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <StudentDashboardPage /> }],
  },
  {
    path: ROUTE_BASE.EDUCATOR_DASHBOARD,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <EducatorDashboardPage /> }],
  },
  {
    path: ROUTE_BASE.LEARNING_MODULES,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <LearningModulesPage /> }],
  },
  {
    path: ROUTE_BASE.LEARNING_MODULE_EDITOR,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <LearningModuleEditorPage /> }],
  },
  {
    path: ROUTE_BASE.USERS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <UsersPage /> }],
  },
  {
    path: `${ROUTE_BASE.STUDENT_SUBMISSIONS}/:studentId`,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <StudentSubmissionsPage /> }],
  },
  {
    path: ROUTE_BASE.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
