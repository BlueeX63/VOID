import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageWrapper from "../components/ui/PageWrapper";
import MagneticButton from "../components/ui/MagneticButton";

const FirstPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <PageWrapper className="relative min-h-screen overflow-hidden bg-brand-light">
      
      {/* Subtle Background Glows (iOS like gradients) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-[100px]"
        />
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold tracking-widest text-brand-text">VOID</span>
        </motion.div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto">
        <motion.div style={{ y, opacity }} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center rounded-full glass px-4 py-2"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-subtext">
              The Future of Collaboration
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black tracking-tight text-brand-text mb-6"
          >
            Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-500">
              Amplified.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-brand-subtext max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            An intelligent collaboration companion for teams who build, plan, and align in real time. Experience workspace synergy like never before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <MagneticButton 
              onClick={() => navigate("/register")}
              className="bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 border-none"
            >
              Start Creating Now
            </MagneticButton>
            <MagneticButton 
              onClick={() => navigate("/login")}
              className="text-brand-text bg-white glass border-none shadow-sm"
            >
              Access Workspace
            </MagneticButton>
          </motion.div>
        </motion.div>
      </main>

    </PageWrapper>
  );
};

export default FirstPage;