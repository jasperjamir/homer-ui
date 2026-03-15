import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import type React from "react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { getProfileQueryOptions } from "@/Features/Auth/query-options";
import { createMockSupabaseUser } from "@/Shared/lib/mockAuth";
import { supabase } from "@/Shared/lib/supabase";

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if dev bypass is enabled
  const devBypassAuth = import.meta.env.PUBLIC_DEV_BYPASS_AUTH === "true";

  const {
    data: profile,
    isPending,
    isError,
  } = useQuery({
    ...getProfileQueryOptions,
    enabled: !!user && !devBypassAuth, // Skip profile query in dev bypass mode
  });

  useEffect(() => {
    // Dev bypass mode - create mock user immediately
    if (devBypassAuth) {
      const mockUser = createMockSupabaseUser();
      setUser(mockUser);
      setIsLoading(false);
      return;
    }

    // Normal Supabase auth flow
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Skip validation in dev bypass mode
    if (devBypassAuth) {
      return;
    }

    const validateUserAndSetPartner = async () => {
      if (!user) {
        return;
      }

      if (isPending) {
        setIsLoading(true);
        return;
      }

      if (isError) {
        await supabase.auth.signOut();
        toast.error("Server error. Please try again later");
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (profile) {
        // User has app_users profile - allow access (STUDENT or EDUCATOR)
        setIsLoading(false);
      }
    };

    validateUserAndSetPartner();
  }, [user, profile, isPending, isError]);

  const value: AuthContextProps = {
    user,
    setUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
