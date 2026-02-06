"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    return (
        <div className={cn("min-h-screen transition-colors duration-500", theme)}>
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full glass-card border-none text-xl hover:scale-110 transition-transform"
                >
                    {theme === "dark" ? "🌙" : "☀️"}
                </button>
            </div>
            {children}
        </div>
    );
}
