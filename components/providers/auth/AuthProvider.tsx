"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  _id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setIsLogout: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authTrigger, setAuthTrigger] = useState(0);
  const [isLogout, setIsLogout] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLogout") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("isLogout", String(isLogout));
    //console.log("isLogout:", isLogout);
  }, [isLogout]);

  const fetchUser = async () => {
    if (isLogout) {
      //console.log("useAuth: skipping fetchUser while logging out");
      setUser(null);
      setLoading(false);
      return;
    }

    //console.log("AuthProvider: fetching user from /api/auth/user");
    try {
      const res = await fetch("/api/auth/user", {
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        //console.log("AuthProvider: /api/auth/user response:", data);
        setUser(data.user || null);
      } else {
        // console.log("AuthProvider: /api/auth/user failed:", await res.text());
        setUser(null);
      }
    } catch (err) {
      //console.error("AuthProvider: auth fetch error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, [authTrigger]);

  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      //console.log("AuthProvider: auth change event", event);
      const isLogoutEvent = (event as CustomEvent).detail?.isLogout;
      if (isLogoutEvent) {
        //console.log("AuthProvider: logout, resetting token");
        setUser(null);
        setLoading(false);
        setIsLogout(true);
      } else {
        //console.log("AuthProvider: trigger user fetch");
        setIsLogout(false);
        setAuthTrigger((prev) => prev + 1);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setIsLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}