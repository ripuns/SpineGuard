"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { spineGuardData } from "@/lib/dataSource";
import { DataSourceMode, SimulationScenario, PostureState } from "@/lib/types";
import SpineVisualizer from "@/components/SpineVisualizer";
import DataSourceSelector from "@/components/DataSourceSelector";
import ScenarioRunner from "@/components/ScenarioRunner";
import RawTelemetryInspector from "@/components/RawTelemetryInspector";
import SystemStatusWidget from "@/components/SystemStatusWidget";
import CalibrationModal from "@/components/CalibrationModal";

export default function PostureMonitorPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [dataSource, setDataSource] = useState(DataSourceMode.SIMULATION);
  const [activeScenario, setActiveScenario] = useState(SimulationScenario.HEALTHY_SITTING);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [baselineAngle, setBaselineAngle] = useState(78.5);

  useEffect(() => {
    // Subscribe to telemetry pipeline
    const unsubscribe = spineGuardData.subscribe((payload) => {
      setTelemetry(payload);
      if (payload.system) {
        setIsStreaming(payload.system.isStreaming);
      }
    });

    // Auto-start simulation stream on mount
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

  const handleSelectScenario = (scenarioId) => {
    setActiveScenario(scenarioId);
    spineGuardData.setScenario(scenarioId);
    if (!isStreaming) {
      spineGuardData.start();
      setIsStreaming(true);
    }
  };

  const handleResetScenario = () => {
    spineGuardData.setScenario(activeScenario);
  };

  const handleSaveBaseline = (angle) => {
    setBaselineAngle(angle);
    spineGuardData.setCalibration(angle);
  };

  const processed = telemetry?.processed || {
    raw: { ax: 0.12, ay: 0.05, az: 0.98, gx: 0.1, gy: 0.1, gz: 0.0 },
    features: { tiltAngle: 78.5, spineTilt: 2.1, pitch: 1.2, roll: 0.5, accelMag: 0.99, gyroMag: 0.14 },
    classification: { state: PostureState.GOOD, postureScore: 95, confidence: 96, angleDelta: 0.0 },
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

  const currentStep = telemetry?.processed?.raw?.step || telemetry?.history?.length || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001125] via-[#09172c] to-[#0f223a] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Interactive Testing Studio & Telemetry Console
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Live Posture Monitor & Demo
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Evaluate physiological kinematic transitions, threshold classification, and multi-channel alerts.
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
              <span>Calibrate Baseline</span>
            </button>

            <Link
              href="/analytics"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition flex items-center gap-2"
            >
              <span>Session Analytics</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

        {/* Interactive Scenario Runner (Active when in Simulation mode) */}
        {dataSource === DataSourceMode.SIMULATION && (
          <ScenarioRunner
            activeScenario={activeScenario}
            onSelectScenario={handleSelectScenario}
            isStreaming={isStreaming}
            onToggleStream={handleToggleStream}
            onResetScenario={handleResetScenario}
            currentStep={currentStep}
          />
        )}

        {/* Real-Time Posture & Gauge Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visualizer (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <SpineVisualizer
              spinalAngle={processed.features.tiltAngle}
              spineTilt={processed.features.spineTilt}
              roll={processed.features.roll}
              state={processed.classification.state}
            />

            {/* Current State Indicator Card */}
            <div className="p-5 rounded-3xl bg-[#0a1526] border border-white/10 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-gray-400">Current Posture Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full animate-pulse ${
                    processed.classification.state === PostureState.GOOD
                      ? 'bg-emerald-400'
                      : processed.classification.state === PostureState.WARNING
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`} />
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {processed.classification.state}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Deviation from datum: <strong className="text-cyan-300 font-mono">{(processed.features.tiltAngle - baselineAngle).toFixed(1)}°</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Score</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {processed.classification.postureScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Statistics & Live Signals (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Good Posture %</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  {processed.stats.goodPosturePercentage}%
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{processed.stats.goodCount} good samples</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Spinal Angle</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                  {processed.features.tiltAngle}°
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Datum: {baselineAngle.toFixed(1)}°</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Spine Tilt</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono mt-1">
                  {processed.features.spineTilt}°
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Roll: {processed.features.roll}°</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Confidence</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
                  {processed.classification.confidence}%
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Inertial filter</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Warning Count</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1">
                  {processed.stats.warningCount + processed.stats.badCount}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{processed.stats.badCount} bad events</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase font-semibold text-gray-400">Good Streak</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono mt-1">
                  {processed.stats.goodStreak}s
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Peak: {processed.stats.longestGoodStreak}s</p>
              </div>
            </div>

            {/* Ingestion Pipeline Telemetry Signal Box */}
            <div className="p-6 rounded-3xl bg-[#0a1526] border border-white/10 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Live Derived Feature Vector
                </span>
                <span className="text-xs font-mono text-gray-400">
                  Accel Mag: {processed.features.accelMag}g | Gyro Mag: {processed.features.gyroMag}°/s
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Ax (Sagittal)</span>
                  <strong className="text-white">{processed.raw?.ax?.toFixed(3) || "0.000"} g</strong>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Ay (Lateral)</span>
                  <strong className="text-white">{processed.raw?.ay?.toFixed(3) || "0.000"} g</strong>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Az (Vertical)</span>
                  <strong className="text-white">{processed.raw?.az?.toFixed(3) || "0.000"} g</strong>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">Sagittal Pitch</span>
                  <strong className="text-white">{processed.features.pitch}°</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer View / Raw Telemetry Table */}
        <RawTelemetryInspector telemetryHistory={telemetry?.history || []} />

        {/* System Observability & Health */}
        <SystemStatusWidget
          systemMetrics={telemetry?.system || {}}
          dataSource={dataSource}
          baselineAngle={baselineAngle}
        />
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
