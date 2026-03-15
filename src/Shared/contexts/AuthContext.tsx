import type { User } from "@supabase/supabase-js";
import type React from "react";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
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
      }
      setIsLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
