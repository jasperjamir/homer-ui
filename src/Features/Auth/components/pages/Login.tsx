import LoginForm from "@/Features/Auth/components/forms/LoginForm";
import type { LoginFormData } from "@/Features/Auth/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import { BrandLogo } from "@/Shared/components/BrandLogo";
import {
  LOGIN_WELCOME_DESCRIPTION,
  LOGIN_WELCOME_TITLE,
  LOGO_LOGIN_URL,
  LOGO_SQUARE_URL,
} from "@/Shared/config/brand";
import { cn, PUBLIC_WEBSITE_URL } from "@/Shared/utils";

export default function Login() {
  const handleLogin = async (_data: LoginFormData) => {};

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col p-6 md:p-10">
        {LOGO_LOGIN_URL && (
          <div className="mb-10 flex justify-center gap-2 md:mb-12 md:justify-start">
            <a href={PUBLIC_WEBSITE_URL} target="_blank" rel="noopener">
              <BrandLogo variant="login" className="h-14" />
            </a>
          </div>
        )}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className={cn("flex flex-col gap-6")}>
              <Card className="border-primary/20">
                <CardHeader className="space-y-4 text-center">
                  {LOGO_SQUARE_URL && (
                    <BrandLogo variant="square" className="mx-auto h-12" />
                  )}
                  <div className="space-y-2">
                    <CardTitle className="font-display text-xl">
                      {LOGIN_WELCOME_TITLE}
                    </CardTitle>
                    <CardDescription className="text-accent-blue">
                      {LOGIN_WELCOME_DESCRIPTION}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <LoginForm onSubmit={handleLogin} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
