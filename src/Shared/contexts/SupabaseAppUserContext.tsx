import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppUser } from "@/Shared/models";
import { AppUserRole } from "@/Shared/models";
import { getAppUserQueryOptions } from "@/Features/AppUser/query-options";
import { supabase } from "@/Shared/lib/supabase";

interface SupabaseAppUserContextValue {
  appUser: AppUser | null;
  authUserId: string | null;
  isLoading: boolean;
  isEducator: boolean;
  isStudent: boolean;
}

const SupabaseAppUserContext =
  createContext<SupabaseAppUserContextValue | undefined>(undefined);

export function SupabaseAppUserProvider({ children }: { children: ReactNode }) {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUserId(session?.user?.id ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: appUser = null, isPending: appUserLoading } = useQuery({
    ...getAppUserQueryOptions(authUserId),
    enabled: !!authUserId,
  });

  const value: SupabaseAppUserContextValue = {
    appUser,
    authUserId,
    isLoading: authLoading || (!!authUserId && appUserLoading),
    isEducator: appUser?.role === AppUserRole.EDUCATOR ?? false,
    isStudent: appUser?.role === AppUserRole.STUDENT ?? false,
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
