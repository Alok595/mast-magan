"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Kalam, Yatra_One } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Play, Heart, Trophy, ArrowLeft, Disc3 } from "lucide-react";
import { useSession } from "next-auth/react";

const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin"] });
const yatra = Yatra_One({ weight: "400", subsets: ["latin"] });

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("plays"); // 'plays' or 'likes'
  const [likeInProgress, setLikeInProgress] = useState({});

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (playlistId) => {
    if (!session) {
      alert("Please login to like a playlist!");
      return;
    }
    
    setLikeInProgress(prev => ({ ...prev, [playlistId]: true }));
    try {
      const res = await fetch(`/api/playlists/${playlistId}/like`, { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        setPlaylists(prev => prev.map(p => {
          if (p.playlistId === playlistId) {
            const hasLiked = p.likes?.includes(session.user.email);
            let newLikes = p.likes || [];
            if (hasLiked) {
              newLikes = newLikes.filter(e => e !== session.user.email);
            } else {
              newLikes = [...newLikes, session.user.email];
            }
            return { ...p, likes: newLikes, likesCount: newLikes.length };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error("Failed to like playlist", error);
    } finally {
      setLikeInProgress(prev => ({ ...prev, [playlistId]: false }));
    }
  };

  const sortedPlaylists = [...playlists].sort((a, b) => {
    if (activeTab === "plays") {
      return (b.playCount || 0) - (a.playCount || 0);
    } else {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
  });

  return (
    <div className="min-h-screen bg-[#140C07] text-white flex flex-col items-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* Header Navigation */}
      <div className="w-full max-w-5xl p-6 z-10 flex justify-between items-center mt-4">
        <Link href="/">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors cursor-pointer">
            <ArrowLeft size={24} />
            <span className={`font-bold text-xl uppercase tracking-widest ${kalam.className}`}>Back to Home</span>
          </motion.div>
        </Link>
      </div>

      <div className="w-full max-w-5xl px-4 flex flex-col items-center z-10 mt-8 pb-32">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center mb-12">
          <Trophy size={48} className="text-[#D4AF37] mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
          <h1 className={`text-5xl md:text-7xl font-black text-[#F3E5AB] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] tracking-tight ${yatra.className}`}>
            Hall of Fame
          </h1>
          <p className={`text-[#D4AF37]/80 text-xl md:text-2xl mt-4 ${kalam.className}`}>Top Community Mixtapes</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab("plays")}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${activeTab === "plays" ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "text-white/50 hover:text-white"}`}
          >
            Most Played
          </button>
          <button 
            onClick={() => setActiveTab("likes")}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${activeTab === "likes" ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "text-white/50 hover:text-white"}`}
          >
            Most Liked
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {isLoading ? (
            <div className="text-center text-white/50 mt-10">Loading tapes...</div>
          ) : sortedPlaylists.length === 0 ? (
            <div className="text-center text-white/50 mt-10">No custom mixtapes found yet. Be the first to create one!</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {sortedPlaylists.map((playlist, index) => {
                const hasLiked = session && playlist.likes?.includes(session.user.email);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={playlist._id}
                    className="group relative flex items-center gap-4 bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {/* Rank */}
                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-2xl ${index === 0 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" : index === 1 ? "text-gray-300" : index === 2 ? "text-amber-600" : "text-white/30"}`}>
                      #{index + 1}
                    </div>

                    {/* Cover */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                      <Image src={playlist.cover} alt={playlist.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/?play=${playlist.playlistId}`}>
                          <Play size={24} className="text-white drop-shadow-md" fill="white" />
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white truncate">{playlist.title}</h3>
                      <p className="text-sm text-white/50 truncate flex items-center gap-1">
                        By {playlist.ownerEmail?.split('@')[0] || "Unknown"}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-white/40 uppercase tracking-wider mb-1 font-bold">Plays</span>
                        <div className="flex items-center gap-1 text-white/80 font-mono">
                          <Disc3 size={14} className="text-white/40" />
                          {playlist.playCount || 0}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs text-white/40 uppercase tracking-wider mb-1 font-bold">Likes</span>
                        <button 
                          onClick={() => handleLike(playlist.playlistId)}
                          disabled={likeInProgress[playlist.playlistId]}
                          className="flex items-center gap-1 font-mono transition-transform active:scale-90"
                        >
                          <Heart 
                            size={16} 
                            className={`transition-colors ${hasLiked ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-white/40 hover:text-red-400"}`} 
                          />
                          <span className={hasLiked ? "text-red-400" : "text-white/80"}>
                            {playlist.likesCount || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
