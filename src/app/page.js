"use client";

import { useState, useEffect } from "react";
import { useMusicStore } from "@/store/useMusicStore";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Yatra_One, Kalam } from "next/font/google";
import LiveStatus from "@/components/LiveStatus";

const yatra = Yatra_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
});

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

const backgrounds = {
  "cinematic": "/Man_listening_to_music_outdoors_202608131857.mp4",
  "deluxe-salon": "https://images.unsplash.com/photo-1521590832167-7bfc17484d20?q=80&w=2070&auto=format&fit=crop",
  "night-bus": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
};

export default function Home() {
  const { mode, playlists } = useMusicStore();
  const [hasTrackedVisit, setHasTrackedVisit] = useState(false);
  
  const activePlaylist = playlists.find(p => p.id === mode || p.playlistId === mode);
  const bgMedia = activePlaylist?.backgroundMedia || backgrounds[mode] || backgrounds["cinematic"];

  useEffect(() => {
    if (!hasTrackedVisit) {
      fetch("/api/analytics/visit", { method: "POST" }).catch(console.error);
      setHasTrackedVisit(true);
    }
  }, [hasTrackedVisit]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#140C07]">
      
      {/* Heavy Film Grain & Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}></div>
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

      {/* Header Container */}
      <div className="absolute top-0 w-full p-4 sm:p-6 md:p-10 z-30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Retro VHS HUD Elements */}
        <div className="flex items-center text-[#CC3333] font-mono text-sm sm:text-lg md:text-xl tracking-widest font-bold opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(204,51,51,0.8)]">
          <LiveStatus />
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-wrap">
          <Link href="/playlists">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 md:gap-3 bg-[#F4EBD0] text-[#140C07] px-4 md:px-6 py-2 md:py-3 rounded-sm shadow-[5px_5px_15px_rgba(0,0,0,0.5)] border border-[#d3c5a3] cursor-pointer group relative before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-50 before:pointer-events-none overflow-hidden"
            >
              <Disc3 size={18} className="md:w-6 md:h-6 group-hover:animate-spin" />
              <span className={`font-bold text-sm md:text-xl uppercase tracking-widest ${kalam.className}`}>Mixtapes</span>
              
              <div className="absolute top-0 right-0 w-2 md:w-4 h-full bg-[#CC3333] opacity-80"></div>
            </motion.div>
          </Link>

          <Link href="/admin">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 md:gap-3 bg-[#1A1A1A] text-[#D4AF37] px-4 md:px-6 py-2 md:py-3 rounded-sm shadow-[5px_5px_15px_rgba(0,0,0,0.8)] border border-[#D4AF37]/50 cursor-pointer group relative overflow-hidden"
            >
              <span className={`font-bold text-sm md:text-xl uppercase tracking-widest ${kalam.className}`}>Creator Studio</span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Background Image/Video with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {bgMedia.endsWith('.mp4') ? (
            <video 
              src={bgMedia} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover absolute inset-0 sepia-[0.4] contrast-[1.15]"
            />
          ) : (
            <Image
              src={bgMedia}
              alt={`${mode} background`}
              fill
              className="object-cover sepia-[0.4] contrast-[1.15]"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-6xl px-4 md:px-6 flex flex-col items-center flex-1 pt-48 sm:pt-32 pb-48 md:pb-32 justify-center mt-12 md:mt-0">
        <motion.div 
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center mb-8 relative"
        >
          {/* Main Title: Mast Magan with Glow Animation */}
          <motion.div
            animate={{ 
              textShadow: [
                "0 0 20px rgba(243, 229, 171, 0.4)",
                "0 0 60px rgba(243, 229, 171, 0.8)",
                "0 0 20px rgba(243, 229, 171, 0.4)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 
              className={`text-7xl md:text-9xl font-black text-[#F3E5AB] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-6 tracking-tight ${yatra.className}`} 
            >
              मस्त मगन
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <div className="h-[2px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <p className={`text-[#F3E5AB]/90 text-2xl md:text-3xl font-bold ${kalam.className}`}>
              Handpicked Nostalgic Vibes
            </p>
            <div className="h-[2px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
        </motion.div>
      </div>

    </main>
  );
}
