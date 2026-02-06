'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Rocket, Image as ImageIcon, Newspaper, Calendar, Zap, Users, Telescope } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

interface UnifiedImage {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  isCommunity?: boolean;
}

interface Launch {
  id: number;
  name: string;
  provider: string;
  date: string;
  status: string;
}

interface AISummary {
  id: number;
  summary: string;
  summaryDate: string;
}

export default function HomePage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [images, setImages] = useState<UnifiedImage[]>([]);
  const [todayAPOD, setTodayAPOD] = useState<UnifiedImage | null>(null);
  const [nextLaunch, setNextLaunch] = useState<Launch | null>(null);
  const [aiSummary, setAISummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchSafe = async (url: string) => {
        try {
          const res = await api.get(url);
          return res.data;
        } catch (e) {
          console.error(`Error fetching ${url}:`, e);
          return null;
        }
      };

      const [newsData, imagesData, communityData, apodData, launchesData, aiData] = await Promise.all([
        fetchSafe('/news'),
        fetchSafe('/images'),
        fetchSafe('/community-images'),
        fetchSafe('/images/apod/today'),
        fetchSafe('/launches/upcoming'),
        fetchSafe('/ai/daily-summary'),
      ]);

      setNews(Array.isArray(newsData) ? newsData.slice(0, 3) : []);

      const nasaImages = Array.isArray(imagesData)
        ? imagesData.slice(0, 3).map((img: any) => ({ ...img, isCommunity: false }))
        : [];

      const communityImages = Array.isArray(communityData)
        ? communityData.slice(0, 3).map((img: any) => ({
          id: img.id,
          title: img.title,
          imageUrl: img.imageUrl && img.imageUrl.startsWith('http')
            ? img.imageUrl
            : img.imageUrl
              ? `http://localhost:8080${img.imageUrl}`
              : '/placeholder-space.jpg',
          description: img.description || '',
          isCommunity: true
        }))
        : [];

      setImages([...nasaImages, ...communityImages]);
      setTodayAPOD(apodData || null);
      setNextLaunch(Array.isArray(launchesData) ? launchesData[0] : null);
      setAISummary(aiData || null);
    } catch (error) {
      console.error('CRITICAL: Error in fetchData loop:', error);
    } finally {
      setLoading(false);
    }
  };

  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground />

      <div className="container mx-auto space-y-32 pb-32 pt-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 py-24 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold backdrop-blur-md mb-4"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>MISSION UPDATE: EXPLORING NEW FRONTIERS</span>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl font-black gradient-text tracking-tighter"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            SPACE OPS
          </motion.h1>

          <motion.p
            className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your gateway to the cosmos. Discover stunning imagery, real-time data, and a community of pioneers.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-6 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/gallery">
              <button className="btn-primary flex items-center gap-3 px-10 py-5 text-xl">
                <ImageIcon className="w-6 h-6" />
                Gallery
              </button>
            </Link>
            <Link href="/news">
              <button className="btn-secondary flex items-center gap-3 px-10 py-5 text-xl backdrop-blur-xl">
                <Newspaper className="w-6 h-6" />
                Latest News
              </button>
            </Link>
          </motion.div>

          {/* Quick Stats Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-24 px-4"
          >
            <div className="glass-card p-6 rounded-2xl border-white/10 hover:border-blue-500/50 transition-all group">
              <Telescope className="w-8 h-8 text-blue-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-sm text-gray-400">Stars Tracked</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-white/10 hover:border-purple-500/50 transition-all group">
              <Rocket className="w-8 h-8 text-purple-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-gray-400">Launch Monitoring</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-white/10 hover:border-pink-500/50 transition-all group">
              <ImageIcon className="w-8 h-8 text-pink-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold">5k+</div>
              <div className="text-sm text-gray-400">HD Space Images</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-white/10 hover:border-cyan-500/50 transition-all group">
              <Users className="w-8 h-8 text-cyan-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold">Community</div>
              <div className="text-sm text-gray-400">Explorer Forum</div>
            </div>
          </motion.div>
        </motion.section>

        {/* AI Summary Section with improved styling */}
        {aiSummary && (
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm" />
            <div className="glass-card p-10 rounded-3xl border-white/20 bg-black/40 backdrop-blur-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-bold gradient-text-galaxy">Direct Mission Intel</h2>
              </div>
              <p className="text-2xl text-gray-300 leading-relaxed font-light italic">"{aiSummary.summary}"</p>
              <div className="mt-8 flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-6">
                <span>SpaceOps AI Terminal v4.2.0</span>
                <span>{currentDate}</span>
              </div>
            </div>
          </motion.section>
        )}

        {/* Today's APOD - Full Width Focus */}
        {todayAPOD && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-end justify-between px-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-pink-500 tracking-widest uppercase">NASA Official Feature</h3>
                <h2 className="text-5xl md:text-7xl font-black text-white">Daily Masterpiece</h2>
              </div>
              <div className="hidden md:block text-right text-gray-400 max-w-sm">
                Every day a different image or photograph of our fascinating universe is featured.
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-[2rem] border-white/10 group shadow-2xl shadow-blue-500/10">
              <div className="relative h-[80vh] overflow-hidden">
                <img
                  src={todayAPOD.imageUrl}
                  alt={todayAPOD.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-12 space-y-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight">{todayAPOD.title}</h3>
                    <p className="text-gray-300 text-xl max-w-4xl line-clamp-3 font-light leading-relaxed">
                      {todayAPOD.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* News Grid - Modern Magazine Feel */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-5xl font-black gradient-text">Cosmic Gazette</h2>
            <Link href="/news">
              <button className="group flex items-center gap-3 text-xl text-purple-400 hover:text-white transition-all">
                <span>Open Archive</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card flex flex-col h-full overflow-hidden rounded-3xl border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all group"
              >
                {article.imageUrl && (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <div className="text-sm font-bold text-purple-500 mb-4 bg-purple-500/10 w-fit px-3 py-1 rounded-lg uppercase tracking-wider">{article.source}</div>
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">{article.title}</h3>
                  <p className="text-gray-400 mb-8 line-clamp-3 flex-1 font-light leading-relaxed">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-6 border-t border-white/5">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(article.publishedAt).toLocaleDateString()}</span>
                    <Link href="/news" className="text-purple-400 font-bold hover:underline">Read Info</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Launch Status - Dynamic Dashboard Element */}
        {nextLaunch && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[2.5rem]"
          >
            <div className="bg-black/90 rounded-[2.4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-orange-500/20 flex items-center justify-center animate-pulse">
                  <Rocket className="w-12 h-12 text-orange-500" />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-sm font-bold text-orange-500 tracking-[0.3em] uppercase">T-Minus Countdown</h3>
                  <h2 className="text-4xl md:text-6xl font-black text-white">{nextLaunch.name}</h2>
                  <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start text-gray-400">
                    <span className="flex items-center gap-2"><Rocket className="w-4 h-4" /> {nextLaunch.provider}</span>
                    <span className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${nextLaunch.status.toLowerCase().includes('go') ? 'bg-green-500' : 'bg-yellow-500'}`}></div> {nextLaunch.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-4">
                <div className="text-5xl md:text-7xl font-black gradient-text-sunset">
                  {new Date(nextLaunch.date).toLocaleDateString()}
                </div>
                <Link href="/launches">
                  <button className="btn-primary flex items-center gap-2 mx-auto">
                    <Calendar className="w-5 h-5" />
                    Mission Schedule
                  </button>
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* Featured Gallery - Grid with Community Mixed In */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-5xl font-black gradient-text-galaxy">Infinite Perspectives</h2>
            <Link href="/gallery">
              <button className="group flex items-center gap-3 text-xl text-cyan-400 hover:text-white transition-all">
                <span>View Full Canvas</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative glass-card overflow-hidden rounded-3xl aspect-square group cursor-pointer border-white/10"
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6">
                  {image.isCommunity && (
                    <div className="absolute top-4 right-4 bg-pink-600 px-3 py-1 rounded-full text-[10px] font-bold">COMMUNITY</div>
                  )}
                  <h4 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-all duration-500">{image.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-12 py-32 rounded-[3.5rem] bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent border border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-6xl md:text-8xl font-black gradient-text tracking-tight">Become a Pioneer</h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed px-4">
              Our journey is powered by explorers like you. Share your discoveries, write your stories, and join the mission.
            </p>
            <div className="flex flex-wrap gap-8 justify-center pt-8">
              <Link href="/upload-image">
                <button className="btn-primary px-12 py-5 text-xl relative group overflow-hidden">
                  <span className="relative z-10">Upload Discovery</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </button>
              </Link>
              <Link href="/write-blog">
                <button className="btn-secondary px-12 py-5 text-xl backdrop-blur-3xl hover:bg-white/10 transition-all">
                  Write Journal
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
