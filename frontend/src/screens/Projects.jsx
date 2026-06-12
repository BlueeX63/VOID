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
    <PageWrapper className="min-h-screen bg-brand-light text-brand-text py-16 px-4 relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-text">
              My Projects
            </h1>
            <p className="text-brand-subtext font-medium mt-1">
              Keep track of every workspace you and your team are building.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto glass rounded-3xl p-10 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              No projects found
            </h2>
            <p className="text-brand-subtext font-medium mb-8">
              Create your first project to get started.
            </p>
            <button
              onClick={() => navigate('/mainhome')}
              className="bg-brand-blue text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md shadow-brand-blue/30"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="cursor-pointer group"
                onClick={() => { navigate(`/project/${project._id}`); }}
              >
                <AnimatedCard className="bg-white/80 border border-black/5 p-6 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-2 line-clamp-1">
                    {project.name}
                  </h3>
                  <div className="mt-6 flex items-center text-sm font-medium text-brand-subtext">
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