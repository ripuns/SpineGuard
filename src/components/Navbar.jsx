"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setVisible(false);
      } else {
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

  const navLinks = [
    { href: "/", label: "Overview" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/posturepred", label: "Live Monitor & Demo" },
    { href: "/analytics", label: "Analytics" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 
      w-[94%] md:w-[80%] lg:w-[68%] 
      bg-[#0a1526]/90 backdrop-blur-xl border border-white/10
      text-white flex justify-between items-center px-6 py-3 rounded-full shadow-2xl 
      transition-all duration-300 z-50
      ${visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-extrabold text-base tracking-tight hover:opacity-90 transition">
        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-emerald-500/20">
          SG
        </span>
        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          SpineGuard
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-1 sm:gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-emerald-400 border border-white/10 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
