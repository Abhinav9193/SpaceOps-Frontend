'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    content: string;
    coverImageUrl?: string;
    authorName: string;
    createdAt: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
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
                <h1 className="text-5xl md:text-7xl font-bold gradient-text-nebula">Space Blogs</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Read stories, insights, and discoveries from our community
                </p>
                <Link href="/write-blog">
                    <button className="btn-primary mt-4">Write Your Own Blog</button>
                </Link>
            </motion.div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                    <motion.article
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card overflow-hidden rounded-xl group"
                    >
                        {blog.coverImageUrl && (
                            <div className="image-zoom">
                                <img
                                    src={blog.coverImageUrl}
                                    alt={blog.title}
                                    className="w-full h-56 object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6 space-y-4">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{blog.authorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                                {blog.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-300 line-clamp-3">
                                {blog.content.substring(0, 150)}...
                            </p>

                            {/* Read More */}
                            <Link href={`/blog/${blog.id}`}>
                                <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                                    Read More <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Empty State */}
            {blogs.length === 0 && !loading && (
                <div className="text-center py-20 space-y-4">
                    <p className="text-xl text-gray-400">No blogs yet. Be the first to write one!</p>
                    <Link href="/write-blog">
                        <button className="btn-primary">Write a Blog</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
