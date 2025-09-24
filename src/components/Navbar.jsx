"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setVisible(false);
      } else {
        // scrolling up → show
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 
      w-[90%] md:w-[70%] lg:w-[60%] 
      bg-[#1e2e43]/100 backdrop-blur-md 
      text-white flex justify-between items-center px-10 py-4 rounded-3xl shadow-lg 
      transition-transform duration-300 z-50
      ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Logo */}
      <Link href="/" className="font-bold text-lg">
        SpineGuard
      </Link>

      {/* Links */}
      <div className="flex gap-7 text-md">
        <Link href="/dashboard" className="hover:text-green-400 transition">
          Dashboard
        </Link>
        <Link href="/history" className="hover:text-green-400 transition">
          History
        </Link>
        <Link href="/analytics" className="hover:text-green-400 transition">
          Analytics
        </Link>
        <Link href="/settings" className="hover:text-green-400 transition">
          Settings
        </Link>
      </div>
    </nav>
  );
}
