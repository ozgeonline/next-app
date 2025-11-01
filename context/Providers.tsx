"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { NavigationProvider } from "./navigation/NavigationProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

export function Providers({ children }:{ children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
