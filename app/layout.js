import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/ui/sections/footer/Footer";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import {ThemeProvider} from "@/components/providers/theme/ThemeContext";
import { AuthProvider } from "@/components/providers/auth/AuthProvider";
import { NavigationProvider } from "@/components/providers/navbar/NavigationContext";
import './globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <ThemeProvider>
            <Navbar />
            <>
            <AuthProvider>{children}</AuthProvider>
            
            {/* for fixed footer */}
            <div style={{height: '100vh', zIndex: '-500'}} />
            </>
            <div className="footerWrapper">
              <div className="footer">
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </NavigationProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      </body>
    </html>
  );
}
