"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import type { ClientUser } from "@/types/userTypes";

interface AuthContextType {
  user: ClientUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  mutateUser: () => void;
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
      fallbackData: initialUser || null, // SSR’den gelen user
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  );

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        loading: isLoading,
        mutateUser: (newUser?: ClientUser | null) => {
          if (newUser === null) {
            mutate(undefined, false); //logout için
          } else {
            mutate();
          }
        },
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