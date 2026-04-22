/*
 * It uses SWR to dynamically fetch and cache the user's authentication state from the backend (`/api/auth/user`).
 * It handles the user's login state, loading state, and logout functionality, while also supporting
 * initial Server-Side Rendering (SSR) data injection via the `initialUser` prop.
*/

"use client";

import { createContext, useContext, useCallback, useMemo, ReactNode } from "react";
import useSWR from "swr";
import type { ClientUser } from "@/types/userTypes";

interface AuthContextType {
  user: ClientUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  mutateUser: (newUser?: ClientUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    return null;
  }

  if (!data?.user) return null;

  return {
    _id: data.user.userId as string,
    email: data.user.email as string,
    name: data.user.name as string,
  } as ClientUser;
};

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: ClientUser | null;
}) {
  const { data: user, isLoading, mutate } = useSWR<ClientUser | null>(
    "/api/auth/user?basic=true",
    fetcher,
    {
      fallbackData: initialUser, // if undefined, stays loading. if null, means server checked and user is logged out.
      revalidateOnFocus: true,
      revalidateOnMount: initialUser === undefined, // if undefined, we must fetch on mount
      dedupingInterval: 10000,
      onError: (error) => {
        // for 500 Internal Server Error 
        console.error("AuthProvider: Failed to fetch authentication data:", error);
      },
    }
  );

  const contextMutateUser = useCallback((newUser?: ClientUser | null) => {
    if (newUser === null) {
      mutate(null, { revalidate: false });
    } else if (newUser) {
      mutate(newUser, { revalidate: false });
    } else {
      mutate();
    }
  }, [mutate]);

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) {
        console.warn("AuthProvider: Logout API returned", res.status);
      }
    } catch (error) {
      console.error("AuthProvider: Failed to fetch authentication data:", error);
    } finally {
      contextMutateUser(null);
    }
  }, [contextMutateUser]);

  const contextValue = useMemo(() => {
    // SWR bazen fallbackData undefined olsa bile isLoading = false dönebiliyor.
    // Kullanıcı verisi henüz 'null' olarak netleşmediyse (yani API tamamlanmadıysa) 
    // sistem hala yükleniyordur.
    const isActuallyLoading = user === undefined || isLoading;

    return {
      user: user ?? null,
      isAuthenticated: !!user,
      loading: isActuallyLoading,
      mutateUser: contextMutateUser,
      logout: handleLogout,
    };
  }, [user, isLoading, contextMutateUser, handleLogout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}