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

  const handleCloseModal = () => {
    setisModalOpen(false);
    setProjectName('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('/projects/create', { name: projectName }, { withCredentials: true });
      console.log(res);
      handleCloseModal();
    } catch (err) {
      console.log(err);
    }
  }

  function showProjects() {
    navigate('/all-projects');
  }

  return (
    <PageWrapper className="min-h-screen bg-brand-light text-brand-text relative">
      
      {/* Background ambient lights */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-100 rounded-full blur-[150px]" />
      </div>

      <header className="relative z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-brand-text">VOID</h1>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between min-h-[60vh]">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-blue mb-6 shadow-sm"
              >
                Dashboard Active
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-tight text-brand-text">
                Welcome to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-indigo-500">
                  Your Workspace
                </span>
              </h2>
              <p className="text-xl text-brand-subtext max-w-lg font-medium leading-relaxed">
                Collaborate with your team and AI in real-time. Start meetings, chat, and work on projects together seamlessly.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <MagneticButton 
                onClick={() => setisModalOpen(true)}
                className="bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 border-none"
              >
                + New Project
              </MagneticButton>
              <MagneticButton 
                onClick={showProjects}
                className="bg-white text-brand-text glass border-none shadow-sm"
              >
                View Projects
              </MagneticButton>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="flex-1 w-full max-w-md perspective-1000"
          >
            <AnimatedCard className="aspect-square p-8 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-brand-blue mb-8 flex items-center justify-center shadow-lg shadow-brand-blue/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-brand-text">Instant Meetings</h3>
              <p className="text-brand-subtext text-sm mb-8 font-medium">Start a high-quality video or audio room instantly with AI assistance.</p>
              
              <div className="flex space-x-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-brand-blue" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} className="w-2 h-2 rounded-full bg-indigo-500" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} className="w-2 h-2 rounded-full bg-brand-subtext" />
              </div>
            </AnimatedCard>
          </motion.div>

        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Team Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", desc: "Real-time sync", color: "text-brand-blue", bg: "bg-blue-50" },
            { title: "AI Assistant", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", desc: "Always on help", color: "text-indigo-500", bg: "bg-indigo-50" },
            { title: "Project Sync", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", desc: "Shared workspaces", color: "text-brand-text", bg: "bg-gray-100" }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 + 0.5, duration: 0.6 }}
            >
              <AnimatedCard className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 ${feature.color}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-brand-text">{feature.title}</h3>
                <p className="text-sm text-brand-subtext font-medium">{feature.desc}</p>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue" />
              
              <h3 className="text-3xl font-black mb-2 text-brand-text">New Project</h3>
              <p className="text-brand-subtext text-sm mb-8 font-medium">Create a new collaborative space.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Project Apollo"
                    className="w-full bg-white border border-black/5 rounded-xl px-4 py-4 text-brand-text placeholder:text-brand-subtext focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all shadow-sm"
                    autoFocus
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-4 rounded-xl bg-gray-100 text-brand-text font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-xl bg-brand-blue text-white font-semibold shadow-md shadow-brand-blue/30 hover:opacity-90 transition-opacity"
                  >
                    Create
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