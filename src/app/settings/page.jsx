"use client";
import React, { useState, useEffect } from "react";
import { spineGuardData } from "@/lib/dataSource";
import { soundAlerts } from "@/lib/soundAlerts";
import { DataSourceMode, DEFAULT_SYSTEM_SETTINGS } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SYSTEM_SETTINGS);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("spineguard-system-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
        soundAlerts.setEnabled(parsed.soundAlerts);
        if (parsed.samplingIntervalMs) {
          spineGuardData.setSamplingInterval(parsed.samplingIntervalMs);
        }
      }
    } catch (e) {
      console.warn("Could not load stored settings:", e);
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };

      // Apply live effects immediately
      if (key === "soundAlerts") {
        soundAlerts.setEnabled(value);
      } else if (key === "samplingIntervalMs") {
        spineGuardData.setSamplingInterval(Number(value));
      } else if (key === "dataSource") {
        spineGuardData.setMode(value);
      }

      // Persist
      localStorage.setItem("spineguard-system-settings", JSON.stringify(updated));
      return updated;
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleTestSound = (type) => {
    if (type === "warning") soundAlerts.playWarningTone();
    else if (type === "bad") soundAlerts.playBadPostureTone();
    else if (type === "correction") soundAlerts.playCorrectionChime();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001125] via-[#09172c] to-[#0f223a] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                System Configuration
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Configure telemetry sampling rates, classification sensitivity, and audio biofeedback.
            </p>
          </div>

          {savedMessage && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-fade-in">
              ✓ Saved & Applied
            </span>
          )}
        </div>

        {/* Settings Sections Card */}
        <div className="p-8 rounded-3xl bg-[#0a1526] border border-white/10 shadow-2xl space-y-8">
          {/* Section 1: Monitoring & Sensitivity */}
          <div>
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Biomechanical Sensitivity & Sampling
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Posture Alert Threshold Angle</span>
                  <span className="font-mono text-emerald-400">{settings.postureThreshold}°</span>
                </div>
                <p className="text-xs text-gray-400">
                  Angles below this threshold trigger postural warnings. (Default: 72.0°)
                </p>
                <input
                  type="range"
                  min="55"
                  max="85"
                  step="0.5"
                  value={settings.postureThreshold}
                  onChange={(e) => handleSettingChange("postureThreshold", parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Telemetry Sampling Interval</h4>
                  <p className="text-xs text-gray-400">Controls data ingestion frequency (Hz)</p>
                </div>
                <select
                  value={settings.samplingIntervalMs}
                  onChange={(e) => handleSettingChange("samplingIntervalMs", parseInt(e.target.value))}
                  className="bg-[#111e33] border border-white/20 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={200}>200ms (5.0 Hz - Ultra)</option>
                  <option value={500}>500ms (2.0 Hz - High)</option>
                  <option value={1000}>1000ms (1.0 Hz - Standard)</option>
                  <option value={2000}>2000ms (0.5 Hz - Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Audio Alert Synthesizer */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Acoustic Biofeedback (Web Audio API)
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Enable Audio Chimes & Tones</h4>
                  <p className="text-xs text-gray-400">Synthesizes gentle tones upon slouching and postural correction</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundAlerts}
                    onChange={(e) => handleSettingChange("soundAlerts", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Sound Test Panel */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-gray-300 mb-2">Test Synthesizer Tones:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTestSound("warning")}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition"
                  >
                    ▶ Test Warning Tone
                  </button>
                  <button
                    onClick={() => handleTestSound("bad")}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-500/30 transition"
                  >
                    ▶ Test Bad Posture Tone
                  </button>
                  <button
                    onClick={() => handleTestSound("correction")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition"
                  >
                    ▶ Test Recovery Chime
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Data Source Mode */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-base font-bold text-purple-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Default Telemetry Ingestion Source
            </h3>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Active Ingestion Source</h4>
                <p className="text-xs text-gray-400">Select standard data transport layer</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSettingChange("dataSource", DataSourceMode.SIMULATION)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    settings.dataSource === DataSourceMode.SIMULATION
                      ? "bg-purple-600 text-white font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Simulation Mode
                </button>
                <button
                  onClick={() => handleSettingChange("dataSource", DataSourceMode.HARDWARE)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    settings.dataSource === DataSourceMode.HARDWARE
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Live Hardware (COM7)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
