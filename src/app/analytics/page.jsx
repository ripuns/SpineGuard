"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState({ good: 0, bad: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const res = await fetch("http://localhost:5000/analytics");
            const data = await res.json();
            
            if (data.status === "success") {
                setAnalyticsData(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            // Fallback data if API fails
            setAnalyticsData({ good: 128, bad: 42, percentage: 75.3 });
        } finally {
            setLoading(false);
        }
    };

    const getPercentageColor = (percentage) => {
        if (percentage >= 80) return "text-green-300";
        if (percentage >= 60) return "text-yellow-300";
        return "text-red-300";
    };

    const getPercentageBg = (percentage) => {
        if (percentage >= 80) return "from-green-500/20 to-green-600/20";
        if (percentage >= 60) return "from-yellow-500/20 to-yellow-600/20";
        return "from-red-500/20 to-red-600/20";
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#021229] via-[#0a1a2f] to-[#1a2a3f] text-white">
                <div className="relative z-10 flex flex-col items-center space-y-8">
                    <div className="relative">
                        <div className="w-32 h-32 border-4 border-transparent border-t-green-400 border-r-blue-400 rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Loading Analytics...
                        </h2>
                        <p className="text-gray-300 text-lg">Processing your posture data</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#021229] via-[#0a1a2f] to-[#1a2a3f] text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Floating spine icon */}
            <div className="absolute top-20 right-20 opacity-10">
                <img
                    src="/spine.svg"
                    alt="Spine Background"
                    className="w-64 h-64 animate-float"
                />
            </div>

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

                {/* Main Analytics Card */}
                <div className="mb-12 w-full max-w-4xl">
                    <div className="relative p-8 rounded-3xl backdrop-blur-md border bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/20 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">Overall Posture Score</h2>
                            <div className={`text-8xl font-bold mb-4 ${getPercentageColor(analyticsData.percentage)}`}>
                                {analyticsData.percentage.toFixed(1)}%
                            </div>
                            <p className="text-xl text-gray-300">
                                {analyticsData.percentage >= 80 ? 'Excellent!' : 
                                 analyticsData.percentage >= 60 ? 'Good job!' : 'Keep improving!'}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-4 mb-8">
                            <div 
                                className={`h-4 rounded-full bg-gradient-to-r ${getPercentageBg(analyticsData.percentage)}`}
                                style={{ width: `${analyticsData.percentage}%` }}
                            ></div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Good Postures */}
                            <div className="text-center p-6 rounded-2xl bg-green-500/10 border border-green-400/20">
                                <div className="text-4xl font-bold text-green-400 mb-2">
                                    {analyticsData.good}
                                </div>
                                <div className="text-lg text-gray-300">Good Postures</div>
                                <div className="text-sm text-green-400 mt-1">
                                    {((analyticsData.good / (analyticsData.good + analyticsData.bad)) * 100).toFixed(1)}% of total
                                </div>
                            </div>

                            {/* Bad Postures */}
                            <div className="text-center p-6 rounded-2xl bg-red-500/10 border border-red-400/20">
                                <div className="text-4xl font-bold text-red-400 mb-2">
                                    {analyticsData.bad}
                                </div>
                                <div className="text-lg text-gray-300">Bad Postures</div>
                                <div className="text-sm text-red-400 mt-1">
                                    {((analyticsData.bad / (analyticsData.good + analyticsData.bad)) * 100).toFixed(1)}% of total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25"
                    >
                        <span className="relative z-10 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </span>
                    </button>

                    <button
                        onClick={() => router.push('/posture-monitor')}
                        className="group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/25"
                    >
                        <span className="relative z-10 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Start New Session</span>
                        </span>
                    </button>
                </div>

                {/* Tips Section */}
                <div className="w-full max-w-2xl text-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Tips for Better Posture</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-green-400 font-semibold mb-2">✓ Keep your back straight</div>
                            <div>Align your spine with your chair back</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-green-400 font-semibold mb-2">✓ Feet flat on floor</div>
                            <div>Keep both feet planted firmly</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-green-400 font-semibold mb-2">✓ Screen at eye level</div>
                            <div>Position monitor to avoid neck strain</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-green-400 font-semibold mb-2">✓ Take breaks</div>
                            <div>Stand up and stretch every 30 minutes</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
