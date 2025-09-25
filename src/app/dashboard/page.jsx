"use client";
import React from "react";
import { useState } from "react";

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(""); // "GOOD" | "BAD" | "TRAIN"
    const [goodDone, setGoodDone] = useState(false);
    const [badDone, setBadDone] = useState(false);
    const [trainingDone, setTrainingDone] = useState(false);

    const handleCalibrate = async (type) => {
        setLoading(true);
        setLoadingType(type);

        const endpoint =
            type === "GOOD"
                ? "http://localhost:5000/calibrate/good"
                : "http://localhost:5000/calibrate/bad";

        try {
            const res = await fetch(endpoint, { method: "POST" });
            const data = await res.json();

            if (type === "GOOD") setGoodDone(true);
            if (type === "BAD") setBadDone(true)
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingType("");
        }
    };

    const handleTrain = async () => {
        setLoading(true);
        setLoadingType("TRAIN");

        try {
            const res = await fetch("http://localhost:5000/train", { method: "POST" });
            const data = await res.json();

            if (data.status === "success") {
                setTrainingDone(true);
                // Redirect to posture monitor page after training
                setTimeout(() => {
                    window.location.href = '/posturepred';
                }, 2000);
            } else {
                console.error(data.message);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingType("");
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#021229] via-[#0a1a2f] to-[#1a2a3f] text-white">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-50" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                {/* Animated spine icon */}
                <div className="relative z-10 flex flex-col items-center space-y-8">
                    <div className="relative">
                        <img
                            src="/spine.svg"
                            alt="Spine Background"
                            className="w-32 h-32 animate-spin-slow opacity-80"
                        />
                        <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-green-400 border-r-blue-400 rounded-full animate-spin"></div>
                    </div>

                    {/* Loading text with animation */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            {loadingType === "GOOD" && "Calibrating Good Posture"}
                            {loadingType === "BAD" && "Calibrating Bad Posture"}
                            {loadingType === "TRAIN" && "Training AI Model"}
                        </h2>
                        <p className="text-gray-300 text-lg">
                            {loadingType === "GOOD" && "Please sit with perfect posture..."}
                            {loadingType === "BAD" && "Please sit with poor posture..."}
                            {loadingType === "TRAIN" && "Teaching the AI to recognize patterns..."}
                        </p>

                        {/* Progress dots */}
                        <div className="flex justify-center space-x-2 mt-4">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // const handleCalibrateGood = async () => {
    //     await fetch("http://localhost:5000/calibrate/good", { method: "POST" });
    //     alert("Calibrating GOOD posture...");
    // };

    // const handleCalibrateBad = async () => {
    //     await fetch("http://localhost:5000/calibrate/bad", { method: "POST" });
    //     alert("Calibrating BAD posture...");
    // };
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#021229] via-[#0a1a2f] to-[#1a2a3f] text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Floating spine icon */}
            <div className="absolute  opacity-10">
                <img
                    src="/spine.svg"
                    alt="Spine Background"
                    className="w-full h-full animate-float"
                />
            </div>

            {/* Main content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                {/* Welcome section */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold bg-white bg-clip-text text-transparent animate-fade-in">
                        Hey Ripun,
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light animate-fade-in-delay">
                        let's sit straight today!
                    </p>
                </div>

                {/* Status cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-4xl">
                    {/* Good Posture Card */}
                    <div className={`relative group transition-all duration-500 transform hover:scale-105 ${goodDone ? 'animate-slide-up' : 'animate-slide-up-delay'
                        }`}>
                        <div className={`relative p-8 rounded-3xl backdrop-blur-md border transition-all duration-300 ${goodDone
                            ? 'bg-green-500/20 border-green-400/50 shadow-green-500/20'
                            : 'bg-white/5 border-white/10 hover:border-green-400/30 hover:shadow-2xl hover:shadow-green-500/10'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${goodDone ? 'bg-green-500' : 'bg-green-500/20'
                                        }`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold">Good Posture</h3>
                                </div>
                                {goodDone && (
                                    <div className="text-green-400 text-2xl">✓</div>
                                )}
                            </div>
                            <p className="text-gray-300 mb-6">
                                {goodDone
                                    ? 'Perfect! Your good posture has been calibrated.'
                                    : 'Calibrate your ideal sitting position for the AI to learn.'
                                }
                            </p>
                            <button
                                onClick={() => handleCalibrate("GOOD")}
                                disabled={goodDone}
                                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${goodDone
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/25'
                                    }`}
                            >
                                {goodDone ? 'Calibrated ✓' : 'Calibrate Good Posture'}
                            </button>
                        </div>
                    </div>

                    {/* Bad Posture Card */}
                    <div className={`relative group transition-all duration-500 transform hover:scale-105 ${badDone ? 'animate-slide-up' : 'animate-slide-up-delay-2'
                        }`}>
                        <div className={`relative p-8 rounded-3xl backdrop-blur-md border transition-all duration-300 ${badDone
                            ? 'bg-red-500/20 border-red-400/50 shadow-red-500/20'
                            : 'bg-white/5 border-white/10 hover:border-red-400/30 hover:shadow-2xl hover:shadow-red-500/10'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badDone ? 'bg-red-500' : 'bg-red-500/20'
                                        }`}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold">Bad Posture</h3>
                                </div>
                                {badDone && (
                                    <div className="text-red-400 text-2xl">✓</div>
                                )}
                            </div>
                            <p className="text-gray-300 mb-6">
                                {badDone
                                    ? 'Done! Your poor posture has been recorded.'
                                    : 'Show the AI what bad posture looks like for comparison.'
                                }
                            </p>
                            <button
                                onClick={() => handleCalibrate("BAD")}
                                disabled={badDone}
                                className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${badDone
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25'
                                    }`}
                            >
                                {badDone ? 'Calibrated ✓' : 'Calibrate Bad Posture'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Start Training Button */}
                <div className={`transition-all duration-500 transform hover:scale-105 ${goodDone && badDone ? 'animate-slide-up-delay-3' : 'opacity-50'
                    }`}>
                    <button
                        onClick={handleTrain}
                        className={`group relative px-12 py-6 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-blue-500/25
                            `}
                    >
                        <span className="relative z-10 flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{trainingDone ? 'Training Complete ✓' : 'Start AI Training'}</span>
                        </span>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="mt-8 flex items-center space-x-4 text-sm text-gray-400">
                    <div className={`w-3 h-3 rounded-full ${goodDone ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span>Good Posture</span>
                    <div className="w-8 h-px bg-gray-600"></div>
                    <div className={`w-3 h-3 rounded-full ${badDone ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                    <span>Bad Posture</span>
                    <div className="w-8 h-px bg-gray-600"></div>
                    <div className={`w-3 h-3 rounded-full ${goodDone && badDone ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                    <span>Ready to Train</span>
                </div>
            </main>
        </div>
    );
}
