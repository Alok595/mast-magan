import { create } from "zustand";

export const useMusicStore = create((set) => ({
  mode: null, // Dynamically set by GlobalPlayer based on DB
  setMode: (mode) => set({ mode }),
  
  isPlaying: true,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  playerRef: null,
  setPlayerRef: (ref) => set({ playerRef: ref }),
  
  currentSongIndex: 0,
  setCurrentSongIndex: (index) => set({ currentSongIndex: index }),

  currentVideoData: null,
  setCurrentVideoData: (data) => set({ currentVideoData: data }),

  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),
}));
