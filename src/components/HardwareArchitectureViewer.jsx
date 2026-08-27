"use client";
import React from "react";

export default function HardwareArchitectureViewer({ className = "" }) {
  const pipelineSteps = [
    {
      step: "01",
      layer: "Wearable Sensor Layer",
      hardware: "MPU-6050 6-DOF IMU",
      details: "Captures 3-axis acceleration (ax, ay, az) and 3-axis angular rates (gx, gy, gz) mounted along the thoracic spine (T3–T5 region).",
      specs: "I2C protocol @ 400kHz, ±2g sensitivity (16384 LSB/g), ±250°/s gyro (131 LSB/°/s).",
      icon: "📐",
    },
    {
      step: "02",
      layer: "Microcontroller Acquisition",
      hardware: "Arduino Nano / ESP32",
      details: "Samples IMU registers at a stabilized 10 Hz (100ms interval). Normalizes raw 16-bit integers to standard physical units (g and °/s).",
      specs: "115200 baud serial UART stream over USB CDC / BLE characteristic.",
      icon: "⚡",
    },
    {
      step: "03",
      layer: "Ingestion & Feature Engine",
      hardware: "Flask Backend & Web Runtime",
      details: "Parses CSV serial packets into float arrays. Computes total acceleration magnitude, gyroscope magnitude, gravitational tilt angle, lateral roll, and sagittal pitch.",
      specs: "Dynamic 2/4-frame adaptive window smoothing based on 15° movement deltas.",
      icon: "🧪",
    },
    {
      step: "04",
      layer: "Biomechanical Classifier",
      hardware: "Random Forest & Hysteresis",
      details: "Evaluates smoothed kinematic feature vector against calibrated ergonomic baseline datum. Applies 3-frame majority voting buffer.",
      specs: "Trained Random Forest model (300 trees) + Biomechanical deviation classifier.",
      icon: "🧠",
    },
    {
      step: "05",
      layer: "Alert & Observability Engine",
      hardware: "Acoustic & Push Notification",
      details: "Maintains consecutive bad-posture accumulators. Triggers on-board piezobuzzer, Pushbullet mobile notifications, and WebAudio chimes upon sustained slouching.",
      specs: "Hysteresis debouncing (20 readings threshold with 5-reading recovery latch).",
      icon: "🔔",
    },
    {
      step: "06",
      layer: "Dashboard & Analytics",
      hardware: "Next.js 15 Web Application",
      details: "Renders real-time dynamic SVG spine curvature, posture score percentage, streak metrics, session trend graphs, and raw developer telemetry inspector.",
      specs: "Turbopack runtime, Tailwind CSS v4, zero-lag reactive state updates.",
      icon: "📊",
    },
  ];

  return (
    <div className={`bg-[#0a1526] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl ${className}`}>
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          Hardware & Data Pipeline Specification
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-3">
          End-to-End System Architecture
        </h2>
        <p className="text-sm text-gray-300 mt-2">
          From micro-electro-mechanical sensor registers to biomechanical decision intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {pipelineSteps.map((s, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/30 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-emerald-400 transition">
                  PHASE {s.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{s.layer}</h3>
              <p className="text-xs font-semibold text-emerald-400 mb-2">{s.hardware}</p>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{s.details}</p>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 font-mono">
              <strong className="text-gray-300">Spec:</strong> {s.specs}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Physical Hardware Wiring & Interface Pinout (MPU-6050 → Arduino Nano)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-gray-300">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">VCC / 3.3V–5V</span>
            <strong className="text-white">Pin 5V / 3V3</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">GND</span>
            <strong className="text-white">Pin GND</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">SCL (I2C Clock)</span>
            <strong className="text-white">Pin A5 (SCL)</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">SDA (I2C Data)</span>
            <strong className="text-white">Pin A4 (SDA)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

