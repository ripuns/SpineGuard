import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import ProfileDropdown from "../components/ProfileDropdown";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SpineGuard - Posture Monitoring",
  description: "AI-powered posture monitoring and analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        
        {/* Profile Dropdown - Fixed in top-right corner */}
        <div className="fixed top-6 right-6 z-50">
          <ProfileDropdown />
        </div>
        
        {children}
      </body>
    </html>
  );
}
