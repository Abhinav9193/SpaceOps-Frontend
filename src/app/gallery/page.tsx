'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { X, ZoomIn, Filter, User, Globe, Rocket } from 'lucide-react';

interface UnifiedImage {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    hdImageUrl?: string;
    source: string;
    captureDate: string;
    uploaderName?: string;
    isCommunity?: boolean;
}

export default function GalleryPage() {
    const [images, setImages] = useState<UnifiedImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<UnifiedImage | null>(null);
    const [filter, setFilter] = useState<'all' | 'nasa' | 'community'>('all');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);

        const fetchSafe = async (url: string) => {
            try {
                const res = await api.get(url);
                return res.data;
            } catch (e) {
                console.error(`Error fetching ${url}:`, e);
                return null;
            }
        };

        try {
            const [nasaData, communityData] = await Promise.all([
                fetchSafe('/images'),
                fetchSafe('/community-images')
            ]);

            const nasaImages = Array.isArray(nasaData)
                ? nasaData.map((img: any) => ({ ...img, isCommunity: false }))
                : [];

            const communityImages = Array.isArray(communityData)
                ? communityData.map((img: any) => ({
                    id: img.id,
                    title: img.title,
                    description: img.description || '',
                    imageUrl: img.imageUrl && img.imageUrl.startsWith('http')
                        ? img.imageUrl
                        : img.imageUrl
                            ? `http://localhost:8080${img.imageUrl}`
                            : '/placeholder-space.jpg',
                    source: 'Community',
                    uploaderName: img.uploaderName || 'Anonymous',
                    captureDate: img.uploadedAt || new Date().toISOString(),
                    isCommunity: true
                }))
                : [];

            const combined = [...nasaImages, ...communityImages].sort((a, b) =>
                new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime()
            );

            setImages(combined);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = images.filter(img => {
        if (filter === 'all') return true;
        if (filter === 'nasa') return !img.isCommunity;
        if (filter === 'community') return img.isCommunity;
        return true;
    });

    if (loading && images.length === 0) {
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
                className="text-center space-y-6"
            >
                <h1 className="text-5xl md:text-7xl font-bold gradient-text-galaxy">Space Gallery</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Explore stunning images from NASA and remarkable photography from our community
                </p>

                {/* Filters */}
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all border ${filter === 'all' ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <Globe className="w-4 h-4" />
                        All
                    </button>
                    <button
                        onClick={() => setFilter('nasa')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all border ${filter === 'nasa' ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <Rocket className="w-4 h-4" />
                        NASA
                    </button>
                    <button
                        onClick={() => setFilter('community')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all border ${filter === 'community' ? 'bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <User className="w-4 h-4" />
                        Community
                    </button>
                </div>
            </motion.div>

            {/* Masonry Grid */}
            <div className="masonry-grid">
                <AnimatePresence mode='popLayout'>
                    {filteredImages.map((image, index) => (
                        <motion.div
                            key={`${image.isCommunity ? 'c' : 'n'}-${image.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="masonry-item"
                        >
                            <div
                                className="glass-card overflow-hidden rounded-xl cursor-pointer group relative"
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="image-zoom relative aspect-auto">
                                    <img
                                        src={image.imageUrl}
                                        alt={image.title}
                                        className="w-full h-auto object-cover min-h-[200px]"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ZoomIn className="w-12 h-12 text-white" />
                                    </div>
                                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold border ${image.isCommunity ? 'bg-pink-600/80 border-pink-400' : 'bg-blue-600/80 border-blue-400'}`}>
                                        {image.isCommunity ? 'Community' : 'NASA'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg line-clamp-2">{image.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                        {image.isCommunity ? (
                                            <>
                                                <User className="w-3 h-3" />
                                                <span>{image.uploaderName}</span>
                                            </>
                                        ) : (
                                            <span>NASA</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-6xl w-full max-h-[90vh] overflow-auto glass-card rounded-2xl border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-white/20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-full bg-black/50 overflow-hidden">
                                <img
                                    src={selectedImage.hdImageUrl || selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    className="w-full h-auto mx-auto object-contain max-h-[70vh]"
                                />
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <h2 className="text-3xl font-bold">{selectedImage.title}</h2>
                                    <div className={`px-4 py-1 rounded-full text-sm font-bold border ${selectedImage.isCommunity ? 'bg-pink-600/20 border-pink-400 text-pink-300' : 'bg-blue-600/20 border-blue-400 text-blue-300'}`}>
                                        {selectedImage.isCommunity ? 'Community Contribution' : 'NASA Official'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        {selectedImage.isCommunity ? <User className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        {selectedImage.isCommunity ? selectedImage.uploaderName : 'NASA'}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(selectedImage.captureDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-lg">{selectedImage.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredImages.length === 0 && !loading && (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                    <Filter className="w-16 h-16 text-gray-600" />
                    <p className="text-xl text-gray-400">No images found for this category.</p>
                </div>
            )}
        </div>
    );
}
