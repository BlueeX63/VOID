import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/ui/PageWrapper";
import AnimatedCard from "../components/ui/AnimatedCard";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setprojects] = useState([]);
  const [loading, setloading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setloading(true);
    axios
      .get("/projects/all")
      .then((res) => {
        setprojects(res.data.projects || []);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  return (
    <PageWrapper className="min-h-screen bg-brand-light text-brand-text py-16 px-6 relative font-sans noise-bg">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft grayscale backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-zinc-100/40 rounded-none blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zinc-100/40 rounded-none blur-[100px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-none bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer active:scale-95 text-black"
              aria-label="Go Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-syne font-black tracking-tight text-black uppercase leading-none">
                My Projects
              </h1>
              <p className="text-zinc-500 font-semibold text-xs uppercase tracking-wider mt-1.5">
                Keep track of every workspace you and your team are building.
              </p>
            </div>
          </div>

          {/* Search Input Widget */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search by workspace name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-black rounded-none bg-white text-xs font-semibold focus:outline-none text-black placeholder-zinc-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto border border-black bg-white rounded-none p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-16 h-16 bg-zinc-50 text-black border border-black rounded-none flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-syne font-black text-black uppercase mb-2">
              No projects found
            </h2>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-8">
              Create your first project to get started.
            </p>
            <button
              onClick={() => navigate('/mainhome')}
              className="bg-black text-white px-8 py-3.5 rounded-none text-xs uppercase tracking-widest font-black hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95 font-syne"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto border border-black bg-white rounded-none p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-16 h-16 bg-zinc-50 text-black border border-black rounded-none flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-syne font-black text-black uppercase mb-2">
              No matches found
            </h2>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-8">
              No workspaces matched "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-black text-white px-8 py-3.5 rounded-none text-xs uppercase tracking-widest font-black hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95 font-syne"
            >
              Clear Search
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="cursor-pointer group"
                onClick={() => { navigate(`/project/${project._id}`); }}
              >
                <AnimatedCard className="bg-white border border-black p-6 hover:bg-black hover:text-white transition-all duration-500 ease-in-out group text-black">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-zinc-50 text-black border border-black rounded-none flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white group-hover:border-white transition-colors duration-500 shadow-sm">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    
                    {/* Pulsing online badge */}
                    <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-black bg-zinc-100 px-3 py-1 rounded-none border border-black/15 group-hover:text-white group-hover:bg-zinc-950 group-hover:border-zinc-800 transition-all duration-500">
                      <span className="w-1.5 h-1.5 rounded-none bg-black group-hover:bg-white animate-pulse" />
                      Active Sync
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-syne font-black text-black group-hover:text-white transition-colors duration-500 uppercase mb-2 line-clamp-1">
                    {project.name}
                  </h3>
                  
                  <div className="mt-8 pt-4 border-t border-zinc-200 group-hover:border-zinc-800 flex items-center text-xs font-semibold text-zinc-500 group-hover:text-zinc-400 uppercase tracking-widest transition-colors duration-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{project.users ? project.users.length : 0} Collaborator{project.users?.length !== 1 ? 's' : ''}</span>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Projects;