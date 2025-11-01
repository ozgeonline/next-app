import { Providers } from "@/context/Providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/sections/footer/Footer";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <>
            {children}
            {/* for fixed footer */}
            <div style={{height: '100vh', zIndex: '-500'}} />
          </>
          <div className="footerWrapper">
            <div className="footer">
              <Footer />
            </div>
          </div>
        </Providers>
       
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      </body>
    </html>
  );
};