'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';

interface NewsArticle {
    id: number;
    title: string;
    summary: string;
    imageUrl: string;
    url: string;
    source: string;
    publishedAt: string;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await api.get('/news');
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
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
                <h1 className="text-5xl md:text-7xl font-bold gradient-text">Space News</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Stay updated with the latest news from space agencies and missions worldwide
                </p>
            </motion.div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                    <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card overflow-hidden rounded-xl group"
                    >
                        {article.imageUrl && (
                            <div className="image-zoom">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-56 object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6 space-y-4">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{article.source}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                                {article.title}
                            </h2>

                            {/* Summary */}
                            <p className="text-gray-300 line-clamp-3">{article.summary}</p>

                            {/* Read More Link */}
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                            >
                                Read Full Article <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Empty State */}
            {news.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-400">No news articles available yet.</p>
                </div>
            )}
        </div>
    );
}
