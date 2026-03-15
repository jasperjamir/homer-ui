import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import GoogleIcon from "@/Assets/images/google-icon.svg";
import { loginRules } from "@/Features/Auth/rules";
import { type LoginFormData, loginSchema } from "@/Features/Auth/schemas";
import { Alert, AlertDescription } from "@/Shared/components/ui/alert";
import { Button } from "@/Shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/Shared/components/ui/field";
import { Input } from "@/Shared/components/ui/input";
import { supabase } from "@/Shared/lib/supabase";
import { findRule } from "@/Shared/utils";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandler = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsPending(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (signInError) throw signInError;
      onSubmit(data);
    } catch (err) {
      const errorRule = findRule(err as Error, loginRules);
      setError(errorRule.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    // Simulate brief delay for UX
    await new Promise((r) => setTimeout(r, 300));
    setIsGoogleLoading(false);
    toast.info("Login with Google is under construction. Please use email and password for now.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            aria-invalid={!!errors.email}
            autoFocus
            placeholder="e.g. user@example.com"
            type="email"
            disabled={isPending || isGoogleLoading}
            inputMode="email"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            aria-invalid={!!errors.password}
            placeholder="********"
            type="password"
            disabled={isPending || isGoogleLoading}
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        <Button
          type="submit"
          isLoading={isPending}
          loadingText="Please wait"
          disabled={isGoogleLoading}
        >
          Login
        </Button>
        <div className="relative my-0">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-accent-blue/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-accent-blue/90">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10 hover:border-accent-blue"
          onClick={handleGoogleLogin}
          disabled={isPending || isGoogleLoading}
          isLoading={isGoogleLoading}
          loadingText="Please wait"
        >
          <img src={GoogleIcon} alt="Google" className="h-4 w-4" />
          Login with Google
        </Button>
      </FieldGroup>
    </form>
  );
}
