"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { spineGuardData } from "@/lib/dataSource";
import { DataSourceMode, PostureState } from "@/lib/types";
import SpineVisualizer from "@/components/SpineVisualizer";
import DataSourceSelector from "@/components/DataSourceSelector";
import CalibrationModal from "@/components/CalibrationModal";

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [dataSource, setDataSource] = useState(DataSourceMode.SIMULATION);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [baselineAngle, setBaselineAngle] = useState(78.5);

  useEffect(() => {
    // Subscribe to unified data stream
    const unsubscribe = spineGuardData.subscribe((payload) => {
      setTelemetry(payload);
      if (payload.system) {
        setIsStreaming(payload.system.isStreaming);
      }
    });

    // Auto-start stream
    spineGuardData.start();
    setIsStreaming(true);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleStream = () => {
    if (isStreaming) {
      spineGuardData.stop();
      setIsStreaming(false);
    } else {
      spineGuardData.start();
      setIsStreaming(true);
    }
  };

  const handleModeChange = (mode) => {
    setDataSource(mode);
    spineGuardData.setMode(mode);
  };

  const handleSaveBaseline = (angle) => {
    setBaselineAngle(angle);
    spineGuardData.setCalibration(angle);
  };

  const processed = telemetry?.processed || {
    features: { tiltAngle: 78.5, spineTilt: 2.1, roll: 0.5 },
    classification: { state: PostureState.GOOD, postureScore: 94, confidence: 96 },
    stats: {
      totalReadings: 1,
      goodCount: 1,
      badCount: 0,
      warningCount: 0,
      goodPosturePercentage: 100,
      goodStreak: 1,
      longestGoodStreak: 1,
    },
  };

  const formatUptime = (secs) => {
    const mins = Math.floor((secs || 0) / 60);
    const s = (secs || 0) % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001125] via-[#0a1a2f] to-[#10243d] text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                SpineGuard Intelligence Console
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Posture Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              Live biomechanical alignment monitoring and continuous habit tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalibrationModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Guided Calibration</span>
            </button>

            <Link
              href="/posturepred"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <span>Interactive Studio</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Data Source Selector */}
        <DataSourceSelector
          currentMode={dataSource}
          onModeChange={handleModeChange}
          hardwareConnected={telemetry?.system?.hardwareStatus === "CONNECTED"}
          hardwareError={telemetry?.error}
        />

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visualizer & Live Angle Gauges (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <SpineVisualizer
              spinalAngle={processed.features.tiltAngle}
              spineTilt={processed.features.spineTilt}
              roll={processed.features.roll}
              state={processed.classification.state}
            />

            {/* Posture Score Highlight Card */}
            <div className="p-6 rounded-3xl bg-[#0c1829] border border-white/10 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-gray-400">Overall Posture Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {processed.classification.postureScore}%
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    processed.classification.state === PostureState.GOOD
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : processed.classification.state === PostureState.WARNING
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {processed.classification.state}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Confidence: <strong className="text-cyan-400 font-mono">{processed.classification.confidence}%</strong> (6-DOF inertial filter)
                </p>
              </div>

              <button
                onClick={handleToggleStream}
                className={`p-4 rounded-2xl transition shadow-lg ${
                  isStreaming ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
                title={isStreaming ? "Pause Monitoring" : "Start Monitoring"}
              >
                {isStreaming ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Key Biometrics & Telemetry (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary 6 Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Good Posture %</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  {processed.stats.goodPosturePercentage}%
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {processed.stats.goodCount} of {processed.stats.totalReadings} samples
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Spinal Angle</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                  {processed.features.tiltAngle}°
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Datum: {baselineAngle.toFixed(1)}°
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Spine Tilt</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono mt-1">
                  {processed.features.spineTilt}°
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Roll: {processed.features.roll}°
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Active Session</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
                  {formatUptime(telemetry?.system?.uptimeSeconds || 0)}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Continuous tracking</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Warning Count</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
                  {processed.stats.warningCount + processed.stats.badCount}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {processed.stats.badCount} bad / {processed.stats.warningCount} warn
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Longest Streak</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono mt-1">
                  {processed.stats.longestGoodStreak}s
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Current: {processed.stats.goodStreak}s
                </p>
              </div>
            </div>

            {/* Live Real-Time Posture Telemetry Progress */}
            <div className="p-6 rounded-3xl bg-[#0c1829] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Live Spinal Angle Gauge
                </h4>
                <span className="text-xs font-mono text-gray-300">
                  {processed.features.tiltAngle}° / 90.0°
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    processed.classification.state === PostureState.GOOD
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : processed.classification.state === PostureState.WARNING
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-600 to-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, (processed.features.tiltAngle / 90) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2">
                <span>50° (Severe Slouch)</span>
                <span>65° (Warning)</span>
                <span>78.5° (Ideal Datum)</span>
                <span>90° (Upright)</span>
              </div>
            </div>

            {/* Quick Link Banner to Studio & Analytics */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-blue-900/40 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Looking for the Interactive Demo?</h4>
                <p className="text-xs text-gray-300 mt-1">
                  Run edge-case scenarios (Gradual Slouch, Severe Slouch, Forward Lean, Recovery) in the Interactive Studio.
                </p>
              </div>
              <Link
                href="/posturepred"
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition whitespace-nowrap"
              >
                Launch Studio →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Calibration Modal */}
      <CalibrationModal
        isOpen={showCalibrationModal}
        onClose={() => setShowCalibrationModal(false)}
        onSaveBaseline={handleSaveBaseline}
        currentSpinalAngle={processed.features.tiltAngle}
      />
    </div>
  );
}
