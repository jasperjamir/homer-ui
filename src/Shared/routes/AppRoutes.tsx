import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import {
  HomePage,
  LoginPage,
  ProjectsPage,
  MarketingPromptsPage,
  PlatformsPage,
  ImageGenerationsPage,
  ImageGenerationNewPage,
  ImageGenerationDetailPage,
  VideoGenerationsPage,
  VideoGenerationNewPage,
  VideoGenerationStoryboardPage,
  VideoGenerationDetailPage,
  UploadPage,
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
    path: ROUTE_BASE.PROJECTS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <ProjectsPage /> }],
  },
  {
    path: ROUTE_BASE.MARKETING_PROMPTS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <MarketingPromptsPage /> }],
  },
  {
    path: ROUTE_BASE.PLATFORMS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <PlatformsPage /> }],
  },
  {
    path: ROUTE_BASE.IMAGE_GENERATIONS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <ImageGenerationsPage /> },
      { path: "new", element: <ImageGenerationNewPage /> },
      { path: ":id", element: <ImageGenerationDetailPage /> },
    ],
  },
  {
    path: ROUTE_BASE.VIDEO_GENERATIONS,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <VideoGenerationsPage /> },
      { path: "new", element: <VideoGenerationNewPage /> },
      { path: ":id/storyboard", element: <VideoGenerationStoryboardPage /> },
      { path: ":id", element: <VideoGenerationDetailPage /> },
    ],
  },
  {
    path: ROUTE_BASE.UPLOAD,
    element: <PrivateLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <UploadPage /> }],
  },
  {
    path: ROUTE_BASE.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
