"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Kalam } from "next/font/google";
import { Lock, Home, Disc3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
});

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="h-screen flex flex-col md:flex-row bg-[#140C07] overflow-hidden">
      
      {/* Left Side: Cinematic Studio Background (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#140C07] items-center justify-center">
        {/* Heavy Film Grain Overlay on Image */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}></div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
        
        <Image 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" 
          fill 
          className="object-cover opacity-80 sepia-[0.5]" 
          alt="Studio Background" 
          priority 
        />
        
        <div className="relative z-20 flex flex-col items-start px-16 max-w-xl text-[#F3E5AB]">
          <Link href="/" className="mb-12 flex items-center gap-2 text-[#F3E5AB]/70 hover:text-[#F3E5AB] transition-colors bg-black/40 px-4 py-2 rounded-full font-bold backdrop-blur-md border border-[#F3E5AB]/20">
            <Home size={18} />
            Back to Home
          </Link>
          
          <Disc3 size={64} className="text-[#D4AF37] mb-6 animate-[spin_15s_linear_infinite]" />
          <h1 className={`text-6xl lg:text-7xl font-bold mb-6 leading-tight ${kalam.className} drop-shadow-[0_5px_15px_rgba(0,0,0,1)]`}>
            Dhun
          </h1>
          <p className="text-[#F3E5AB]/80 text-xl font-medium max-w-sm drop-shadow-md">
            Handpicked nostalgic vibes for the road.
          </p>
        </div>
      </div>

      {/* Right Side: Vintage Login Form */}
      <div className="w-full h-full md:w-1/2 relative bg-[#F4EBD0] flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-30">
        
        <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}></div>
        
        {/* Mobile Home Button */}
        <Link href="/" className="md:hidden absolute top-6 left-6 z-30 flex items-center gap-2 text-[#2A1B14]/60 hover:text-[#2A1B14] transition-colors bg-white/20 px-4 py-2 rounded-full font-bold border border-[#2A1B14]/20 shadow-sm">
          <Home size={16} /> Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md flex flex-col items-center mt-12 md:mt-0"
        >
          <h1 className={`text-5xl font-bold text-[#2A1B14] mb-2 ${kalam.className}`}>Welcome Back</h1>
          <p className="text-[#4A3C31] text-center mb-8 font-bold">
            {isAdminMode ? "Secure access for site administrators." : "Enter your credentials to access your workspace."}
          </p>

          {!isAdminMode ? (
            <div className="w-full flex flex-col gap-4">
              <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/50 text-[#2A1B14] p-4 rounded-xl border border-black/10 focus:outline-none focus:border-[#D4AF37] font-bold shadow-inner placeholder:text-black/30"
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/50 text-[#2A1B14] p-4 rounded-xl border border-black/10 focus:outline-none focus:border-[#D4AF37] font-bold shadow-inner placeholder:text-black/30"
                />
                
                {error && <p className="text-[#CC3333] font-bold bg-[#CC3333]/10 w-full text-center py-2 rounded-lg text-sm">{error}</p>}
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#2A1B14] text-[#F3E5AB] font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] mt-2 hover:bg-black transition-colors"
                >
                  Log In
                </motion.button>
              </form>

              <div className="flex items-center gap-4 my-2 opacity-50">
                <div className="flex-1 h-[1px] bg-black"></div>
                <span className="text-xs font-bold text-black uppercase tracking-widest">or</span>
                <div className="flex-1 h-[1px] bg-black"></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
                className="w-full flex items-center justify-center gap-4 bg-white text-black p-4 rounded-xl font-bold shadow-md border border-black/10 transition-all hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Continue with Google
              </motion.button>
              
              <p className="text-sm text-center text-[#4A3C31] font-bold mt-2">
                Don't have an account? <Link href="/admin/signup" className="text-[#CC3333] hover:underline underline-offset-4">Sign up</Link>
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4 shadow-inner border border-black/50">
                <Lock size={20} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-[#2A1B14] mb-4">Admin Access</h2>
              
              {error && <p className="text-[#CC3333] mb-4 font-bold bg-[#CC3333]/10 w-full text-center py-2 rounded-lg">{error}</p>}
              
              <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-[#F3E5AB] p-4 rounded-sm border border-black/50 focus:outline-none focus:border-[#D4AF37] font-mono shadow-inner placeholder:text-white/30"
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] text-[#F3E5AB] p-4 rounded-sm border border-black/50 focus:outline-none focus:border-[#D4AF37] font-mono shadow-inner placeholder:text-white/30"
                />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-2 bg-[#CC3333] text-white p-4 rounded-xl font-bold uppercase tracking-widest shadow-[0_5px_15px_rgba(204,51,51,0.4)] hover:bg-red-600 transition-colors"
                >
                  Unlock
                </motion.button>
              </form>
            </div>
          )}

          <div className="w-full flex items-center justify-center mt-8 pt-6 border-t border-black/10">
            <button 
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setError("");
              }}
              className="text-[#4A3C31] text-sm font-bold hover:text-[#CC3333] transition-colors underline decoration-dotted underline-offset-4"
            >
              {isAdminMode ? "Return to Community Login" : "Admin Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
