"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Kalam } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Trash2, Plus, Disc3, Activity, LayoutDashboard, Settings, Music, Wand2, Edit2, Users, ChevronDown, ChevronUp, Play, X, Home, Star } from "lucide-react";
import { useMusicStore } from "@/store/useMusicStore";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

const PlaylistCard = ({ pl, idx, handleEdit, handleDelete, handleSetDefault, isAdmin, kalam }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, rotate: -2 }}
    animate={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? -2 : 3 }}
    transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
    className={`relative group cursor-pointer mt-12 ${pl.isDefault ? 'ring-4 ring-[#D4AF37] ring-offset-4 ring-offset-[#140C07] rounded-sm' : ''}`}
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
    <div className="relative z-10 bg-[#F4EBD0] p-4 pb-4 rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.8)] border border-[#d3c5a3] before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] before:opacity-50 before:pointer-events-none flex flex-col h-full justify-between">
      
      <div>
        {/* Sleeve Cutout/Art */}
        <div className="relative w-full aspect-square overflow-hidden bg-black border-4 border-[#F4EBD0] shadow-[inset_0_0_20px_rgba(0,0,0,1)] group-hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] transition-shadow duration-500">
          <Image 
            src={pl.cover}
            alt={pl.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover sepia-[0.6] contrast-125 group-hover:sepia-0 group-hover:contrast-100 transition-all duration-700"
          />
          
          <Link href={`/playlists/${pl.playlistId || pl.id}`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div className="w-16 h-16 bg-[#CC3333] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(204,51,51,0.6)] border-2 border-white/80 scale-90 group-hover:scale-100 transition-transform hover:bg-red-600">
                <Play size={28} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </Link>
        </div>
        
        {/* Mixtape Label */}
        <div className="pt-6 px-2 text-center">
          <div className="w-16 h-1 bg-black/20 mx-auto mb-4 rounded-full" />
          <h3 className={`text-3xl font-bold text-[#2A1B14] mb-1 ${kalam.className}`}>{pl.title}</h3>
          
          {/* Retro track count tag */}
          <div className="absolute -right-3 top-8 bg-[#CC3333] text-white text-xs font-bold px-4 py-1 rotate-4 shadow-md font-mono uppercase tracking-widest border border-black/20">
            Side A • {pl.tracks?.length || 0} Trks
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="relative z-20 flex flex-wrap justify-center gap-2 mt-6 pt-4 border-t border-black/10">
        <button 
          onClick={(e) => { e.preventDefault(); handleEdit(pl); }}
          className="bg-[#140C07] hover:bg-[#D4AF37] text-[#E8DCC4] hover:text-black text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-full transition-colors flex items-center gap-1 shadow-md"
        >
          <Edit2 size={12} /> Edit
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); handleDelete(pl._id); }}
          className="bg-red-100 hover:bg-[#CC3333] text-red-600 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-full transition-colors flex items-center gap-1 shadow-md"
        >
          <Trash2 size={12} /> Delete
        </button>
        {isAdmin && (
          <button 
            onClick={(e) => { e.preventDefault(); handleSetDefault(pl._id); }}
            className={`${pl.isDefault ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-600 hover:bg-[#D4AF37] hover:text-black'} text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-full transition-colors flex items-center gap-1 shadow-md`}
          >
            <Star size={12} fill={pl.isDefault ? "currentColor" : "none"} /> 
            {pl.isDefault ? "Default" : "Set Default"}
          </button>
        )}
      </div>

    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { playlists, setPlaylists } = useMusicStore();
  const isAdmin = session?.user?.role === "admin";
  const userEmail = session?.user?.email;

  const [activeTab, setActiveTab] = useState("mixtapes");
  
  useEffect(() => {
    if (isAdmin && activeTab === "mixtapes" && !sessionStorage.getItem('tabSet')) {
      setActiveTab("mixtapes");
      sessionStorage.setItem('tabSet', 'true');
    }
  }, [isAdmin, activeTab]);

  const [stats, setStats] = useState({ siteVisits: 0, playlists: [], users: [] });
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [expandedUsers, setExpandedUsers] = useState({});
  const toggleUser = (email) => {
    setExpandedUsers(prev => ({ ...prev, [email]: !prev[email] }));
  };
  
  const defaultPlaylist = {
    playlistId: "",
    title: "",
    description: "",
    cover: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop",
    backgroundMedia: "",
    tracks: [{ title: "", artist: "", videoId: "", duration: "" }]
  };
  
  const [newPlaylist, setNewPlaylist] = useState(defaultPlaylist);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setStats({
        siteVisits: data.siteVisits || 0,
        playlists: Array.isArray(data.playlists) ? data.playlists : [],
        users: Array.isArray(data.users) ? data.users : []
      });
      
      const plRes = await fetch("/api/playlists");
      const plData = await plRes.json();
      if(Array.isArray(plData)) setPlaylists(plData);
      
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this mixtape?")) {
      await fetch(`/api/playlists/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const handleSetDefault = async (dbId) => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`/api/playlists/${encodeURIComponent(dbId)}/default`, { method: "POST" });
      if (res.ok) {
        fetchData();
      } else {
        console.error("Failed to set default playlist.");
      }
    } catch (e) {
      console.error("Error setting default playlist:", e);
    }
  };

  const handleAddTrack = () => {
    setNewPlaylist({
      ...newPlaylist,
      tracks: [...newPlaylist.tracks, { title: "", artist: "", videoId: "", duration: "" }]
    });
  };

  const handleRemoveTrack = (index) => {
    const updatedTracks = [...newPlaylist.tracks];
    updatedTracks.splice(index, 1);
    setNewPlaylist({ ...newPlaylist, tracks: updatedTracks });
  };

  const handleTrackChange = (index, field, value) => {
    const updatedTracks = [...newPlaylist.tracks];
    updatedTracks[index][field] = value;
    setNewPlaylist({ ...newPlaylist, tracks: updatedTracks });
  };

  const handleAutoFetch = async (index, providedVideoId) => {
    const track = newPlaylist.tracks[index];
    let videoId = providedVideoId || track.videoId;
    if (!videoId) return;

    const urlRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = videoId.match(urlRegex);
    let extractedId = videoId;
    if (match && match[1]) {
      extractedId = match[1];
    }

    handleTrackChange(index, 'title', 'Loading...');
    handleTrackChange(index, 'videoId', extractedId);
    
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${extractedId}`)}`);
      if (res.ok) {
        const data = await res.json();
        const updatedTracks = [...newPlaylist.tracks];
        updatedTracks[index].title = data.title || "";
        updatedTracks[index].artist = data.author || "";
        updatedTracks[index].videoId = extractedId;
        if (data.duration) {
          updatedTracks[index].duration = data.duration;
        } else if (!updatedTracks[index].duration) {
          updatedTracks[index].duration = "3:00";
        }
        setNewPlaylist({ ...newPlaylist, tracks: updatedTracks });
      } else {
        handleTrackChange(index, 'title', 'Failed to fetch');
      }
    } catch (error) {
      handleTrackChange(index, 'title', 'Error');
    }
  };

  const handleEdit = (pl) => {
    const fullPlaylist = playlists.find(p => p._id === pl._id);
    if (!fullPlaylist) return;
    
    setIsEditing(true);
    setEditingId(fullPlaylist._id);
    setNewPlaylist({
      playlistId: fullPlaylist.playlistId || fullPlaylist.id,
      title: fullPlaylist.title,
      description: fullPlaylist.description,
      cover: fullPlaylist.cover,
      backgroundMedia: fullPlaylist.backgroundMedia || "",
      tracks: fullPlaylist.tracks?.length > 0 ? fullPlaylist.tracks : defaultPlaylist.tracks
    });
    setShowAddModal(true);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importUrl) return;
    setImportLoading(true);
    try {
      const res = await fetch(`/api/youtube/playlist?url=${encodeURIComponent(importUrl)}`);
      if (!res.ok) {
        const err = await res.json();
        alert(`Import failed: ${err.error}`);
      } else {
        const data = await res.json();
        const randomId = "imported-" + Math.random().toString(36).substring(2, 9);
        setNewPlaylist({
          playlistId: randomId,
          title: data.title || "Imported Playlist",
          description: data.description || "Imported from YouTube",
          cover: data.cover || defaultPlaylist.cover,
          backgroundMedia: data.backgroundMedia || "",
          tracks: data.tracks || []
        });
        setShowImportForm(false);
        setImportUrl("");
        setShowAddModal(true);
        setIsEditing(false);
      }
    } catch (error) {
      alert("Error importing playlist");
    }
    setImportLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary keys are missing in .env.local!");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Upload failed");
      }

      const data = await res.json();
      setNewPlaylist({ ...newPlaylist, backgroundMedia: data.secure_url });
    } catch (error) {
      console.error(error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEditing ? `/api/playlists/${editingId}` : "/api/playlists";
    const method = isEditing ? "PUT" : "POST";

    const validTracks = newPlaylist.tracks.filter(t => t.title && t.videoId);
    
    const payload = {
      ...newPlaylist,
      ownerEmail: userEmail,
      tracks: validTracks,
      cover: newPlaylist.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      alert(`Error saving playlist: ${errorData.error}`);
      return;
    }
    
    setNewPlaylist(defaultPlaylist);
    setShowAddModal(false);
    setIsEditing(false);
    setEditingId(null);
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 text-sm tracking-widest uppercase">Initializing Studio...</div>;

  const topPlaylist = stats.playlists.length > 0 ? stats.playlists[0] : null;

  return (
    <main className="min-h-screen bg-[#050505] text-[#E8DCC4] flex flex-col relative overflow-hidden font-sans">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <Image src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" fill className="object-cover opacity-[0.15]" alt="Studio Background" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#050505]/50" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full pt-16 pb-8 md:px-12 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <Disc3 size={24} className="text-[#D4AF37] animate-[spin_10s_linear_infinite]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tight ${kalam.className}`}>
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">Mast Magan</span>{" "}
            <span className="bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8C6D23] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Studio</span>
          </h1>
          <p className="mt-4 text-[#F3E5AB]/60 text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] md:tracking-[0.6em] font-bold">
            {isAdmin ? "Global Admin Workspace" : "Personal Creator Workspace"}
          </p>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 relative z-10 overflow-y-auto px-8 md:px-12 pb-48">
        <AnimatePresence mode="wait">
          
          {/* MIXTAPES TAB */}
          {activeTab === "mixtapes" && (
            <motion.div 
              key="mixtapes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-10 mt-4 max-w-7xl mx-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Your Collection</h3>
                  <p className="text-white/40 text-sm">Curate and manage your beautiful mixtapes.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowImportForm(!showImportForm)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-4 rounded-full transition-all border border-white/10 backdrop-blur-md"
                  >
                    <Disc3 size={18} strokeWidth={2} /> IMPORT YOUTUBE
                  </button>
                  <button 
                    onClick={() => {
                      setNewPlaylist(defaultPlaylist);
                      setIsEditing(false);
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-black px-6 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <Plus size={18} strokeWidth={3} /> NEW MIXTAPE
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showImportForm && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                  >
                    <h4 className="text-xl font-bold text-white mb-6">Import YouTube Playlist</h4>
                    <form onSubmit={handleImport} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <input type="text" placeholder="https://www.youtube.com/playlist?list=..." required value={importUrl} onChange={e => setImportUrl(e.target.value)} className="bg-black/50 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl w-full" />
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" disabled={importLoading} className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-full transition-colors disabled:opacity-50">
                          {importLoading ? "Fetching..." : "Fetch Playlist"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {isAdmin ? (
                <>
                  <h3 className="text-2xl font-bold text-white/50 tracking-widest uppercase text-sm mt-8">Official Releases</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 mt-12 mb-16">
                    {stats.playlists.filter(p => p.ownerEmail === "admin@mastmagan.com").map((pl, idx) => (
                      <PlaylistCard key={pl._id} pl={pl} idx={idx} handleEdit={handleEdit} handleDelete={handleDelete} handleSetDefault={handleSetDefault} isAdmin={isAdmin} kalam={kalam} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 mt-12 mb-16">
                  {stats.playlists.filter(p => p.ownerEmail === userEmail).map((pl, idx) => (
                    <PlaylistCard key={pl._id} pl={pl} idx={idx} handleEdit={handleEdit} handleDelete={handleDelete} handleSetDefault={handleSetDefault} isAdmin={isAdmin} kalam={kalam} />
                  ))}
                  {stats.playlists.filter(p => p.ownerEmail === userEmail).length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-white/30 text-lg">Your shelf is empty. Create a mixtape to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && isAdmin && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <Activity size={32} />
                </div>
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-bold mb-2">Total Site Visits</p>
                  <h2 className="text-7xl font-black text-white">{stats.siteVisits.toLocaleString()}</h2>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                  <Disc3 size={32} />
                </div>
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-bold mb-2">Top Playlist</p>
                  <h2 className={`text-4xl font-bold text-white leading-tight ${kalam.className}`}>
                    {topPlaylist ? topPlaylist.title : "N/A"}
                  </h2>
                  <p className="text-[#D4AF37] font-bold mt-2">{topPlaylist?.playCount || 0} PLAYS</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && isAdmin && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto mt-10 flex flex-col gap-8"
            >
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <h3 className="text-3xl font-bold text-white mb-2">Community Creators</h3>
                <p className="text-white/40 text-sm">Playlists curated by the public.</p>
              </div>
              
              {(stats.users && stats.users.length > 0) ? stats.users.filter(u => u.email !== "admin@mastmagan.com").map(user => (
                <div key={user.email} className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleUser(user.email)}>
                    <div className="flex items-center gap-6">
                      {user.image ? (
                        <img src={user.image} alt="User" className="w-16 h-16 rounded-full border-2 border-white/20" />
                      ) : (
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white">
                          <Users size={24} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-2xl font-bold text-white">{user.name || "Unknown User"}</h4>
                        <p className="text-white/40 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-white/30 group-hover:text-white transition-colors p-4">
                      {expandedUsers[user.email] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedUsers[user.email] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10 pt-16 pb-8"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
                          {stats.playlists.filter(p => p.ownerEmail === user.email).map((pl, idx) => (
                            <PlaylistCard key={pl._id} pl={pl} idx={idx} handleEdit={handleEdit} handleDelete={handleDelete} kalam={kalam} />
                          ))}
                          {stats.playlists.filter(p => p.ownerEmail === user.email).length === 0 && (
                            <p className="text-white/30 italic col-span-full">No mixtapes created yet.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )) : (
                <div className="text-center py-20 text-white/30">No community data available.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Floating Glass Dock Navigation */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-md sm:max-w-none">
        <nav className="flex items-center justify-around sm:justify-center gap-1 sm:gap-2 bg-black/60 backdrop-blur-3xl border border-white/10 p-2 sm:p-3 rounded-full shadow-2xl overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("mixtapes")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === "mixtapes" ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Music size={18} /> <span className="hidden md:inline">Studio</span>
          </button>
          
          {isAdmin && (
            <>
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                  activeTab === "overview" ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard size={18} /> <span className="hidden md:inline">Overview</span>
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                  activeTab === "users" ? "bg-white text-black" : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Users size={18} /> <span className="hidden md:inline">Community</span>
              </button>
            </>
          )}

          <div className="w-px h-8 bg-white/20 mx-2" />
          
          <Link 
            href="/"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-white/50 hover:bg-white hover:text-black transition-all"
            title="Home"
          >
            <Home size={18} />
          </Link>
          
          <button 
            onClick={() => signOut()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-white/50 hover:bg-red-500 hover:text-white transition-all"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </nav>
      </div>

      {/* Modal Overlay for Add/Edit Playlist */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-5 md:p-8 border-b border-white/5">
                <h2 className="text-xl md:text-2xl font-bold text-white">{isEditing ? "Edit Mixtape" : "Craft New Mixtape"}</h2>
                <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
                <form id="mixtape-form" onSubmit={handleSave} className="flex flex-col gap-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Internal URL ID</label>
                      <input type="text" placeholder="e.g. lofi-beats" required value={newPlaylist.playlistId} onChange={e => setNewPlaylist({...newPlaylist, playlistId: e.target.value})} className="bg-white/5 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl transition-colors font-mono text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Display Title</label>
                      <input type="text" placeholder="Title" required value={newPlaylist.title} onChange={e => setNewPlaylist({...newPlaylist, title: e.target.value})} className="bg-white/5 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Description</label>
                      <input type="text" placeholder="Short description..." required value={newPlaylist.description} onChange={e => setNewPlaylist({...newPlaylist, description: e.target.value})} className="bg-white/5 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Cover Image URL</label>
                      <input type="text" placeholder="https://..." value={newPlaylist.cover} onChange={e => setNewPlaylist({...newPlaylist, cover: e.target.value})} className="bg-white/5 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Cinematic Background (URL or File)</label>
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <input type="text" placeholder="https://...mp4 or image url" value={newPlaylist.backgroundMedia} onChange={e => setNewPlaylist({...newPlaylist, backgroundMedia: e.target.value})} className="bg-white/5 border border-white/10 focus:border-white outline-none p-4 text-white rounded-2xl transition-colors flex-1" />
                        <label className={`flex items-center justify-center whitespace-nowrap cursor-pointer bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {uploading ? "UPLOADING..." : "UPLOAD FILE"}
                          <input type="file" accept="video/mp4,image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tracks Manager */}
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Tracklist ({newPlaylist.tracks.length})</h3>
                      <button type="button" onClick={handleAddTrack} className="text-xs bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <Plus size={14} /> ADD TRACK
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {newPlaylist.tracks.map((track, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl relative group items-center">
                          <div className="w-8 flex justify-center text-white/20 font-mono text-sm">{index + 1}</div>
                          <input type="text" placeholder="Title" value={track.title} onChange={e => handleTrackChange(index, 'title', e.target.value)} className="bg-white/5 border border-white/5 focus:border-white outline-none px-4 py-3 text-white rounded-xl text-sm flex-1 w-full md:w-auto" />
                          <input type="text" placeholder="Artist" value={track.artist} onChange={e => handleTrackChange(index, 'artist', e.target.value)} className="bg-white/5 border border-white/5 focus:border-white outline-none px-4 py-3 text-white rounded-xl text-sm flex-1 w-full md:w-auto" />
                          <div className="relative flex items-center flex-1 w-full md:w-auto">
                            <input 
                              type="text" 
                              placeholder="YouTube ID/URL" 
                              value={track.videoId} 
                              onChange={e => {
                                const val = e.target.value;
                                handleTrackChange(index, 'videoId', val);
                                const urlRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                                if (urlRegex.test(val)) { handleAutoFetch(index, val); }
                              }} 
                              className="bg-white/5 border border-white/5 focus:border-white outline-none px-4 py-3 text-white rounded-xl text-sm font-mono w-full pr-10" 
                            />
                            <button type="button" onClick={() => handleAutoFetch(index)} className="absolute right-3 text-white/40 hover:text-white transition-colors" title="Auto-Fetch Metadata">
                              <Wand2 size={16} />
                            </button>
                          </div>
                          <input type="text" placeholder="3:45" required value={track.duration} onChange={e => handleTrackChange(index, 'duration', e.target.value)} className="bg-white/5 border border-white/5 focus:border-white outline-none px-4 py-3 text-white rounded-xl text-sm font-mono w-full md:w-24 text-center" />
                          
                          {newPlaylist.tracks.length > 1 && (
                            <button type="button" onClick={() => handleRemoveTrack(index)} className="text-white/20 hover:text-red-500 transition-colors p-2">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-5 md:p-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-end gap-4 bg-black/40 backdrop-blur-md">
                <button type="button" onClick={() => setShowAddModal(false)} className="w-full md:w-auto px-8 py-4 rounded-full text-white font-bold hover:bg-white/10 transition-colors border border-white/10 md:border-none">
                  CANCEL
                </button>
                <button type="submit" form="mixtape-form" className="w-full md:w-auto bg-white text-black font-black px-12 py-4 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {isEditing ? "UPDATE MIXTAPE" : "CREATE MIXTAPE"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
