import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from '../config/axios';
import PageWrapper from '../components/ui/PageWrapper';
import AnimatedCard from '../components/ui/AnimatedCard';
import MagneticButton from '../components/ui/MagneticButton';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData")) || { username: "Developer" };

  const handleCloseModal = () => {
    setisModalOpen(false);
    setProjectName('');
    setErrorMsg("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!projectName.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post('/projects/create', { name: projectName }, { withCredentials: true });
      handleCloseModal();
      navigate(`/project/${res.data.project._id}`);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Failed to create project. Check if name is unique.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    axios.get("/users/logout").then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }).catch(err => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    });
  }

  return (
    <PageWrapper className="min-h-screen bg-brand-light text-brand-text flex overflow-hidden font-sans">
      
      {/* Sidebar - Monochrome Rectangular style */}
      <aside className="w-80 bg-white border-r border-gray-200 lg:flex flex-col p-8 justify-between z-20 shrink-0 hidden">
        <div className="space-y-10">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 border border-black bg-black flex items-center justify-center rounded-none">
              <span className="text-white font-syne font-black text-sm">V</span>
            </div>
            <span className="text-lg font-syne font-black tracking-widest text-black">VOID</span>
          </div>

          {/* Profile Card Mockup */}
          <div className="flex flex-col items-center text-center p-6 bg-zinc-50 border border-black rounded-none relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-black" />
            <div className="w-20 h-20 bg-black p-1 mb-4 relative rounded-none border border-black">
              <div className="w-full h-full bg-white flex items-center justify-center text-black text-3xl font-extrabold select-none rounded-none">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-black border-2 border-white rounded-none" />
            </div>
            <h3 className="font-extrabold text-black text-base leading-tight uppercase">{userData.username}</h3>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Creator Workspace</p>
          </div>

          {/* Online Friends/Collaborators mockup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span>Sync Network</span>
              <span className="bg-black text-white px-2.5 py-0.5 text-[10px] font-black rounded-none">ACTIVE</span>
            </div>
            
            {/* Horizontal avatars list */}
            <div className="flex items-center space-x-[-8px]">
              {["Alice", "Bob", "Charlie", "David"].map((name, i) => (
                <div 
                  key={i} 
                  className={`w-9 h-9 rounded-none border border-black bg-zinc-${i === 0 ? "800" : i === 1 ? "600" : i === 2 ? "400" : "200"} text-${i < 2 ? "white" : "black"} flex items-center justify-center text-[10px] font-black uppercase cursor-pointer`}
                  title={name}
                >
                  {name.charAt(0)}
                </div>
              ))}
              <div className="w-9 h-9 rounded-none bg-white border border-black flex items-center justify-center text-black text-[10px] font-black cursor-pointer">
                +8
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <button 
          onClick={handleLogout}
          className="w-full py-3.5 border border-black hover:bg-black hover:text-white text-black text-xs uppercase tracking-widest font-bold rounded-none flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto z-10 noise-bg">
        
        {/* Top Navbar */}
        <header className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center space-x-3 w-full max-w-sm">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search workspaces..." 
                className="w-full pl-9 pr-4 py-2 border border-black rounded-none bg-white text-xs font-semibold focus:outline-none text-black placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 shrink-0 text-black">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:block">
              {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="w-9 h-9 rounded-none border border-black flex items-center justify-center text-black shadow-sm cursor-pointer relative hover:bg-black hover:text-white transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-black border border-white rounded-none" />
            </div>
          </div>
        </header>

        {/* Dash Content */}
        <main className="flex-1 p-8 sm:p-12 max-w-6xl w-full mx-auto space-y-12">
          
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-syne font-black tracking-tight text-black uppercase leading-none">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-600">
                  Your Workspace
                </span>
              </h2>
              <p className="text-zinc-500 text-xs font-semibold mt-2 uppercase tracking-widest">
                Collaborate, sync, and code inside secure environment channels.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <MagneticButton 
                onClick={() => setisModalOpen(true)}
                className="btn-mono-dark text-xs uppercase tracking-widest font-black py-3.5 px-8"
              >
                + New Project
              </MagneticButton>
              <MagneticButton 
                onClick={() => navigate("/all-projects")}
                className="border border-black text-black bg-transparent hover:bg-black hover:text-white px-8 py-3.5 text-xs uppercase tracking-widest transition-colors duration-300 rounded-none font-bold"
              >
                View Projects
              </MagneticButton>
            </div>
          </div>

          {/* Interactive Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Voice waveform mockup */}
            <AnimatedCard className="p-8 flex flex-col justify-between h-72 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-500 ease-in-out group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-none bg-zinc-100 text-black border border-black flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-black bg-zinc-100 px-2.5 py-1 rounded-none border border-black/15 group-hover:text-white group-hover:bg-zinc-900 group-hover:border-zinc-800 transition-all duration-500">
                  Ready to stream
                </span>
              </div>
              <div>
                <h3 className="text-xl font-syne font-black mb-1 group-hover:text-white uppercase transition-colors duration-500">Instant Meetings</h3>
                <p className="text-zinc-500 group-hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6 transition-colors duration-500">Launch high quality voice & audio spaces</p>
                
                {/* Audio visualizer bar mock */}
                <div className="flex items-end gap-1 h-8">
                  {[4, 8, 5, 12, 18, 14, 22, 16, 9, 14, 25, 19, 8, 15, 6, 12, 4].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [h, h * 0.4, h] }}
                      transition={{ duration: 1.2 + i * 0.05, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 bg-black group-hover:bg-white rounded-none transition-colors duration-500" 
                      style={{ height: h }}
                    />
                  ))}
                </div>
              </div>
            </AnimatedCard>

            {/* AI Capability Stats */}
            <AnimatedCard className="p-8 flex flex-col justify-between h-72 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-500 ease-in-out group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-none bg-zinc-100 text-black border border-black flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-black bg-zinc-100 px-2.5 py-1 rounded-none border border-black/15 group-hover:text-white group-hover:bg-zinc-900 group-hover:border-zinc-800 transition-all duration-500">
                  Gemini v2.5
                </span>
              </div>
              <div>
                <h3 className="text-xl font-syne font-black mb-1 group-hover:text-white uppercase transition-colors duration-500">AI Assistance Active</h3>
                <p className="text-zinc-500 group-hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4 transition-colors duration-500">Prompt inside collaborative rooms using @ai</p>
                <div className="bg-zinc-50 border border-zinc-200 group-hover:bg-zinc-950 group-hover:border-zinc-800 rounded-none p-4 font-mono text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-all duration-500">
                  <span className="text-black group-hover:text-white font-bold">@ai</span> write a clean middleware for token validation...
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Quick Stats features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            {[
              { label: "Active Chats", count: "Synced", icon: "ri-chat-3-line" },
              { label: "AI Terminals", count: "Ready", icon: "ri-terminal-box-line" },
              { label: "Cloud Workspace", count: "Online", icon: "ri-cloud-line" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-black rounded-none p-5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-base font-black text-black uppercase">{stat.count}</p>
                </div>
                <div className="w-10 h-10 rounded-none bg-zinc-50 border border-black flex items-center justify-center text-lg text-black">
                  <i className={stat.icon} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* New Project Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-black rounded-none p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-black" />
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-syne font-black text-black uppercase">New Project</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configure workspace parameters</p>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-none bg-zinc-50 border border-black hover:bg-black hover:text-white flex items-center justify-center text-black cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {errorMsg && (
                <div className="bg-transparent text-black border border-black p-4 text-xs font-syne uppercase tracking-widest mb-6 text-center rounded-none">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Project Identifier
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. PROJECT APOLLO"
                    className="w-full px-5 py-4 border border-black rounded-none bg-white text-black placeholder-zinc-300 text-sm font-semibold uppercase focus:outline-none"
                    autoFocus
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3.5 rounded-none border border-black bg-white text-black text-xs uppercase tracking-wider font-bold hover:bg-zinc-50 cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-none bg-black text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer transition-all hover:bg-zinc-800 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Home;