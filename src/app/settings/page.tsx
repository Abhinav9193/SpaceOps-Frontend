"use client";

import { Settings as SettingsIcon, Bell, Shield, Sliders, Save } from "lucide-react";

export default function Settings() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-slate-400">Configure mission control preferences and security.</p>
            </div>

            <div className="space-y-4">
                {[
                    { icon: Bell, title: "Notifications", desc: "Configure alerts for hazardous asteroids and launches." },
                    { icon: Shield, title: "Security", desc: "Manage access controls and API authentication." },
                    { icon: Sliders, title: "Telemetry", desc: "Adjust data refresh rates and sensor sensitivity." },
                ].map((item, i) => (
                    <div key={i} className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                <item.icon size={24} className="group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-slate-800 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-slate-500 rounded-full" />
                        </div>
                    </div>
                ))}

                <div className="pt-6">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30">
                        <Save size={18} />
                        Commit Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
