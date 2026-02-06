'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Rocket, Calendar, Building2, Clock } from 'lucide-react';

interface Launch {
    id: number;
    name: string;
    provider: string;
    date: string;
    status: string;
}

export default function LaunchesPage() {
    const [launches, setLaunches] = useState<Launch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLaunches();
    }, []);

    const fetchLaunches = async () => {
        try {
            const response = await api.get('/launches/upcoming');
            setLaunches(response.data);
        } catch (error) {
            console.error('Error fetching launches:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCountdown = (launchDate: string) => {
        const now = new Date().getTime();
        const launch = new Date(launchDate).getTime();
        const diff = launch - now;

        if (diff < 0) return 'Launched';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getStatusColor = (status: string) => {
        if (status.toLowerCase().includes('go')) return 'text-green-400 bg-green-500/20 border-green-500/30';
        if (status.toLowerCase().includes('hold')) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        if (status.toLowerCase().includes('success')) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-12 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-4">
                    <Rocket className="w-16 h-16 text-orange-400" />
                    <h1 className="text-5xl md:text-7xl font-bold gradient-text-sunset">Upcoming Launches</h1>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Stay updated with the latest rocket launches from space agencies worldwide
                </p>
            </motion.div>

            {/* Launches Timeline */}
            <div className="space-y-6">
                {launches.map((launch, index) => (
                    <motion.div
                        key={launch.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 md:p-8 rounded-xl"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            {/* Launch Info */}
                            <div className="flex-1 space-y-4">
                                {/* Mission Name */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
                                        <Rocket className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{launch.name}</h2>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4" />
                                                <span>{launch.provider}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(launch.date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{new Date(launch.date).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(launch.status)}`}>
                                        {launch.status}
                                    </span>
                                </div>
                            </div>

                            {/* Countdown */}
                            <div className="flex-shrink-0">
                                <div className="glass-card p-6 rounded-xl text-center min-w-[150px]">
                                    <div className="text-sm text-gray-400 mb-2">Countdown</div>
                                    <div className="text-3xl font-bold gradient-text-sunset">
                                        {getCountdown(launch.date)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {launches.length === 0 && !loading && (
                <div className="text-center py-20">
                    <Rocket className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-400">No upcoming launches scheduled yet.</p>
                </div>
            )}

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8 rounded-2xl text-center"
            >
                <h3 className="text-2xl font-bold gradient-text mb-4">Launch Updates</h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Launch schedules are updated hourly. Times and dates are subject to change based on weather conditions and technical requirements.
                </p>
            </motion.div>
        </div>
    );
}
