import React, { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";
import axios from "../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  initializeSocket,
  recieveMessage,
  removeMessage,
  disconnectSocket,
  sendMessage,
} from "../config/socket.js";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";

const Project = () => {
  const messageBox = useRef();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [usersInProject, setusersInProject] = useState([]);
  const [isSidePanelOpen, setisSidePanelOpen] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setselectedUsers] = useState([]);
  const [message, setmessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }

  function handleChange(userId) {
    setselectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .put(`/projects/add-user`, { users: selectedUsers, projectId })
      .then((res) => {
        setisModalOpen(false);
      })
      .catch((err) => {
        console.error("Error adding users:", err);
      });
  }

  function send() {
    if (!message.trim()) return;
    const outgoing = { message, sender: userData };
    sendMessage("project-message", outgoing);
    setMessages((prev) => [...prev, outgoing]);
    setmessage("");
    setTimeout(scrollToBottom, 100);
  }

  useEffect(() => {
    axios.get("/users/all").then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  useEffect(() => {
    axios.get(`/projects/get-project/${projectId}`).then((res) => {
      setusersInProject(res.data.project.users);
      if (res.data.project.messages) {
        setMessages(res.data.project.messages);
      }
    });

    initializeSocket(projectId);
    
    const handleProjectMessage = (data) => {
      if (typeof data.message === "string" && data.message.trim() !== "") {
        setMessages((prev) => [...prev, data]);
        setTimeout(scrollToBottom, 100);
      }
    };

    recieveMessage("project-message", handleProjectMessage);

    return () => {
      removeMessage("project-message", handleProjectMessage);
      disconnectSocket();
    };
  }, [projectId]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden bg-brand-light text-brand-text font-sans selection:bg-brand-blue/30 selection:text-brand-blue">
      {/* Left visual/intro section */}
      <div className="hidden md:flex md:w-[68%] h-screen relative overflow-hidden bg-white/50 border-r border-black/5">
        
        {/* Abstract Ambient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-[100px]"
          />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-black/5"
        >
          <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Main Project + AI header */}
        <div className="relative z-30 w-full h-full flex flex-col justify-center items-center px-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-blue rounded-3xl shadow-xl shadow-brand-blue/30 mb-6">
              <span className="text-white font-bold text-3xl">V</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-brand-text">
              Project Workspace
            </h1>
            <p className="text-xl text-brand-subtext font-medium max-w-xl mx-auto leading-relaxed">
              Plan, build, and ideate together with AI-powered assistance.
            </p>
          </div>
          
          {/* AI terminal box - Clean iOS Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xl bg-white/70 backdrop-blur-xl border border-black/5 shadow-xl shadow-black/5 rounded-3xl p-6"
          >
            <div className="flex items-center mb-4 gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                 <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-brand-text font-bold text-base">VOID Assistant</span>
            </div>
            <div className="bg-gray-50/80 rounded-2xl p-4 font-mono text-sm text-brand-subtext border border-black/5">
              <div className="animate-pulse mb-1 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-blue" />
                <span className="text-brand-blue font-semibold">System Active</span>
              </div>
              <p>Gathering latest project insights...</p>
              <p>Ready to guide your vision.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat section */}
      <div className="w-full md:w-[32%] relative flex flex-col h-screen bg-[#F9F9FB] shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-40">
        
        {/* Header bar */}
        <div className="h-[72px] min-h-[72px] bg-white/80 backdrop-blur-xl w-full flex justify-between items-center px-6 sticky top-0 z-20 border-b border-black/5">
          <button
            onClick={() => setisModalOpen(true)}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 font-semibold rounded-full shadow-md shadow-brand-blue/20 hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            <i className="ri-user-add-line text-lg"></i>
            <span>Add</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-subtext mr-2">
              {usersInProject.length} Users
            </span>
            <button
              onClick={() => setisSidePanelOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-brand-text rounded-full transition-colors"
              aria-label="Show Collaborators"
            >
              <i className="ri-group-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* Chat message area */}
        <div
          ref={messageBox}
          id="chat-container"
          className="flex-1 p-5 overflow-y-auto flex flex-col gap-4"
        >
          {messages.map((msg, idx) => {
            const isAI = msg?.sender?.username === "AI";
            const isSelf = msg?.sender?._id === userData?._id;

            return (
              <div
                key={idx}
                className={`
                  flex flex-col 
                  max-w-[85%] w-fit h-fit
                  ${isAI ? "mx-auto w-full" : isSelf ? "ml-auto" : "mr-auto"}
                `}
              >
                {!isSelf && !isAI && (
                  <span className="text-[11px] font-semibold text-brand-subtext ml-2 mb-1">
                    {msg?.sender?.username || "Unknown"}
                  </span>
                )}
                
                <div
                  className={`
                    px-5 py-4 rounded-3xl text-[15px] leading-relaxed
                    ${
                      isAI
                        ? "bg-white border border-black/5 shadow-xl shadow-black/5 w-full mt-2"
                        : isSelf
                        ? "bg-brand-blue text-white rounded-tr-sm shadow-md shadow-brand-blue/20"
                        : "bg-white border border-black/5 text-brand-text rounded-tl-sm shadow-sm"
                    }
                  `}
                >
                  {isAI ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 mb-2 pb-3 border-b border-black/5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-bold text-sm text-brand-text">Assistant</span>
                      </div>
                      <div className="text-brand-text flex flex-col gap-4">
                        <Markdown
                          options={{
                            overrides: {
                              p: { component: "p", props: { className: "mb-2 last:mb-0" } },
                              h1: { component: "h1", props: { className: "text-2xl font-bold mt-4 mb-2 text-brand-text" } },
                              h2: { component: "h2", props: { className: "text-xl font-bold mt-4 mb-2 text-brand-text" } },
                              h3: { component: "h3", props: { className: "text-lg font-bold mt-3 mb-2 text-brand-text" } },
                              ul: { component: "ul", props: { className: "list-disc pl-5 space-y-1 mb-2" } },
                              ol: { component: "ol", props: { className: "list-decimal pl-5 space-y-1 mb-2" } },
                              li: { component: "li", props: { className: "mb-1" } },
                              a: { component: "a", props: { className: "text-brand-blue hover:underline" } },
                              strong: { component: "strong", props: { className: "font-bold text-brand-text" } },
                              code: {
                                component: ({ inline, className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <div className="my-4 rounded-xl overflow-hidden border border-black/5 shadow-sm">
                                      <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-black/5">
                                        {match[1]}
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneLight}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          padding: '1rem',
                                          backgroundColor: '#F9F9FB',
                                          fontSize: '0.85rem'
                                        }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono" {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              },
                            },
                          }}
                        >
                          {msg.message}
                        </Markdown>
                      </div>
                    </div>
                  ) : (
                    <span>{msg.message}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat input bar */}
        <div className="p-4 bg-white border-t border-black/5">
          <form
            className="flex items-center gap-3 bg-[#F2F2F7] rounded-full p-1 border border-black/5 shadow-inner"
            onSubmit={e => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 px-4 py-2 bg-transparent text-brand-text placeholder-brand-subtext outline-none text-[15px]"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center justify-center h-9 w-9 bg-brand-blue rounded-full shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              aria-label="Send"
            >
              <i className="ri-arrow-up-line text-xl text-white font-bold"></i>
            </button>
          </form>
        </div>

        {/* Collaborator Side Panel */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full bg-white/90 backdrop-blur-2xl z-50 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] border-l border-black/5"
            >
              <header className="h-[72px] flex items-center px-6 border-b border-black/5 sticky top-0 bg-white">
                <button
                  onClick={() => setisSidePanelOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors mr-4"
                  aria-label="Close"
                >
                  <i className="ri-arrow-right-s-line text-xl text-brand-text"></i>
                </button>
                <h2 className="text-lg font-bold text-brand-text">Collaborators</h2>
              </header>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {usersInProject.length === 0 && (
                  <p className="text-center text-brand-subtext mt-10 font-medium">No collaborators yet.</p>
                )}
                {usersInProject.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-4 bg-white border border-black/5 shadow-sm rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {user.username && user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-text text-[15px]">{user.username}</h4>
                      <p className="text-xs text-brand-subtext font-medium">Active Member</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal: Add Collaborators */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl border border-black/5 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-brand-text">Add People</h3>
                  <p className="text-brand-subtext text-sm font-medium mt-1">Select users to add to the project</p>
                </div>
                <button 
                  onClick={() => setisModalOpen(false)} 
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-brand-text transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="bg-[#F2F2F7] rounded-2xl p-2 mb-6 max-h-64 overflow-y-auto border border-black/5">
                  {users.length === 0 && (
                    <div className="p-4 text-center text-brand-subtext font-medium text-sm">No users available.</div>
                  )}
                  {users.map((user) => (
                    <label key={user._id} className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-white cursor-pointer transition-colors group">
                      <span className="font-semibold text-brand-text text-[15px]">{user.username}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedUsers.includes(user._id) ? 'bg-brand-blue border-brand-blue' : 'border-gray-300 group-hover:border-brand-blue'}`}>
                        {selectedUsers.includes(user._id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      <input
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleChange(user._id)}
                        type="checkbox"
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
                
                <button
                  type="submit"
                  disabled={selectedUsers.length === 0}
                  className="w-full py-4 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  Invite to Project
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Project;
