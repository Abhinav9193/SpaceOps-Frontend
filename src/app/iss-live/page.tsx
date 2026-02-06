'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Satellite, MapPin, Clock } from 'lucide-react';

interface ISSPosition {
    iss_position: {
        latitude: string;
        longitude: string;
    };
    timestamp: number;
}

export default function ISSLivePage() {
    const [issData, setIssData] = useState<ISSPosition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchISSPosition();
        const interval = setInterval(fetchISSPosition, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchISSPosition = async () => {
        try {
            const response = await api.get('/iss/live');
            setIssData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ISS position:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    const lat = issData ? parseFloat(issData.iss_position.latitude) : 0;
    const lon = issData ? parseFloat(issData.iss_position.longitude) : 0;

    return (
        <div className="container mx-auto space-y-12 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                        <Satellite className="w-16 h-16 text-cyan-400" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold gradient-text-galaxy">ISS Live Tracker</h1>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Track the International Space Station in real-time as it orbits Earth
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="font-semibold">Live</span>
                </div>
            </motion.div>

            {/* ISS Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-lg font-semibold">Latitude</h3>
                    </div>
                    <p className="text-3xl font-bold gradient-text-galaxy">
                        {lat.toFixed(4)}°
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-semibold">Longitude</h3>
                    </div>
                    <p className="text-3xl font-bold gradient-text">
                        {lon.toFixed(4)}°
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-6 h-6 text-pink-400" />
                        <h3 className="text-lg font-semibold">Last Update</h3>
                    </div>
                    <p className="text-3xl font-bold gradient-text-nebula">
                        {issData ? new Date(issData.timestamp * 1000).toLocaleTimeString() : '--:--:--'}
                    </p>
                </motion.div>
            </div>

            {/* Map Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8 rounded-2xl space-y-6"
            >
                <h2 className="text-3xl font-bold gradient-text">Current Position</h2>

                {/* Simple Map Visualization */}
                <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-blue-950/20 rounded-xl overflow-hidden border border-white/10">
                    {/* World Map Background (simplified) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-10">🌍</div>
                    </div>

                    {/* ISS Marker */}
                    <motion.div
                        className="absolute"
                        style={{
                            left: `${((lon + 180) / 360) * 100}%`,
                            top: `${((90 - lat) / 180) * 100}%`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                            <div className="absolute inset-0 w-8 h-8 bg-cyan-400 rounded-full opacity-30 animate-ping"></div>
                            <Satellite className="w-8 h-8 text-cyan-400 relative z-10" />
                        </div>
                    </motion.div>

                    {/* Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={`h-${i}`}
                                className="absolute w-full border-t border-white/5"
                                style={{ top: `${(i + 1) * 10}%` }}
                            />
                        ))}
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={`v-${i}`}
                                className="absolute h-full border-l border-white/5"
                                style={{ left: `${(i + 1) * 10}%` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center text-gray-400">
                    <p>The ISS travels at approximately 28,000 km/h and completes an orbit every 90 minutes</p>
                </div>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8 rounded-2xl"
            >
                <h2 className="text-3xl font-bold gradient-text-nebula mb-6">ISS Fun Facts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-cyan-400">Speed</h3>
                        <p className="text-gray-300">Travels at 28,000 km/h (17,500 mph)</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-purple-400">Altitude</h3>
                        <p className="text-gray-300">Orbits at approximately 408 km above Earth</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-pink-400">Orbit Time</h3>
                        <p className="text-gray-300">Completes one orbit every 90 minutes</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-orange-400">Size</h3>
                        <p className="text-gray-300">About the size of a football field</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
