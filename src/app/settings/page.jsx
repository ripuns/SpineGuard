"use client";
import React, { useState } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        notifications: true,
        soundAlerts: true,
        emailReports: false,
        postureThreshold: 80,
        monitoringInterval: 1000
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        // Save settings to localStorage
        localStorage.setItem("spineguard-settings", JSON.stringify(settings));
        alert("Settings saved successfully!");
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
                        Settings
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light animate-fade-in-delay">
                        Customize your posture monitoring experience
                    </p>
                </div>

                {/* Settings Card */}
                <div className="w-full max-w-2xl">
                    <div className="relative p-8 rounded-3xl backdrop-blur-md border bg-white/5 border-white/20 shadow-2xl">
                        
                        {/* Notifications Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-green-400">Notifications</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div>
                                        <h4 className="font-medium">Push Notifications</h4>
                                        <p className="text-sm text-gray-400">Receive alerts for posture changes</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications}
                                            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div>
                                        <h4 className="font-medium">Sound Alerts</h4>
                                        <p className="text-sm text-gray-400">Audio notifications for bad posture</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.soundAlerts}
                                            onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div>
                                        <h4 className="font-medium">Email Reports</h4>
                                        <p className="text-sm text-gray-400">Daily posture summary emails</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailReports}
                                            onChange={(e) => handleSettingChange('emailReports', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Monitoring Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">Monitoring</h3>
                            
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <label className="block text-sm font-medium mb-2">
                                        Posture Threshold: {settings.postureThreshold}%
                                    </label>
                                    <p className="text-sm text-gray-400 mb-3">Minimum good posture percentage to avoid alerts</p>
                                    <input
                                        type="range"
                                        min="50"
                                        max="95"
                                        value={settings.postureThreshold}
                                        onChange={(e) => handleSettingChange('postureThreshold', parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <label className="block text-sm font-medium mb-2">
                                        Monitoring Interval: {settings.monitoringInterval}ms
                                    </label>
                                    <p className="text-sm text-gray-400 mb-3">How often to check posture (lower = more responsive)</p>
                                    <select
                                        value={settings.monitoringInterval}
                                        onChange={(e) => handleSettingChange('monitoringInterval', parseInt(e.target.value))}
                                        className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={500}>500ms (Very Fast)</option>
                                        <option value={1000}>1000ms (Fast)</option>
                                        <option value={2000}>2000ms (Normal)</option>
                                        <option value={5000}>5000ms (Slow)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

