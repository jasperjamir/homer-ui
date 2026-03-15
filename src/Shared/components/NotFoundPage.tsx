import { ArrowLeft, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/Shared/components/ui/card";
import { ROUTES } from "@/Shared/utils";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="font-bold text-2xl">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            If you believe this is an error, please contact support or try again later.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => navigate(ROUTES.HOME)} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
