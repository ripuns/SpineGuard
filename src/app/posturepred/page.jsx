"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostureMonitorPage() {
    const [postureStatus, setPostureStatus] = useState("GOOD"); // "GOOD" | "BAD"
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [sessionData, setSessionData] = useState({ good: 0, bad: 0 });
    const router = useRouter();

    useEffect(() => {
        // Start monitoring when component mounts
        startMonitoring();
    }, []);

    const startMonitoring = async () => {
        setIsMonitoring(true);
        
        try {
            // Start the test.py script
            const res = await fetch("http://localhost:5000/start-monitoring", { 
                method: "POST" 
            });
            
            const data = await res.json();
            console.log("Start monitoring response:", data);
            
            if (res.ok && data.status === "success") {
                // Start polling for posture updates
                pollPostureStatus();
            } else {
                console.error("Failed to start monitoring:", data.message);
                setIsMonitoring(false);
            }
        } catch (error) {
            console.error("Failed to start monitoring:", error);
            setIsMonitoring(false);
        }
    };

    const pollPostureStatus = () => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch("http://localhost:5000/posture-status");
                const data = await res.json();
                
                if (data.status === "success") {
                    setPostureStatus(data.posture);
                    setSessionData(data.session_data);
                }
            } catch (error) {
                console.error("Failed to get posture status:", error);
            }
        }, 1000); // Poll every second

        // Store interval ID for cleanup
        window.postureInterval = interval;
    };

    const stopMonitoring = async () => {
        setIsMonitoring(false);
        
        // Clear the polling interval
        if (window.postureInterval) {
            clearInterval(window.postureInterval);
        }

        try {
            // Stop the monitoring script
            await fetch("http://localhost:5000/stop-monitoring", { 
                method: "POST" 
            });
            
            // Redirect to analytics page
            router.push('/analytics');
        } catch (error) {
            console.error("Failed to stop monitoring:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#021229] via-[#0a1a2f] to-[#1a2a3f] text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Main content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-white bg-clip-text text-transparent animate-fade-in">
                        Posture Analytics
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light animate-fade-in-delay">
                        Here's your posture breakdown for today
                    </p>
                </div>

                {/* Posture Status Display */}
                <div className="mb-12">
                    <div className="relative">
                        <div className={`w-80 h-80 rounded-3xl backdrop-blur-md border-4 transition-all duration-500 ${
                            postureStatus === "GOOD" 
                                ? 'bg-green-500/20 border-green-400/50 shadow-2xl shadow-green-500/25' 
                                : 'bg-red-500/20 border-red-400/50 shadow-2xl shadow-red-500/25'
                        }`}>
                            <div className="flex flex-col items-center justify-center h-full p-8">
                                <h2 className="text-2xl font-bold mb-4">Posture Status</h2>
                                <div className={`w-32 h-32 transition-all duration-500 ${
                                    postureStatus === "GOOD" ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    <svg viewBox="0 0 100 200" className="w-full h-full">
                                        {/* Spine SVG - Good posture (straight) */}
                                        {postureStatus === "GOOD" ? (
                                            <path
                                                d="M50 20 Q50 50 50 80 Q50 110 50 140 Q50 170 50 180"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                className="animate-pulse"
                                            />
                                        ) : (
                                            /* Spine SVG - Bad posture (curved) */
                                            <path
                                                d="M50 20 Q70 50 50 80 Q30 110 50 140 Q70 170 50 180"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                className="animate-pulse"
                                            />
                                        )}
                                    </svg>
                                </div>
                                <p className={`text-lg font-semibold mt-4 ${
                                    postureStatus === "GOOD" ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {postureStatus === "GOOD" ? 'Good Posture' : 'Bad Posture'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-2xl">
                    {/* Good Postures Card */}
                    <div className="relative group transition-all duration-500 transform hover:scale-105 animate-slide-up">
                        <div className="relative p-8 rounded-3xl backdrop-blur-md border bg-white/5 border-white/10 hover:border-green-400/30 hover:shadow-2xl hover:shadow-green-500/10">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4 text-green-400">Good Postures</h3>
                                <div className="text-6xl font-bold text-green-400 mb-2">
                                    {sessionData.good}
                                </div>
                                <p className="text-gray-300">Keep it up!</p>
                            </div>
                        </div>
                    </div>

                    {/* Bad Postures Card */}
                    <div className="relative group transition-all duration-500 transform hover:scale-105 animate-slide-up-delay">
                        <div className="relative p-8 rounded-3xl backdrop-blur-md border bg-white/5 border-white/10 hover:border-red-400/30 hover:shadow-2xl hover:shadow-red-500/10">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4 text-red-400">Bad Postures</h3>
                                <div className="text-6xl font-bold text-red-400 mb-2">
                                    {sessionData.bad}
                                </div>
                                <p className="text-gray-300">Try to improve!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stop Button */}
                <div className="transition-all duration-500 transform hover:scale-105 animate-slide-up-delay-2">
                    <button
                        onClick={stopMonitoring}
                        className="group relative px-12 py-6 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-2xl hover:shadow-red-500/25"
                    >
                        <span className="relative z-10 flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                            </svg>
                            <span>Stop Monitoring</span>
                        </span>
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Status Indicator */}
                <div className="mt-8 flex items-center space-x-3 text-sm text-gray-400">
                    <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
                    <span>{isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}</span>
                </div>
            </main>
        </div>
    );
}
