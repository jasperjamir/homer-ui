import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import LoadingPage from "@/Shared/components/LoadingPage";
import { useAuth } from "@/Shared/contexts";
import { ROUTES } from "@/Shared/utils";

export default function PublicLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(ROUTES.HOME, { replace: true, viewTransition: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (user) {
    return null;
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}
