"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, AlertTriangle, Crosshair, ArrowRight } from "lucide-react";
import api from "@/lib/api";

export default function Asteroids() {
    const [asteroids, setAsteroids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/asteroids/today')
            .then(res => {
                setAsteroids(res.data);
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
                <h1 className="text-3xl font-bold tracking-tight">Near-Earth Objects</h1>
                <p className="text-slate-400">Asteroid tracking and planetary defense monitoring.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Name</th>
                            <th className="px-6 py-4 font-bold">Diameter (km)</th>
                            <th className="px-6 py-4 font-bold">Miss Distance (km)</th>
                            <th className="px-6 py-4 font-bold">Hazard Level</th>
                            <th className="px-6 py-4 font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                                </tr>
                            ))
                        ) : (
                            asteroids.map((asteroid, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={asteroid.id}
                                    className="hover:bg-blue-500/5 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                                                <Database size={14} className="text-slate-400" />
                                            </div>
                                            <span className="font-bold">{asteroid.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">{asteroid.size.toFixed(2)}</td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        {asteroid.distance.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {asteroid.danger ? (
                                            <div className="flex items-center gap-1.5 text-red-500 bg-red-500/10 px-2 py-1 rounded-full text-[10px] font-bold w-fit">
                                                <AlertTriangle size={12} />
                                                HAZARDOUS
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2 py-1 rounded-full text-[10px] font-bold w-fit">
                                                SAFE
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:text-blue-400">
                                            <ArrowRight size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
