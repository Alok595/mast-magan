"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Music2, Clock, Disc3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMusicStore } from "@/store/useMusicStore";
import { useRouter } from "next/navigation";
import { Kalam } from "next/font/google";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

export default function PlaylistDetailClient({ playlist }) {
  const { isPlaying, setIsPlaying, playerRef, currentVideoData, setMode, setCurrentSongIndex } = useMusicStore();
  const router = useRouter();
  
  const isThisPlaylistActive = currentVideoData?.title; 
  
  const handlePlayPlaylist = () => {
    if (!playlist.tracks.length) return;
    setCurrentSongIndex(0);
    setIsPlaying(true);
    setMode(playlist.id); 
    fetch("/api/analytics/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlistId: playlist.id })
    }).catch(console.error);
    router.push("/"); 
  };

  const handlePlayTrack = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setMode(playlist.id); 
    router.push("/"); 
  };

  return (
    <main className="min-h-screen bg-[#140C07] text-[#E8DCC4] pt-24 pb-48 px-6 relative overflow-x-clip">
      {/* Heavy Film Grain Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}></div>
      <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-[#3c2a1e]" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Column: Vintage Sleeve & Info */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start mt-8 lg:sticky lg:top-24 lg:self-start z-20 lg:pb-8">
          <Link href="/playlists" className="mb-6 self-start">
            <motion.button 
              whileHover={{ x: -5 }}
              className="flex items-center gap-3 text-[#E8DCC4]/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-bold tracking-widest uppercase text-sm">Back to Playlists</span>
            </motion.button>
          </Link>

          {/* Album Cover & Vinyl Record Assembly */}
          <div className="relative w-full max-w-[280px] aspect-square mb-6">
            {/* The Vinyl Record Sticking Out */}
            <motion.div 
              initial={{ x: 0, rotate: 0 }}
              animate={{ 
                x: isPlaying ? 140 : 100, 
                rotate: isPlaying ? 360 : 0 
              }}
              transition={{ 
                x: { type: "spring", stiffness: 60 }, 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" } 
              }}
              className="absolute top-2 bottom-2 right-0 w-[95%] bg-[#111] rounded-full shadow-2xl border-[4px] border-black flex items-center justify-center z-0"
            >
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute inset-6 rounded-full border border-white/5" />
              <div className="absolute inset-10 rounded-full border border-white/10" />
              {/* Vinyl Center Label */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] rounded-full flex items-center justify-center border-2 border-black/50 shadow-inner">
                <div className="w-4 h-4 bg-black rounded-full" />
                <span className={`absolute text-black/40 text-[10px] font-bold uppercase tracking-widest rotate-90 ${kalam.className}`}>{playlist.id}</span>
              </div>
            </motion.div>

            {/* The Vintage Sleeve (Card) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-10 bg-[#F4EBD0] p-3 pb-8 rounded-sm shadow-[-10px_10px_30px_rgba(0,0,0,0.8)] border border-[#d3c5a3] before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-50 before:pointer-events-none"
            >
              <div className="relative w-full aspect-square overflow-hidden bg-black border-4 border-[#F4EBD0] shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                <Image 
                  src={playlist.cover} 
                  alt={playlist.title} 
                  fill 
                  className="object-cover sepia-[0.4] contrast-[1.15]" 
                  priority 
                />
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div className="w-24 h-1 bg-black/10 rounded-full" />
              </div>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl lg:text-6xl font-bold text-[#F3E5AB] mb-4 text-center lg:text-left drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] ${kalam.className}`} 
          >
            {playlist.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-[#E8DCC4]/70 text-xl text-center lg:text-left mb-6 ${kalam.className}`}
          >
            {playlist.description}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handlePlayPlaylist}
            className="w-full lg:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#AA8529] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#140C07] rounded-full font-black transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            {isPlaying ? "PAUSE" : "PLAY PLAYLIST"}
          </motion.button>
        </div>

        {/* Right Column: Vintage Tracklist */}
        <div className="w-full lg:w-7/12 mt-12 lg:mt-32">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 pb-4 border-b-2 border-white/5 mb-6 text-sm font-bold text-[#D4AF37]/50 uppercase tracking-widest">
            <span># Title</span>
            <Clock size={18} />
          </div>

          <div className="flex flex-col gap-2">
            {playlist.tracks.map((track, idx) => (
              <motion.div
                key={track.videoId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
                onClick={() => handlePlayTrack(idx)}
                className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 group cursor-pointer transition-all border border-transparent hover:border-white/5 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-8">
                  <span className={`text-[#D4AF37]/30 text-2xl w-8 text-right group-hover:text-[#D4AF37] transition-colors ${kalam.className}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className={`text-[#E8DCC4] text-2xl group-hover:text-[#F3E5AB] transition-colors ${kalam.className}`}>{track.title}</h4>
                    <p className="text-white/40 text-sm tracking-wide mt-1 uppercase">{track.artist}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                    <Play size={24} className="text-[#D4AF37]" fill="currentColor" />
                  </div>
                  <span className="text-white/30 text-sm font-mono w-12 text-right group-hover:text-[#D4AF37]/70 transition-colors">{track.duration}</span>
                </div>
              </motion.div>
            ))}
            
            {/* Note about real titles */}
            <div className="p-8 text-center text-[#D4AF37]/30 text-sm mt-12 border border-white/5 rounded-3xl bg-black/20 flex flex-col items-center justify-center">
              <Disc3 size={32} className="mb-4 opacity-30" />
              <p className="uppercase tracking-widest font-semibold max-w-sm">Full original track metadata syncs upon playback</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
