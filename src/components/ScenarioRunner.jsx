"use client";
import React from "react";
import { SimulationScenario, SCENARIO_METADATA } from "@/lib/types";

export default function ScenarioRunner({
  activeScenario = SimulationScenario.HEALTHY_SITTING,
  onSelectScenario,
  isStreaming = false,
  onToggleStream,
  onResetScenario,
  currentStep = 0,
  className = "",
}) {
  const scenarios = Object.values(SCENARIO_METADATA);
  const activeMeta = SCENARIO_METADATA[activeScenario] || scenarios[0];
  const maxSteps = activeMeta.durationSeconds || 30;
  const progressPercent = Math.min(100, Math.round((currentStep / maxSteps) * 100));

  return (
    <div className={`bg-[#0d1b2e] border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h3 className="text-lg font-bold text-white">Interactive Scenario Controller</h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Execute physiological posture profiles to inspect classification, hysteresis, and alert triggering in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStream}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105 ${
              isStreaming
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pause Scenario</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                <span>Run Scenario</span>
              </>
            )}
          </button>

          <button
            onClick={onResetScenario}
            title="Reset active scenario timeline"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {scenarios.map((meta) => {
          const isSelected = meta.id === activeScenario;
          return (
            <button
              key={meta.id}
              onClick={() => onSelectScenario && onSelectScenario(meta.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-400/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/20 rounded-bl-full flex items-start justify-end p-1.5 text-indigo-300">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <h4 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                {meta.label}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {meta.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                <span>Range: <strong className="text-gray-300">{meta.targetAngleRange[0]}°–{meta.targetAngleRange[1]}°</strong></span>
                <span>Duration: <strong className="text-gray-300">{meta.durationSeconds}s</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Active Profile: <strong className="text-white">{activeMeta.label}</strong>
          </span>
          <span className="text-gray-400 font-mono">
            Step {currentStep} / {maxSteps} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

