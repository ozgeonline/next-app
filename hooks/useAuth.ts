"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Auth controls:", err);
        setUser(null);
      }finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, isAuthenticated: !!user, loading };
}
