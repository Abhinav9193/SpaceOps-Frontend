"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Rocket, Globe, Satellite, Settings, Database, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Launches", href: "/launches", icon: Rocket },
    { name: "Asteroids", href: "/asteroids", icon: Database },
    { name: "Satellites", href: "/satellites", icon: Satellite },
    { name: "Explore Earth", href: "/explore", icon: Globe },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-full glass-card border-l-0 border-y-0 rounded-none hidden md:flex flex-col p-4 z-40">
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Rocket className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tighter neon-text">SPACEOPS</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive && "animate-pulse")} />
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-4 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Audio</span>
                    <button onClick={() => { }} className="text-slate-500 hover:text-white transition-colors">
                        <Volume2 size={16} />
                    </button>
                </div>

                <div className="p-4 glass-card border-none bg-blue-900/10">
                    <p className="text-xs text-slate-500">System Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-sm font-semibold text-green-500">OPERATIONAL</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
