"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { NavigationProvider } from "./navigation/NavigationProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastProvider } from "./toast/ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
