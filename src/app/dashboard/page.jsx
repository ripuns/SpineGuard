"use client";
import React from "react";
import { useState } from "react";

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(""); // "GOOD" | "BAD"
    const [goodDone, setGoodDone] = useState(false);
    const [badDone, setBadDone] = useState(false);

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

            if (data.status === "success") {
                if (type === "GOOD") setGoodDone(true);
                if (type === "BAD") setBadDone(true);
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

    const handleTrain = async () => {
        setLoading(true);
        setLoadingType("TRAIN");

        try {
            const res = await fetch("http://localhost:5000/train", { method: "POST" });
            const data = await res.json();

            if (data.status === "success") {
                alert("Model trained successfully!");
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
            <div className="flex items-center justify-center min-h-screen bg-[#0a1a2f] text-white relative">
                <img
                    src="/spine.svg"
                    alt="Spine Background"
                    className="absolute inset-0 mx-auto h-full opacity-30 object-contain pointer-events-none"
                />
                <p className="relative z-10 text-xl font-semibold">
                    {loadingType === "GOOD" && "Calibrating Good Posture..."}
                    {loadingType === "BAD" && "Calibrating Bad Posture..."}
                    {loadingType === "TRAIN" && "Training model..."}
                </p>
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
        <div className="flex min-h-screen bg-[#021229] text-white">

            {/* Main content */}
            <main className="flex-1 relative flex flex-col items-center justify-center">
                <img
                    src="/spine.svg"
                    alt="Spine Background"
                    className="absolute inset-0 mx-auto h-lvh opacity-80 object-contain pointer-events-none"
                />

                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">Hey Yash,</h1>
                    <p className="text-gray-300 mb-6">let’s sit straight today!</p>

                    <div className="flex gap-6 justify-center">
                        <button
                            onClick={() => handleCalibrate("GOOD")}
                            disabled={goodDone}
                            className={`px-6 py-3 rounded-full shadow-lg ${goodDone ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {goodDone ? "Good Calibrated ✅" : "Calibrate Good"}
                        </button>
                        <button
                            onClick={() => handleCalibrate("BAD")}
                            disabled={badDone}
                            className={`px-6 py-3 rounded-full shadow-lg ${badDone ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {badDone ? "Bad Calibrated ✅" : "Calibrate Bad"}
                        </button>
                    </div>
                    <button
                        onClick={handleTrain}
                        className="mt-8 px-15 py-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
                    >
                        Start
                    </button>
                </div>
            </main>
        </div>
    );
}
