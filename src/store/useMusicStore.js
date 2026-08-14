import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMusicStore = create(
  persist(
    (set) => ({
      mode: null, // Dynamically set by GlobalPlayer based on DB
      setMode: (mode) => set({ mode }),
      
      isPlaying: false, // Default to false on reload to prevent unexpected audio
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      playerRef: null,
      setPlayerRef: (ref) => set({ playerRef: ref }),
      
      currentSongIndex: 0,
      setCurrentSongIndex: (index) => set({ currentSongIndex: index }),

      currentVideoData: null,
      setCurrentVideoData: (data) => set({ currentVideoData: data }),

      savedTime: 0,
      setSavedTime: (time) => set({ savedTime: time }),

      playlists: [],
      setPlaylists: (playlists) => set({ playlists }),
    }),
    {
      name: "music-player-storage",
      partialize: (state) => ({
        mode: state.mode,
        currentSongIndex: state.currentSongIndex,
        currentVideoData: state.currentVideoData,
        savedTime: state.savedTime,
      }),
    }
  )
);
