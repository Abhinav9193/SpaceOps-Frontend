'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Send, Image as ImageIcon } from 'lucide-react';

export default function WriteBlogPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        coverImageUrl: '',
        authorName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/blogs', formData);
            router.push('/blogs');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-12 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl md:text-7xl font-bold gradient-text">Write a Blog</h1>
                <p className="text-xl text-gray-300">
                    Share your space knowledge, experiences, or thoughts with the community
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

                {/* Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-lg font-semibold">
                        Blog Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Enter an engaging title..."
                    />
                </div>

                {/* Author Name */}
                <div className="space-y-2">
                    <label htmlFor="authorName" className="block text-lg font-semibold">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        id="authorName"
                        name="authorName"
                        required
                        value={formData.authorName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Your name..."
                    />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                    <label htmlFor="coverImageUrl" className="block text-lg font-semibold">
                        Cover Image URL (optional)
                    </label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="url"
                            id="coverImageUrl"
                            name="coverImageUrl"
                            value={formData.coverImageUrl}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label htmlFor="content" className="block text-lg font-semibold">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        value={formData.content}
                        onChange={handleChange}
                        rows={15}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                        placeholder="Write your blog content here... You can use markdown formatting."
                    />
                    <p className="text-sm text-gray-400">
                        Tip: You can use markdown formatting for better readability
                    </p>
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
                            Publishing...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Publish Blog
                        </>
                    )}
                </motion.button>
            </motion.form>
        </div>
    );
}
