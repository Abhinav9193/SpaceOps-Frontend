'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Calendar, ZoomIn, X } from 'lucide-react';
import Link from 'next/link';

interface CommunityImage {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    uploaderName: string;
    uploadedAt: string;
}

export default function CommunityImagesPage() {
    const [images, setImages] = useState<CommunityImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<CommunityImage | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await api.get('/community-images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching community images:', error);
        } finally {
            setLoading(false);
        }
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
                <h1 className="text-5xl md:text-7xl font-bold gradient-text-nebula">Community Gallery</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Amazing space photography shared by our community members
                </p>
                <Link href="/upload-image">
                    <button className="btn-primary mt-4">Share Your Image</button>
                </Link>
            </motion.div>

            {/* Masonry Grid */}
            <div className="masonry-grid">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="masonry-item"
                    >
                        <div
                            className="glass-card overflow-hidden rounded-xl cursor-pointer group relative"
                            onClick={() => setSelectedImage(image)}
                        >
                            <div className="image-zoom relative">
                                <img
                                    src={`http://localhost:8080${image.imageUrl}`}
                                    alt={image.title}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <h3 className="font-bold text-lg line-clamp-2">{image.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <User className="w-4 h-4" />
                                    <span>{image.uploaderName}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-6xl w-full max-h-[90vh] overflow-auto glass-card rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <img
                                src={`http://localhost:8080${selectedImage.imageUrl}`}
                                alt={selectedImage.title}
                                className="w-full h-auto"
                            />
                            <div className="p-6 space-y-4">
                                <h2 className="text-3xl font-bold">{selectedImage.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{selectedImage.uploaderName}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(selectedImage.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {selectedImage.description && (
                                    <p className="text-gray-300 leading-relaxed">{selectedImage.description}</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {images.length === 0 && !loading && (
                <div className="text-center py-20 space-y-4">
                    <p className="text-xl text-gray-400">No community images yet. Be the first to share!</p>
                    <Link href="/upload-image">
                        <button className="btn-primary">Upload an Image</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
