import { isAxiosError } from "axios";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/Shared/components/ui/alert";
import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/Shared/components/ui/card";
import { NotFoundPage } from "./NotFoundPage";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    console.error("Route Error:", error);
  }, [error]);

  if (error instanceof Error && error.name === "AbortError") {
    return null;
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  if (isAxiosError(error) && error.response?.status === 404) {
    return <NotFoundPage />;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  let errorTitle = "Oops! Something went wrong";
  let errorMessage =
    "We encountered an unexpected error. Please try refreshing the page or go back to the home page.";
  let errorDetails: string | null = null;

  if (isRouteErrorResponse(error)) {
    errorTitle = `Error ${error.status}`;
    errorMessage = error.statusText || errorMessage;
    if (error.data?.message) {
      errorDetails = error.data.message;
    }
  } else if (error instanceof Error) {
    if (error.name === "AxiosError" || error.message.includes("Network Error")) {
      errorTitle = "Network Connection Error";
      errorMessage =
        "We couldn't connect to the server. Please check your internet connection and try again.";
      errorDetails = error.message;
    } else {
      errorTitle = error.name || errorTitle;
      errorDetails = error.message;
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="font-semibold text-2xl">{errorTitle}</h2>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
        </CardHeader>

        {errorDetails && (
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Technical Details</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-sm">{errorDetails}</AlertDescription>
            </Alert>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleRefresh} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
