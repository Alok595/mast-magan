import { create } from "zustand";

export const useMusicStore = create((set) => ({
  mode: "cinematic", // "cinematic" | "deluxe-salon" | "night-bus"
  setMode: (mode) => set({ mode }),
  
  isPlaying: false,
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
