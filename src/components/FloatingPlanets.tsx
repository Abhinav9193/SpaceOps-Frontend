'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const planets = [
    { size: 80, color: '#FF6B6B', top: '10%', left: '5%', duration: 20 },
    { size: 60, color: '#4ECDC4', top: '60%', left: '85%', duration: 25 },
    { size: 100, color: '#95E1D3', top: '80%', left: '10%', duration: 30 },
    { size: 50, color: '#F38181', top: '20%', left: '75%', duration: 22 },
    { size: 70, color: '#AA96DA', top: '50%', left: '50%', duration: 28 },
];

export default function FloatingPlanets() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
            {planets.map((planet, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full opacity-20 blur-2xl"
                    style={{
                        width: planet.size,
                        height: planet.size,
                        background: `radial-gradient(circle, ${planet.color} 0%, transparent 70%)`,
                        top: planet.top,
                        left: planet.left,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: planet.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
