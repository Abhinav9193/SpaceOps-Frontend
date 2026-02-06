"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Box, Satellite, AlertTriangle, Zap, Cpu } from "lucide-react";
import GlobeView from "@/components/GlobeView";
import api from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
    { name: '00:00', val: 400 },
    { name: '04:00', val: 300 },
    { name: '08:00', val: 600 },
    { name: '12:00', val: 800 },
    { name: '16:00', val: 500 },
    { name: '20:00', val: 700 },
    { name: '23:59', val: 900 },
];

export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [aiSummary, setAiSummary] = useState<string>("Analyzing current space traffic and telemetry...");
    const [issPos, setIssPos] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                setSummary(res.data);

                const iss = await api.get('/iss/live');
                setIssPos(iss.data.iss_position);

                // Fetch AI summary
                const aiRes = await api.post('/ai/summary', {
                    events: `Upcoming launches: ${res.data.launchCount}, Asteroids today: ${res.data.asteroidCount}, Satellites tracked: ${res.data.satelliteCount}`
                });
                setAiSummary(aiRes.data.summary);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
                    <p className="text-slate-400">Tactical overview of Earth Orbit and Deep Space.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Live Feed</p>
                    <div className="flex items-center gap-2 justify-end">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span className="font-mono text-sm">CONNECTED</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Upcoming Launches", val: summary?.launchCount || 0, icon: Rocket, color: "text-blue-500" },
                    { label: "NEO Asteroids", val: summary?.asteroidCount || 0, icon: Box, color: "text-amber-500" },
                    { label: "Satellites Tracked", val: summary?.satelliteCount || 0, icon: Satellite, color: "text-purple-500" },
                    { label: "Alert Level", val: "NORMAL", icon: AlertTriangle, color: "text-green-500" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass-card p-6 border-l-4 border-l-blue-500"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
                            </div>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Globe Area */}
                <div className="lg:col-span-2 glass-card h-[500px] relative overflow-hidden flex flex-col">
                    <div className="absolute top-4 left-4 z-10">
                        <div className="glass-card bg-black/40 px-3 py-1 text-xs font-mono flex items-center gap-2">
                            <Zap size={14} className="text-blue-400" />
                            <span>ISS POS: {issPos?.latitude || '0.0'}, {issPos?.longitude || '0.0'}</span>
                        </div>
                    </div>
                    <GlobeView />
                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono text-right">
                        GRID: SECTOR 7G<br />SCAN: ACTIVE
                    </div>
                </div>

                {/* AI Insight Panel */}
                <div className="glass-col flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 flex-1 flex flex-col bg-blue-500/5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu size={20} className="text-blue-400" />
                            <h2 className="text-lg font-bold uppercase tracking-wider">AI Insight</h2>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                            "{aiSummary}"
                        </p>
                        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px]">
                            <span className="text-blue-400">ENGINE: SPRING-AI-OPENAI</span>
                            <span className="text-slate-500">READY</span>
                        </div>
                    </motion.div>

                    <div className="glass-card p-6 h-[250px]">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-50">Telemetry Forecast</h2>
                        <div className="h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
