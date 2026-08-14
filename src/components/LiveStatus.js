"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveStatus() {
  const [listeners, setListeners] = useState(50);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set date immediately on client side to avoid hydration mismatch
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).toUpperCase();
    setCurrentDate(formattedDate);
    
    // Heartbeat logic
    const clientId = Math.random().toString(36).substring(2, 15);
    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId })
        });
        const data = await res.json();
        if (data.listeners) setListeners(data.listeners);
      } catch (e) {}
    };
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 5000);
    return () => clearInterval(heartbeatInterval);
  }, []);

  return (
    <div className="z-50 flex flex-col gap-2 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-sm border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_5px_rgba(74,222,128,1)]"></span>
        </div>
        <span className="text-green-400 font-mono text-lg tracking-widest font-bold drop-shadow-md flex gap-2 items-center whitespace-nowrap">
          {listeners} <span className="text-white/80">ONLINE</span>
        </span>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="px-4"
      >
        <span className="text-white/60 font-mono text-sm tracking-[0.3em] drop-shadow-md whitespace-nowrap">
          {currentDate || "SYNCING..."}
        </span>
      </motion.div>
    </div>
  );
}
