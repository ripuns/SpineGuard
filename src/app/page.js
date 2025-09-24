"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.error("Google login error:", error.message);
  };

  const handleSupabaseLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Logged in successfully ✅");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#001125] overflow-hidden">
      <img
        src="/spine.svg"
        alt="Spine Background"
        className="absolute inset-0 mx-auto h-full w-full scale-150 opacity-30 object-contain pointer-events-none"
      />
      <div className="relative z-10 w-[350px] bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/10">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          SpineGuard
        </h1>
        <div className="mb-4">
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSupabaseLogin}
            disabled={loading}
            className="w-1/2 py-2 font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:opacity-90 transition"
          >
            {loading ? "..." : "LOGIN"}
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="w-1/2 py-2 font-medium text-white bg-gradient-to-r from-green-500 to-green-700 rounded-md hover:opacity-90 transition"
          >
            SIGN UP
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-2">{message}</p>}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
