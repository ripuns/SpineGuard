"use client";
import React, { useState } from "react";
import { PostureState } from "@/lib/types";

export default function RawTelemetryInspector({ telemetryHistory = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [filterState, setFilterState] = useState("ALL");
  const [copied, setCopied] = useState(false);

  const filteredHistory = telemetryHistory.filter((item) => {
    if (filterState === "ALL") return true;
    return item?.classification?.state === filterState;
  });

  const latestJson = telemetryHistory[0] ? JSON.stringify(telemetryHistory[0], null, 2) : "{}";

  const handleCopyJson = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(latestJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-[#0a1526] border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Developer View — Raw Sensor Telemetry</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live 6-DOF Stream ({telemetryHistory.length} buffered)
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Inspect unadulterated MPU-6050 accelerometer/gyroscope vectors and mathematical feature vectors.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs font-mono">{isOpen ? "Hide Telemetry" : "Inspect Stream"}</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === "table" ? "bg-cyan-500 text-black font-bold" : "text-gray-300 hover:text-white"
                }`}
              >
                Telemetry Table
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === "json" ? "bg-cyan-500 text-black font-bold" : "text-gray-300 hover:text-white"
                }`}
              >
                JSON Payload
              </button>
            </div>

            {viewMode === "table" ? (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400">Filter:</span>
                {["ALL", PostureState.GOOD, PostureState.WARNING, PostureState.BAD].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterState(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                      filterState === s
                        ? "bg-white/20 text-white border-white/40"
                        : "bg-white/5 text-gray-400 border-transparent hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleCopyJson}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
              >
                {copied ? "✓ Copied JSON" : "Copy Payload"}
              </button>
            )}
          </div>

          {viewMode === "table" ? (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111e33] text-gray-300 sticky top-0 border-b border-white/10 z-10">
                  <tr>
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5">Ax (g)</th>
                    <th className="p-2.5">Ay (g)</th>
                    <th className="p-2.5">Az (g)</th>
                    <th className="p-2.5">Gx (°/s)</th>
                    <th className="p-2.5">Gy (°/s)</th>
                    <th className="p-2.5">Gz (°/s)</th>
                    <th className="p-2.5">Angle</th>
                    <th className="p-2.5">Roll</th>
                    <th className="p-2.5">State</th>
                    <th className="p-2.5">Score</th>
                    <th className="p-2.5">Conf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="p-4 text-center text-gray-500">
                        No telemetry samples captured yet. Run a scenario or connect hardware.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item, idx) => {
                      const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "--";
                      const state = item.classification?.state;
                      const badgeClass =
                        state === PostureState.GOOD
                          ? "text-emerald-400 bg-emerald-500/10"
                          : state === PostureState.WARNING
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-red-400 bg-red-500/10";

                      return (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="p-2.5 text-gray-400 whitespace-nowrap">{timeStr}</td>
                          <td className="p-2.5">{item.raw?.ax?.toFixed(3)}</td>
                          <td className="p-2.5">{item.raw?.ay?.toFixed(3)}</td>
                          <td className="p-2.5">{item.raw?.az?.toFixed(3)}</td>
                          <td className="p-2.5">{item.raw?.gx?.toFixed(2)}</td>
                          <td className="p-2.5">{item.raw?.gy?.toFixed(2)}</td>
                          <td className="p-2.5">{item.raw?.gz?.toFixed(2)}</td>
                          <td className="p-2.5 font-bold text-white">{item.features?.tiltAngle?.toFixed(1)}°</td>
                          <td className="p-2.5">{item.features?.roll?.toFixed(1)}°</td>
                          <td className="p-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                              {state}
                            </span>
                          </td>
                          <td className="p-2.5 font-bold">{item.classification?.postureScore}%</td>
                          <td className="p-2.5 text-gray-400">{item.classification?.confidence}%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-cyan-300 text-xs font-mono overflow-auto max-h-80">
              {latestJson}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

