"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Satellite, Cpu, Signal, Activity } from "lucide-react";
import api from "@/lib/api";

export default function Satellites() {
    const [satellites, setSatellites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/satellites')
            .then(res => {
                setSatellites(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Active Satellites</h1>
                <p className="text-slate-400">TLE data and orbital telemetry for active stations.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass-card h-32 animate-pulse bg-white/5" />
                    ))
                ) : (
                    satellites.slice(0, 50).map((sat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (i % 20) * 0.02 }}
                            key={sat.id}
                            className="glass-card p-4 flex gap-4 hover:border-purple-500/30 transition-all cursor-default group"
                        >
                            <div className="w-12 h-12 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
                                <Satellite size={20} className="text-purple-400 group-hover:animate-spin" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold truncate text-slate-200">{sat.name}</h3>
                                    <div className="flex gap-1">
                                        <Signal size={12} className="text-green-500" />
                                        <Activity size={12} className="text-blue-500" />
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] font-mono text-slate-500 bg-black/30 p-2 rounded border border-white/5 whitespace-pre-wrap overflow-hidden">
                                    {sat.orbitData}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
