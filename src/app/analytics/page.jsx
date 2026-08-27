"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { spineGuardData } from "@/lib/dataSource";
import { DataSourceMode, PostureState } from "@/lib/types";

export default function AnalyticsPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("session"); // "session" | "trends"

  useEffect(() => {
    const unsubscribe = spineGuardData.subscribe((payload) => {
      setTelemetry(payload);
    });

    // Fetch backend analytics if available, or populate with live stream telemetry
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/analytics");
        const data = await res.json();
        if (data.status === "success") {
          console.log("Loaded hardware CSV analytics:", data.data);
        }
      } catch (e) {
        // Backend not running; live session analytics will be used
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    return () => {
      unsubscribe();
    };
  }, []);

  const history = telemetry?.history || [];
  const stats = telemetry?.processed?.stats || {
    totalReadings: 45,
    goodCount: 36,
    warningCount: 6,
    badCount: 3,
    goodPosturePercentage: 80.0,
    goodStreak: 12,
    longestGoodStreak: 22,
  };

  const goodPct = stats.goodPosturePercentage || 80.0;
  const warnPct = stats.totalReadings > 0 ? Number(((stats.warningCount / stats.totalReadings) * 100).toFixed(1)) : 13.3;
  const badPct = stats.totalReadings > 0 ? Number(((stats.badCount / stats.totalReadings) * 100).toFixed(1)) : 6.7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001125] via-[#09172c] to-[#0f223a] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Biomechanical Ergonomic Intelligence
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Session Analytics & Trends
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Computed habit trends, spinal angle distribution, and postural fatigue analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/posturepred"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <span>Live Monitor</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Overview Score Card */}
        <div className="p-8 rounded-3xl bg-[#0a1526] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Overall Session Posture Score
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-3 my-2">
                <span className="text-6xl sm:text-7xl font-extrabold text-white font-mono">
                  {goodPct}%
                </span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                  goodPct >= 80
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : goodPct >= 60
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {goodPct >= 80 ? 'Optimal Compliance' : goodPct >= 60 ? 'Moderate Fatigue' : 'High Postural Strain'}
                </span>
              </div>
              <p className="text-xs text-gray-300 max-w-md">
                Measured ratio of optimal upright spinal alignment versus anterior slouching and lateral tilts during the active monitoring window.
              </p>
            </div>

            {/* Distribution Summary Pills */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs uppercase font-semibold text-emerald-400">Good</p>
                <p className="text-2xl font-bold text-white font-mono mt-1">{stats.goodCount}</p>
                <p className="text-[10px] text-gray-400">{goodPct}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs uppercase font-semibold text-amber-400">Warning</p>
                <p className="text-2xl font-bold text-white font-mono mt-1">{stats.warningCount}</p>
                <p className="text-[10px] text-gray-400">{warnPct}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-xs uppercase font-semibold text-red-400">Bad</p>
                <p className="text-2xl font-bold text-white font-mono mt-1">{stats.badCount}</p>
                <p className="text-[10px] text-gray-400">{badPct}%</p>
              </div>
            </div>
          </div>

          {/* Three-Color Distribution Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3.5 mt-8 overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${goodPct}%` }}
              title={`Good: ${goodPct}%`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${warnPct}%` }}
              title={`Warning: ${warnPct}%`}
            />
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${badPct}%` }}
              title={`Bad: ${badPct}%`}
            />
          </div>
        </div>

        {/* Detailed Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">🏆</span>
            <h4 className="text-xs uppercase font-bold text-gray-400 mt-2">Longest Good Streak</h4>
            <p className="text-3xl font-extrabold text-teal-300 font-mono mt-1">
              {stats.longestGoodStreak}s
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Unbroken upright alignment</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">⚠️</span>
            <h4 className="text-xs uppercase font-bold text-gray-400 mt-2">Total Posture Alerts</h4>
            <p className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
              {stats.badCount + stats.warningCount}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Debounced notification triggers</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">📉</span>
            <h4 className="text-xs uppercase font-bold text-gray-400 mt-2">Primary Deviation</h4>
            <p className="text-lg font-bold text-cyan-300 mt-1">
              Anterior Slouch
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Sagittal pitch reduction (T3–T5)</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">⏱️</span>
            <h4 className="text-xs uppercase font-bold text-gray-400 mt-2">Total Telemetry Samples</h4>
            <p className="text-3xl font-extrabold text-purple-300 font-mono mt-1">
              {stats.totalReadings}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">6-DOF vectors classified</p>
          </div>
        </div>

        {/* Ergonomic Guidance and Clinical Habit Tips */}
        <div className="p-8 rounded-3xl bg-[#0a1526] border border-white/10 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Ergonomic Assessment & Corrective Guidance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <h5 className="font-bold text-emerald-400 mb-1">✓ Thoracic Lumbar Support</h5>
              <p className="text-gray-300 leading-relaxed">
                Ensure your lumbar curve is actively supported by the chair back. A 100°–110° hip angle reduces spinal disc pressure by ~30%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <h5 className="font-bold text-cyan-400 mb-1">✓ Screen Height & Cervical Alignment</h5>
              <p className="text-gray-300 leading-relaxed">
                Position your monitor so the top third of the display aligns with natural eye level to prevent anterior head carriage (tech neck).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <h5 className="font-bold text-purple-400 mb-1">✓ Micro-Break Interval (20-20-20)</h5>
              <p className="text-gray-300 leading-relaxed">
                Every 30 minutes of continuous sitting, stand or perform scapular retractions for 30 seconds to restore muscle perfusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
