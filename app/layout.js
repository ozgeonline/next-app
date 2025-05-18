import Navbar from "@/components/navbar/Navbar";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import {ThemeProvider} from "@/components/providers/ThemeContext";
import {ScrollProvider} from "@/components/providers/ScrollingContext";
import './globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ScrollProvider>
            <Navbar />
          </ScrollProvider>
        </ThemeProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
      </body>
    </html>
  );
}
