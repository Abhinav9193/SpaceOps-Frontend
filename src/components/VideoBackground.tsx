'use client';

export default function VideoBackground() {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60 scale-105"
            >
                <source
                    src="https://motionbgs.com/media/4607/dark-galaxy.960x540.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>
    );
}
