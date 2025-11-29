"use client";

import { createContext, useContext, ReactNode } from "react";
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
  const data = await res.json();
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
    "/api/auth/user",
    fetcher,
    {
      fallbackData: initialUser || null, // User from SSR
      revalidateOnFocus: true,
      revalidateOnMount: true, // component is first loaded: SWR's req to pull data
      dedupingInterval: 10000,
      onError: (error) => {
        // for 500 Internal Server Error 
        console.error("AuthProvider: Kimlik doğrulama verisi çekilemedi:", error);
      },
    }
  );

  const contextMutateUser = (newUser?: ClientUser | null) => {
    if (newUser === null) {
      mutate(null, { revalidate: false });
    } else if (newUser) {
      mutate(newUser, { revalidate: false });
    } else {
      mutate();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("provider logout API not working:", error);
    } finally {
      contextMutateUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        loading: isLoading,
        mutateUser: (newUser?: ClientUser | null) => {
          if (newUser === null) {
            mutate(null, false);
          } else if (newUser) {
            mutate(newUser, false);
          } else {
            mutate();
          }
        },
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}