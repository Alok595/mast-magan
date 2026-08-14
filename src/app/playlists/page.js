"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Disc3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Kalam } from "next/font/google";
import { useMusicStore } from "@/store/useMusicStore";
import { useSession } from "next-auth/react";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const { playlists } = useMusicStore();

  return (
    <main className="min-h-screen bg-[#140C07] text-[#E8DCC4] pt-24 pb-48 px-6 relative overflow-hidden">
      {/* Heavy Film Grain Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}></div>
      <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply bg-[#3c2a1e]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-20 md:mb-24 mt-20 md:mt-10 relative w-full">
          <Link href="/" className="absolute -top-16 md:top-0 left-0 md:-left-4 z-50">
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#E8DCC4] text-[#140C07] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(232,220,196,0.3)] transition-colors hover:bg-white"
            >
              <ArrowLeft size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
            </motion.button>
          </Link>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#F3E5AB] flex items-center gap-4 md:gap-6 tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,1)] text-center" style={{ fontFamily: "serif" }}>
            <Disc3 size={40} className="md:w-12 md:h-12 text-[#D4AF37] animate-[spin_10s_linear_infinite] flex-shrink-0" />
            <span>Mixtapes</span>
          </h1>
          <p className={`text-xl md:text-2xl mt-4 text-[#F3E5AB]/80 text-center ${kalam.className}`}>Handpicked nostalgic vibes for the road</p>
        </div>

        {/* Playlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mt-16 px-4">
          {playlists.map((playlist, idx) => (
            <Link key={playlist._id || playlist.id} href={`/playlists/${playlist.playlistId || playlist.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? -2 : 3 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                className="relative group cursor-pointer"
              >
                {/* The Vinyl Record (Sliding out on hover) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-56 sm:h-56 bg-[#111] rounded-full shadow-2xl border-[6px] border-black flex items-center justify-center z-0 transition-all duration-500 ease-out group-hover:-translate-y-16 group-hover:rotate-180 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  {/* Vinyl grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/10" />
                  <div className="absolute inset-4 rounded-full border border-white/5" />
                  <div className="absolute inset-6 rounded-full border border-white/10" />
                  {/* Vinyl label */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] rounded-full flex items-center justify-center border-2 border-black/50 shadow-inner">
                    <div className="w-4 h-4 bg-black rounded-full" />
                  </div>
                </div>

                {/* The Vintage Sleeve (Card) */}
                <div className="relative z-10 bg-[#F4EBD0] p-4 pb-8 rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.8)] border border-[#d3c5a3] before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-50 before:pointer-events-none">
                  
                  {/* Sleeve Cutout/Art */}
                  <div className="relative w-full aspect-square overflow-hidden bg-black border-4 border-[#F4EBD0] shadow-[inset_0_0_20px_rgba(0,0,0,1)] group-hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] transition-shadow duration-500">
                    <Image 
                      src={playlist.cover}
                      alt={playlist.title}
                      fill
                      className="object-cover sepia-[0.6] contrast-125 group-hover:sepia-0 group-hover:contrast-100 transition-all duration-700"
                    />
                    
                    {/* Retro Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                      <div className="w-16 h-16 bg-[#CC3333] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(204,51,51,0.6)] border-2 border-white/80 scale-90 group-hover:scale-100 transition-transform">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mixtape Label */}
                  <div className="pt-6 px-2 text-center">
                    <div className="w-16 h-1 bg-black/20 mx-auto mb-4 rounded-full" /> {/* Tape detail */}
                    <h3 className={`text-3xl font-bold text-[#2A1B14] mb-2 ${kalam.className}`}>{playlist.title}</h3>
                    <p className={`text-[#4A3C31] text-lg leading-snug ${kalam.className}`}>{playlist.description}</p>
                    
                    {/* Retro track count tag */}
                    <div className="absolute -right-3 top-8 bg-[#CC3333] text-white text-xs font-bold px-4 py-1 rotate-4 shadow-md font-mono uppercase tracking-widest border border-black/20">
                      Side A • {playlist.tracks.length} Trks
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-black/10">
                      <div className="flex items-center gap-1.5 text-[#8C6D23] font-bold font-mono">
                        <Disc3 size={16} />
                        <span>{playlist.playCount || 0}</span>
                      </div>
                      <button 
                        onClick={async (e) => {
                          e.preventDefault(); // Stop navigation
                          if (!session) {
                            alert("Please login to like a playlist!");
                            return;
                          }
                          try {
                            const res = await fetch(`/api/playlists/${playlist.playlistId || playlist.id}/like`, { method: "POST" });
                            const data = await res.json();
                            if (data.success) {
                               // To update UI instantly, we would update the store, 
                               // but for now we can just force a reload or rely on a local state if we want.
                               // Let's just update the specific playlist in the store.
                               useMusicStore.setState(state => ({
                                 playlists: state.playlists.map(p => {
                                   if (p.id === (playlist.playlistId || playlist.id)) {
                                     return { ...p, likesCount: data.likesCount };
                                   }
                                   return p;
                                 })
                               }));
                            }
                          } catch (err) {}
                        }}
                        className="flex items-center gap-1.5 text-[#CC3333] font-bold font-mono hover:scale-110 transition-transform"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        <span>{playlist.likesCount || 0}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
