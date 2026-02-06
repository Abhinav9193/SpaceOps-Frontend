'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Send } from 'lucide-react';

export default function UploadImagePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        uploaderName: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image to upload');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('uploaderName', formData.uploaderName);

            await api.post('/community-images', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/community-images');
        } catch (error: any) {
            setError(error.response?.data || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-12 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-bold gradient-text-galaxy">Share Your Image</h1>
                <p className="text-xl text-gray-300">
                    Upload your space photography and share it with the community
                </p>
            </motion.div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="glass-card p-8 rounded-2xl space-y-6"
            >
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                        {error}
                    </div>
                )}

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="block text-lg font-semibold">Image File *</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            required
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-white/5"
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center space-y-4">
                                    <Upload className="w-16 h-16 text-gray-400" />
                                    <div className="text-center">
                                        <p className="text-lg font-semibold">Click to upload image</p>
                                        <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-lg font-semibold">
                        Image Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Give your image a title..."
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-lg font-semibold">
                        Description (optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about this image..."
                    />
                </div>

                {/* Uploader Name */}
                <div className="space-y-2">
                    <label htmlFor="uploaderName" className="block text-lg font-semibold">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        id="uploaderName"
                        name="uploaderName"
                        required
                        value={formData.uploaderName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Your name..."
                    />
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="spinner w-5 h-5 border-2"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Upload Image
                        </>
                    )}
                </motion.button>
            </motion.form>
        </div>
    );
}
