"use client";
import React, { useState } from "react";

export default function HardwareVideoDemo({ className = "" }) {
  const [activeStep, setActiveStep] = useState(0);

  const demoSteps = [
    {
      title: "1. Upright Baseline Calibration",
      description: "User sits with ideal spinal alignment; 3-second capture sets the baseline angle datum at ~78.5°.",
    },
    {
      title: "2. Real-time Telemetry Ingestion",
      description: "MPU-6050 streams 10 Hz accelerometer/gyroscope packets over Serial COM7 to the Python Flask backend.",
    },
    {
      title: "3. Optimal Posture Feedback",
      description: "Dashboard renders straight green spinal vertebra, 95%+ posture score, and increments the good streak.",
    },
    {
      title: "4. Intentional Slouching Test",
      description: "User simulates spinal fatigue; angle decreases from 78° → 68° (Warning) → 58° (Bad posture).",
    },
    {
      title: "5. Multi-channel Alert Dispatch",
      description: "Hysteresis engine triggers on-board piezobuzzer, Pushbullet mobile notification, and WebAudio chime.",
    },
    {
      title: "6. Postural Recovery Verification",
      description: "User realigns posture; system latches back to Good state, resets warning count, and logs session recovery.",
    },
  ];

  return (
    <div className={`bg-[#0a1526] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl ${className}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Laboratory & Hardware Verification
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Real Hardware Demonstration
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Watch the MPU-6050 physical wearable device stream live posture intelligence to the full-stack processing engine.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400">Hardware Testbench Status</p>
            <p className="text-sm font-bold text-emerald-400">Verified on Arduino Nano & MPU6050</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-black/60 rounded-2xl border border-white/10 overflow-hidden relative aspect-video flex flex-col items-center justify-center p-6 text-center shadow-inner group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition duration-300">
              <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Physical Device Demo Video Container</h4>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                Embedded demonstration video showcasing Arduino hardware streaming live posture classification and alert triggering.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <span>MPU6050</span>
              <span>•</span>
              <span>Serial COM7</span>
              <span>•</span>
              <span>115200 Baud</span>
              <span>•</span>
              <span>Flask REST API</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Standard Demonstration Protocol
          </h4>
          {demoSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                activeStep === idx
                  ? "bg-white/10 border-emerald-400/50 shadow-md"
                  : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
              }`}
            >
              <h5 className={`text-xs font-bold ${activeStep === idx ? "text-emerald-400" : "text-gray-200"}`}>
                {step.title}
              </h5>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

