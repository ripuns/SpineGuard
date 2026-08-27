"use client";
import React, { useState, useEffect } from "react";

export default function CalibrationModal({
  isOpen = false,
  onClose,
  onSaveBaseline,
  currentSpinalAngle = 78.5,
}) {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [samples, setSamples] = useState([]);
  const [calculatedBaseline, setCalculatedBaseline] = useState(78.5);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setCountdown(3);
      setSamples([]);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (isOpen && step === 2) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
          setSamples((prev) => [...prev, currentSpinalAngle]);
        }, 1000);
      } else {
        const validSamples = samples.length > 0 ? samples : [currentSpinalAngle];
        const sum = validSamples.reduce((acc, v) => acc + v, 0);
        const avg = Number((sum / validSamples.length).toFixed(1));
        setCalculatedBaseline(avg);
        setStep(3);
      }
    }
    return () => clearTimeout(timer);
  }, [isOpen, step, countdown, currentSpinalAngle, samples]);

  if (!isOpen) return null;

  const handleStartSampling = () => {
    setCountdown(3);
    setSamples([]);
    setStep(2);
  };

  const handleSaveAndApply = () => {
    if (onSaveBaseline) onSaveBaseline(calculatedBaseline);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0a1526] border border-white/20 rounded-3xl p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? "w-8 bg-emerald-400" : step > i ? "w-4 bg-emerald-700" : "w-4 bg-gray-700"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Posture Calibration</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Sit upright with your shoulders back and spine aligned naturally against your chair back.
              We will capture a 3-second baseline reference.
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 text-left">
              <p className="font-semibold text-white mb-1">Calibration Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Keep feet flat on the floor</li>
                <li>Gaze directly forward at screen level</li>
                <li>Avoid talking or rotating trunk during capture</li>
              </ul>
            </div>
            <button
              onClick={handleStartSampling}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-lg hover:shadow-emerald-500/25 transition transform hover:scale-[1.02]"
            >
              Start 3-Second Calibration
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6 py-4">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center">
                <span className="text-4xl font-extrabold text-emerald-400 font-mono">{countdown}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Hold Steady...</h3>
              <p className="text-xs text-gray-400 mt-1">Sampling 6-DOF IMU gravity vectors to calculate baseline datum</p>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Calibration Complete!</h3>
              <p className="text-xs text-gray-300 mt-1">Your personalized optimal spinal datum has been established.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 uppercase font-semibold">Baseline Spinal Datum</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono my-1">{calculatedBaseline}°</p>
              <p className="text-[11px] text-gray-400">
                Warning threshold set at <strong className="text-amber-300">{(calculatedBaseline - 4.5).toFixed(1)}°</strong> | Bad posture at <strong className="text-red-300">{(calculatedBaseline - 10.5).toFixed(1)}°</strong>
              </p>
            </div>
            <button
              onClick={handleSaveAndApply}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-lg hover:shadow-emerald-500/25 transition transform hover:scale-[1.02]"
            >
              Save Baseline & Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

