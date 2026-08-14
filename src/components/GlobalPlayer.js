"use client";

import { useEffect, useState, useRef } from "react";
import { useMusicStore } from "@/store/useMusicStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from "lucide-react";
import Image from "next/image";
import YouTube from "react-youtube";
import { Kalam } from "next/font/google";
import { usePathname } from "next/navigation";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

const PLAYLIST_ID = "PL0CaUqi81mPlQeSCgy5wvNHLRkHV0ZkLe";

export default function GlobalPlayer() {
  const { 
    isPlaying, 
    setIsPlaying, 
    playerRef,
    setPlayerRef,
    currentVideoData, 
    setCurrentVideoData,
    mode,
    currentSongIndex,
    setCurrentSongIndex,
    playlists,
    setPlaylists,
    savedTime,
    setSavedTime
  } = useMusicStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isVolumeChanging, setIsVolumeChanging] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetch("/api/playlists")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setPlaylists(data);
          if (!useMusicStore.getState().mode) {
            const defaultPlaylist = data.find(p => p.isDefault) || data[0];
            if (defaultPlaylist) {
              useMusicStore.getState().setMode(defaultPlaylist.playlistId || defaultPlaylist.id);
            }
          }
        }
      })
      .catch(console.error);
  }, [setPlaylists]);

  // Sync player state with store
  useEffect(() => {
    if (!playerRef) return;
    
    if (isPlaying) {
      playerRef.playVideo();
    } else {
      playerRef.pauseVideo();
    }
  }, [isPlaying, playerRef]);

  // Helper to ensure we always have an 11-char ID even if user pasted a full URL
  const getExtractId = (str) => {
    if (!str) return "";
    if (str.length === 11) return str;
    const match = str.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match && match[1] ? match[1] : str;
  };

  const loadedVideoIdRef = useRef(null);

  // Control track playback manually to avoid react-youtube prop-change lag/bugs
  useEffect(() => {
    if (playerRef && playlists.length > 0) {
      const activeTracks = playlists.find(p => p.id === mode)?.tracks || [];
      const rawVideoId = activeTracks[currentSongIndex]?.videoId;
      if (rawVideoId) {
        const extractedId = getExtractId(rawVideoId);
        
        if (loadedVideoIdRef.current === extractedId) return;
        loadedVideoIdRef.current = extractedId;
        
        const currentlyPlaying = useMusicStore.getState().isPlaying;
        if (currentlyPlaying) {
          playerRef.loadVideoById(extractedId);
        } else {
          playerRef.cueVideoById(extractedId);
        }
      }
    }
  }, [currentSongIndex, mode, playerRef, playlists]);

  // Update progress and duration
  useEffect(() => {
    if (!playerRef || !isPlaying) return;

    const interval = setInterval(() => {
      try {
        const time = playerRef.getCurrentTime() || 0;
        setCurrentTime(time);
        
        // Save time to local storage every 5 seconds or so to avoid too many writes, 
        // or just rely on Zustand's throttle. Since Zustand persist writes to localStorage, 
        // writing every 500ms is a bit aggressive. Let's only write if the change is significant.
        // Actually, for simplicity and since it's a small app, we'll just write it.
        setSavedTime(time);
        
        setDuration(playerRef.getDuration() || 0);
      } catch (e) {}
    }, 1000); // 1 second interval is better for localStorage

    return () => clearInterval(interval);
  }, [playerRef, isPlaying, setSavedTime]);

  const onPlayerReady = (event) => {
    setPlayerRef(event.target);
    event.target.setVolume(100);
    updateVideoData(event.target);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
      updateVideoData(event.target);
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    } else if (event.data === 0) { // Ended
      handleNext();
    }
  };

  const updateVideoData = (player) => {
    const data = player.getVideoData();
    setCurrentVideoData({
      title: data.title || "Mast Magan Playlist",
      author: data.author || "YouTube",
      videoId: data.video_id,
    });
  };

  const currentPlaylistTracks = playlists.find(p => p.id === mode)?.tracks || [];

  const handleNext = () => {
    if (playerRef && currentPlaylistTracks.length > 0) {
      const nextIndex = (currentSongIndex + 1) % currentPlaylistTracks.length;
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (playerRef && currentPlaylistTracks.length > 0) {
      const prevIndex = (currentSongIndex - 1 + currentPlaylistTracks.length) % currentPlaylistTracks.length;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!playerRef || duration === 0) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const seekTime = percent * duration;
    playerRef.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const handleVolumeClick = (e) => {
    if (!playerRef) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newVolume = Math.max(0, Math.min(100, Math.round(percent * 100)));
    playerRef.setVolume(newVolume);
    setVolume(newVolume);
    
    setIsVolumeChanging(true);
    setTimeout(() => setIsVolumeChanging(false), 500);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Don't show the player UI on admin pages
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith("/admin")) return;
      setIsExpanded(pathname === "/");
    }
  }, [pathname]);

  if (pathname && pathname.startsWith("/admin")) return null;

  return (
    <>
      <div className="hidden">
        <YouTube
          videoId={getExtractId(currentPlaylistTracks[currentSongIndex]?.videoId || "jfKfPfyJRdk")}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              vq: 'hd1080',
              start: Math.floor(savedTime || 0),
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed bottom-8 right-8 z-[100] cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <div className="w-16 h-16 bg-[#160E0A] rounded-full flex items-center justify-center border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isPlaying ? (
                <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
              ) : (
                <Music2 size={24} className="text-[#D4AF37]" />
              )}
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <Music2 size={24} className={isPlaying ? "text-[#D4AF37] animate-pulse" : "hidden"} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ y: 150, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 150, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-6 pb-8 pointer-events-none flex flex-col items-center"
          >
            <div className="max-w-5xl w-full mx-auto bg-[#160E0A] border border-[#3C2A1E] p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-6 pointer-events-auto relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/dust.png')] before:opacity-30 before:pointer-events-none">
              
              {/* Close/Collapse Button (Only show if not on home page) */}
              {pathname !== "/" && (
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 z-50 text-white/40 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              )}
          {/* Subtle moving glow inside the player */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] mix-blend-overlay">
            <motion.div 
              animate={{ 
                x: [0, 200, 0],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 w-64 h-64 bg-[#D4AF37] rounded-full blur-[80px]"
            />
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-5 flex-1 w-full overflow-hidden z-10">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 shadow-[0_0_20px_rgba(243,229,171,0.2)] bg-black">
              {currentVideoData?.videoId ? (
                <>
                  <Image 
                    src={`https://img.youtube.com/vi/${currentVideoData.videoId}/mqdefault.jpg`} 
                    alt="Cover" 
                    fill 
                    className="object-cover scale-150" 
                  />
                  {/* Vinyl center hole */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#140C07] rounded-full border border-black/50" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Music2 size={24} className="text-white/30" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col overflow-hidden">
              <motion.h3 
                key={currentVideoData?.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[#F4EBD0] font-bold text-2xl truncate w-full tracking-wide ${kalam.className}`}
              >
                {currentVideoData?.title || "Mast Magan Playlist"}
              </motion.h3>
              <p className="text-[#8C6D23] text-xs truncate w-full uppercase tracking-[0.2em] font-bold mt-1">
                {currentVideoData?.author || "Click Play to Start"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-3 flex-1 w-full z-10">
            <div className="flex items-center gap-8">
              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} className="text-white/50 hover:text-white transition-colors">
                <SkipBack size={24} fill="currentColor" />
              </motion.button>
              
              <div className="relative">
                {/* Glowing ring behind play button */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.5, scale: 1.4 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      className="absolute inset-0 bg-[#F3E5AB] rounded-full blur-md"
                    />
                  )}
                </AnimatePresence>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative w-16 h-16 bg-gradient-to-br from-[#F3E5AB] to-[#D4AF37] rounded-full flex items-center justify-center text-[#2A1B14] shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-white/40"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </motion.button>
              </div>

              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={handleNext} className="text-white/50 hover:text-white transition-colors">
                <SkipForward size={24} fill="currentColor" />
              </motion.button>
            </div>
            
            <div className="flex items-center gap-4 w-full max-w-md group">
              <span className="text-xs text-white/40 font-mono w-10 text-right">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 h-4 flex items-center cursor-pointer"
                onClick={handleSeek}
              >
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#CC9933] to-[#F3E5AB]" 
                    style={{ width: `${progressPercent}%` }}
                    layout
                  />
                </div>
              </div>
              <span className="text-xs text-white/40 font-mono w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extras */}
          <div className="flex items-center justify-end gap-5 flex-1 w-full hidden md:flex relative z-10">
            <motion.div
              animate={{ 
                scale: isVolumeChanging ? 1.3 : 1,
                color: isVolumeChanging ? "#D4AF37" : "#F3E5AB"
              }}
              className="text-[#F3E5AB]"
            >
              <Volume2 size={20} />
            </motion.div>
            
            <div 
              className="w-24 h-4 flex items-center cursor-pointer group relative"
              onClick={handleVolumeClick}
            >
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white/50 to-white group-hover:from-[#F3E5AB] group-hover:to-white transition-colors" 
                  animate={{ width: `${volume}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 p-3 bg-white/5 border border-white/5 rounded-full transition-colors"
            >
              <Music2 size={20} className="text-[#F3E5AB]" />
            </motion.button>
          </div>
        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
