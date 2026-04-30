import { Providers } from "@/context/Providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/sections/footer/Footer";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme;
                  if (!theme) {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = prefersDark ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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