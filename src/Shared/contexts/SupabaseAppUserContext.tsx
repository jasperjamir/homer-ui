import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/Shared/lib/supabase";

interface SupabaseAppUserContextValue {
  appUser: null;
  authUserId: string | null;
  isLoading: boolean;
  isEducator: boolean;
  isStudent: boolean;
}

const SupabaseAppUserContext =
  createContext<SupabaseAppUserContextValue | undefined>(undefined);

export function SupabaseAppUserProvider({ children }: { children: ReactNode }) {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUserId(session?.user?.id ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: SupabaseAppUserContextValue = {
    appUser: null,
    authUserId,
    isLoading,
    isEducator: false,
    isStudent: true,
  };

  return (
    <SupabaseAppUserContext.Provider value={value}>
      {children}
    </SupabaseAppUserContext.Provider>
  );
}

export function useCurrentAppUser(): SupabaseAppUserContextValue {
  const context = useContext(SupabaseAppUserContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentAppUser must be used within a SupabaseAppUserProvider",
    );
  }
  return context;
}
