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
} from "@/Shared/config/brand";
import { cn, PUBLIC_WEBSITE_URL } from "@/Shared/utils";
import { ImageIcon, Sparkles, Upload, Video } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, label: "AI-powered" },
  { icon: ImageIcon, label: "Images" },
  { icon: Video, label: "Videos" },
  { icon: Upload, label: "Publish to platforms" },
] as const;

export default function Login() {
  const handleLogin = async (_data: LoginFormData) => {};

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Subtle blue tint at bottom only */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-accent-blue/5 to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col p-6 md:p-10">
        {LOGO_LOGIN_URL && (
          <div className="shrink-0 mb-6 flex justify-center gap-2 md:justify-start">
            <a href={PUBLIC_WEBSITE_URL} target="_blank" rel="noopener">
              <BrandLogo variant="login" className="h-14" />
            </a>
          </div>
        )}
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <div className={cn("flex flex-col gap-6")}>
              <Card className="border-primary/20">
                <CardHeader className="space-y-4 text-center">
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

              {/* Subtle feature strip below card only */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-muted-foreground"
                  >
                    <Icon className="size-3.5 text-accent-blue/60" />
                    <span className="text-xs text-muted-foreground/90">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
