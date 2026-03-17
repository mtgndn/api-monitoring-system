import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

          {/* SIDEBAR HER SAYFADA */}
          <Sidebar />

          {/* CONTENT */}
          <div className="flex-1 p-8">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}