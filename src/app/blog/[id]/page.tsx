'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Blog {
    id: number;
    title: string;
    content: string;
    coverImageUrl?: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlog(params.id as string);
        }
    }, [params.id]);

    const fetchBlog = async (id: string) => {
        try {
            const response = await api.get(`/blogs/${id}`);
            setBlog(response.data);
        } catch (error) {
            console.error('Error fetching blog:', error);
            router.push('/blogs');
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

    if (!blog) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-4xl space-y-8 pb-20">
            {/* Back Button */}
            <Link href="/blogs">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Blogs
                </motion.button>
            </Link>

            {/* Blog Post */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                {/* Cover Image */}
                {blog.coverImageUrl && (
                    <div className="w-full h-96 overflow-hidden">
                        <img
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-8 md:p-12 space-y-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span className="font-medium">{blog.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text leading-tight">
                        {blog.title}
                    </h1>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                            Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </motion.article>

            {/* Related Blogs CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4 py-12"
            >
                <h3 className="text-2xl font-bold">Want to read more?</h3>
                <Link href="/blogs">
                    <button className="btn-primary">Explore More Blogs</button>
                </Link>
            </motion.div>
        </div>
    );
}
