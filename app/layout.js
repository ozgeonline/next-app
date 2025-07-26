import Navbar from "@/components/navbar/Navbar";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import {ThemeProvider} from "@/components/providers/ThemeContext";
import './globals.css';
import { NavigationProvider } from "@/components/providers/navbar/NavigationContext";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </NavigationProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      </body>
    </html>
  );
}
