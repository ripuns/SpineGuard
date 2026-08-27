"use client";
import React from "react";
import { DataSourceMode } from "@/lib/types";

export default function SystemStatusWidget({
  systemMetrics = {},
  dataSource = DataSourceMode.SIMULATION,
  baselineAngle = 78.5,
  className = "",
}) {
  const {
    isStreaming = false,
    packetsProcessed = 0,
    samplingIntervalMs = 1000,
    uptimeSeconds = 0,
  } = systemMetrics;

  const samplingHz = samplingIntervalMs > 0 ? (1000 / samplingIntervalMs).toFixed(1) : "0.0";
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-[#0c1829] border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">System Observability & Health</h3>
            <p className="text-xs text-gray-400">Live operational telemetry and data pipeline runtime</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-xs font-mono text-gray-300">{isStreaming ? "STREAMING" : "IDLE"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Data Ingestion</p>
          <p className="text-sm font-bold text-white font-mono">{dataSource === DataSourceMode.SIMULATION ? "Simulator" : "MPU6050 (Serial)"}</p>
          <p className="text-[10px] text-gray-400">{dataSource === DataSourceMode.SIMULATION ? "Kinematic Stream" : "COM7 @ 115200"}</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Sampling Rate</p>
          <p className="text-sm font-bold text-emerald-400 font-mono">{samplingHz} Hz</p>
          <p className="text-[10px] text-gray-400">{samplingIntervalMs}ms interval</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Packets Ingested</p>
          <p className="text-sm font-bold text-cyan-400 font-mono">{packetsProcessed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">6-DOF vectors</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Session Uptime</p>
          <p className="text-sm font-bold text-purple-400 font-mono">{formatTime(uptimeSeconds)}</p>
          <p className="text-[10px] text-gray-400">Active monitoring</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Calibrated Datum</p>
          <p className="text-sm font-bold text-amber-400 font-mono">{Number(baselineAngle).toFixed(1)}°</p>
          <p className="text-[10px] text-gray-400">Baseline reference</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase font-semibold text-gray-400 mb-0.5">Audio Engine</p>
          <p className="text-sm font-bold text-blue-400 font-mono">WebAudio API</p>
          <p className="text-[10px] text-gray-400">Synthesized chimes</p>
        </div>
      </div>
    </div>
  );
}

