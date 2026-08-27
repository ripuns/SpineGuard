"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import HardwareArchitectureViewer from "@/components/HardwareArchitectureViewer";
import HardwareVideoDemo from "@/components/HardwareVideoDemo";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
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
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) console.error("Google login error:", error.message);
  };

  return (
    <div className="min-h-screen bg-[#001125] text-white selection:bg-emerald-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Background glow and subtle spine watermark */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <img
          src="/spine.svg"
          alt="Spine Background"
          className="absolute inset-0 mx-auto h-full w-full scale-125 opacity-10 object-contain pointer-events-none"
        />

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          IoT Biomechanical Intelligence
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6 animate-fade-in">
          Real-time posture intelligence powered by{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            wearable sensors.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-gray-300 max-w-2xl font-light mb-10 leading-relaxed animate-fade-in-delay">
          SpineGuard tracks spinal alignment in real time using 6-DOF IMU telemetry, classifies biomechanical deviations, and delivers instant ergonomic biofeedback.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 z-10 mb-12">
          <Link
            href="/posturepred"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold text-sm sm:text-base shadow-2xl shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <span>Try Interactive Demo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-300 hover:border-white/40 flex items-center gap-2"
          >
            <span>Open Dashboard</span>
          </Link>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-4 rounded-2xl bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-sm font-semibold transition flex items-center gap-2"
          >
            <span>User Account</span>
          </button>
        </div>

        {/* Feature Pill Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl z-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
            <span className="text-xl">📡</span>
            <h4 className="text-sm font-bold text-white mt-1">Dual Data Sources</h4>
            <p className="text-xs text-gray-400 mt-0.5">Live MPU6050 & Kinematic Simulation</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
            <span className="text-xl">🧠</span>
            <h4 className="text-sm font-bold text-white mt-1">Real-time Inference</h4>
            <p className="text-xs text-gray-400 mt-0.5">10 Hz tilt & classification pipeline</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
            <span className="text-xl">📐</span>
            <h4 className="text-sm font-bold text-white mt-1">Guided Calibration</h4>
            <p className="text-xs text-gray-400 mt-0.5">Personalized upright reference datum</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
            <span className="text-xl">📊</span>
            <h4 className="text-sm font-bold text-white mt-1">Session Analytics</h4>
            <p className="text-xs text-gray-400 mt-0.5">Streaks, fatigue curves & scoring</p>
          </div>
        </div>
      </section>

      {/* How SpineGuard Works Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Engineering Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            How SpineGuard Works
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            A seamless data pipeline translating physical micro-movements into posture intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Sensor Layer",
              desc: "MPU-6050 6-DOF IMU captures 3-axis acceleration and rotational velocities at 10 Hz.",
              color: "text-emerald-400",
            },
            {
              step: "02",
              title: "Processing Layer",
              desc: "Filters high-frequency jitter using adaptive 2/4-sample smoothing and computes gravitational tilt.",
              color: "text-teal-400",
            },
            {
              step: "03",
              title: "Posture Analysis",
              desc: "Classifies spinal alignment against personalized baseline datum (GOOD, WARNING, BAD).",
              color: "text-cyan-400",
            },
            {
              step: "04",
              title: "Alert Engine",
              desc: "Hysteresis accumulator debounces shifts and dispatches gentle audio and push reminders.",
              color: "text-blue-400",
            },
            {
              step: "05",
              title: "Analytics Layer",
              desc: "Aggregates posture score trends, longest good streaks, and ergonomic fatigue metrics.",
              color: "text-purple-400",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col justify-between"
            >
              <div>
                <span className={`text-xs font-mono font-bold ${item.color}`}>STEP {item.step}</span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Architecture Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <HardwareArchitectureViewer />
      </section>

      {/* Hardware Demonstration Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <HardwareVideoDemo />
      </section>

      {/* Optional Authentication Drawer / Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#0a1526] border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-center mb-6">User Account Login</h3>

            <form onSubmit={handleSupabaseLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter password"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow"
                >
                  {loading ? "..." : "LOGIN"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="w-1/2 py-2.5 font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition"
                >
                  SIGN UP
                </button>
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              {message && <p className="text-green-400 text-xs text-center">{message}</p>}
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-3 bg-[#0a1526] text-xs text-gray-400 font-mono">OR</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-800 rounded-xl font-medium text-xs shadow hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                className="w-4 h-4"
              />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
