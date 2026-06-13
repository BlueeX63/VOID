import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/ui/PageWrapper";
import MagneticButton from "../components/ui/MagneticButton";
import Space3DCanvas from "../components/ui/Space3DCanvas";

const FirstPage = () => {
  const navigate = useNavigate();
  const [shapeIndex, setShapeIndex] = useState(0);
  
  const shapeNames = [
    { title: "THE VOID", subtitle: "INTELLIGENT SYNERGY" },
    { title: "COLLABORATE", subtitle: "REAL-TIME MATRIX" },
    { title: "INTEGRATE", subtitle: "AI SYNAPSE HELIX" },
    { title: "AMPLIFY", subtitle: "QUANTUM WORKSPACE" }
  ];

  const handleNextShape = () => {
    setShapeIndex((prev) => (prev + 1) % 4);
  };

  const handlePrevShape = () => {
    setShapeIndex((prev) => (prev - 1 + 4) % 4);
  };

  return (
    <PageWrapper className="relative min-h-screen overflow-hidden bg-black text-brand-text-dark font-sans selection:bg-white/10 selection:text-white">
      
      {/* Background visual depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft grayscale background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-900/10 blur-[150px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-zinc-800/10 blur-[180px] animate-pulse" style={{ animationDuration: "18s" }} />
      </div>

      {/* Modern Navigation Header */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* Custom crazy, sexy animated SVG logo */}
          <svg className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]" viewBox="0 0 100 100" fill="none">
            <path 
              d="M18 28 L50 82 L82 28 M34 28 L50 62 L66 28" 
              stroke="url(#mono-grad)" 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="animate-logo-path" 
            />
            <defs>
              <linearGradient id="mono-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#888888" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-syne font-black tracking-[0.35em] text-white">VOID</span>
        </motion.div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto min-h-[85vh] flex flex-col items-center justify-center px-4">
        
        {/* Giant background text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none opacity-[0.02]">
          <h1 className="text-[18vw] font-black tracking-[0.2em] text-white">VOID</h1>
        </div>

        {/* 3D Canvas Container */}
        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
          <div className="w-full h-full max-w-4xl mx-auto pointer-events-auto">
            <Space3DCanvas currentShapeIndex={shapeIndex} />
          </div>
        </div>

        {/* Hero Content Details */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-3xl pointer-events-none">
          
          {/* Animated Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center rounded-none bg-black/60 px-4 py-1.5 border border-white/15"
          >
            <span className="relative flex h-2 w-2 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-subtext-dark">
              {shapeNames[shapeIndex].subtitle}
            </span>
          </motion.div>

          {/* Morphing typography with shape index */}
          <div className="h-40 flex items-center justify-center overflow-hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.h2
                key={shapeIndex}
                initial={{ opacity: 0, y: 55, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -55, filter: "blur(12px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl font-syne font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 leading-none uppercase"
              >
                {shapeNames[shapeIndex].title}
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs sm:text-sm text-brand-subtext-dark uppercase tracking-widest max-w-lg mx-auto mb-10 font-semibold leading-relaxed"
          >
            An intelligent collaboration companion for teams who build, plan, and align in real time. Interact with the 3D entity above to begin workspace synchronization.
          </motion.p>

          {/* Magnetic CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-5 pointer-events-auto"
          >
            <MagneticButton 
              onClick={() => navigate("/register")}
              className="btn-mono font-syne font-bold px-10 py-5 text-xs tracking-widest uppercase border border-white"
            >
              Start Syncing Now
            </MagneticButton>
            <MagneticButton 
              onClick={() => navigate("/login")}
              className="font-syne font-bold border border-white/20 text-white bg-white/5 hover:bg-white/10 px-10 py-5 text-xs uppercase tracking-widest transition-colors duration-300 rounded-none"
            >
              Access Account
            </MagneticButton>
          </motion.div>
        </div>

        {/* Awwwards Navigation Controls */}
        {/* Left Shape Arrow */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
          <button
            onClick={handlePrevShape}
            className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center text-brand-subtext-dark hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Previous Shape"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Right Shape Arrow */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
          <button
            onClick={handleNextShape}
            className="w-12 h-12 rounded-none border border-white/10 flex items-center justify-center text-brand-subtext-dark hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Next Shape"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom Pagination Indicators */}
        <div className="absolute bottom-10 z-40 flex items-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setShapeIndex(idx)}
              className={`h-1 cursor-pointer transition-all duration-500 rounded-none ${shapeIndex === idx ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"}`}
              aria-label={`Morph shape ${idx}`}
            />
          ))}
        </div>
      </main>
    </PageWrapper>
  );
};

export default FirstPage;