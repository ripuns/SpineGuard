"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your inbox for a confirmation email.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0a1a2f] overflow-hidden">
      {/* Background Spine SVG */}
      <img
        src="/spine.svg"
        alt="Spine Background"
        className="absolute inset-0 mx-auto h-full scale-150 opacity-30 object-contain pointer-events-none"
      />

      {/* Signup Card */}
      <div className="relative z-10 w-[350px] bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/10">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSignup}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mb-4 font-medium text-white bg-gradient-to-r from-green-500 to-green-700 rounded-md hover:opacity-90 transition"
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-2 text-sm text-center text-gray-300">{message}</p>
        )}

        {/* Link to Login */}
        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
