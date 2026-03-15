import { Home } from "lucide-react";
import { Fragment, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { AppSidebar, ThemeToggle } from "@/Shared/components";
import LoadingPage from "@/Shared/components/LoadingPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Shared/components/ui/breadcrumb";
import { Separator } from "@/Shared/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/Shared/components/ui/sidebar";
import { useAuth } from "@/Shared/contexts";
import { useBreadcrumbs } from "@/Shared/hooks/use-breadcrumbs";
import { ROUTES } from "@/Shared/utils";

export default function PrivateLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(ROUTES.LOGIN, { replace: true, viewTransition: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return <PrivateLayoutContent />;
}

function PrivateLayoutContent() {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <SidebarProvider className="!min-h-0 h-screen max-h-screen">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="flex items-center gap-1">
                            {crumb.isHome ? (
                              <Home className="h-4 w-4" />
                            ) : crumb.onClick ? (
                              <button
                                type="button"
                                onClick={crumb.onClick}
                                className="cursor-pointer hover:underline"
                              >
                                {crumb.label}
                              </button>
                            ) : (
                              <span>{crumb.label}</span>
                            )}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.href} className="flex items-center gap-1">
                              {crumb.isHome ? (
                                <Home className="h-4 w-4" />
                              ) : (
                                <span>{crumb.label}</span>
                              )}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
