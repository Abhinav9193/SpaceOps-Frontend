"use client";

import { useState, useCallback } from "react";

export function useSound(url: string) {
    const [muted, setMuted] = useState(false);

    const play = useCallback(() => {
        if (muted) return;
        const audio = new Audio(url);
        audio.volume = 0.2;
        audio.play().catch(() => { }); // Ignore autoplay errors
    }, [url, muted]);

    return { play, muted, setMuted };
}
