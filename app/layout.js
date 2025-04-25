import MainHeader from "@/components/main-header/main-header";
import './globals.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}
