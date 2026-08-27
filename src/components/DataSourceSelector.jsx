"use client";
import React from "react";
import { DataSourceMode } from "@/lib/types";

export default function DataSourceSelector({
  currentMode = DataSourceMode.SIMULATION,
  onModeChange,
  hardwareConnected = false,
  hardwareError = null,
  className = "",
}) {
  return (
    <div className={`w-full bg-[#111e33] border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-lg ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Data Source Architecture</span>
              {currentMode === DataSourceMode.SIMULATION ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Simulation Mode Active
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  hardwareConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hardwareConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  {hardwareConnected ? 'Hardware Connected (COM7 / 115200)' : 'Hardware Awaiting Stream'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {currentMode === DataSourceMode.SIMULATION ? (
                <span>
                  <strong className="text-white">Simulation Mode:</strong> Biomechanical time-series kinematic stream piped into the exact same downstream processing, classification, and alert pipeline as live hardware.
                </span>
              ) : (
                <span>
                  <strong className="text-white">Live Hardware Mode:</strong> Direct telemetry streamed from physical MPU-6050 6-DOF IMU via USB serial port to Flask backend.
                </span>
              )}
            </p>
            {currentMode === DataSourceMode.HARDWARE && hardwareError && (
              <p className="text-xs text-amber-400 mt-1.5 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                ⚠️ {hardwareError}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 self-stretch md:self-auto justify-center">
          <button
            onClick={() => onModeChange && onModeChange(DataSourceMode.SIMULATION)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              currentMode === DataSourceMode.SIMULATION
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Simulation Mode
          </button>
          <button
            onClick={() => onModeChange && onModeChange(DataSourceMode.HARDWARE)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              currentMode === DataSourceMode.HARDWARE
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live Hardware
          </button>
        </div>
      </div>
    </div>
  );
}

