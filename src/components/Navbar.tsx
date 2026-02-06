'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Image, Newspaper, BookOpen, Upload, Satellite, Home } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/launches', label: 'Launches', icon: Rocket },
    { href: '/gallery', label: 'Gallery', icon: Image },
    { href: '/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/iss-live', label: 'ISS Live', icon: Satellite },
    { href: '/upload-image', label: 'Upload', icon: Upload },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl"
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Rocket className="w-8 h-8 text-purple-400" />
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">SpaceOps</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive
                                                ? 'bg-purple-500/20 text-purple-300'
                                                : 'text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
