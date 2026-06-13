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
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData")) || { username: "User" };

  // IDE Editor state variables
  const [activeFileName, setActiveFileName] = useState("App.js");
  const [projectFiles, setProjectFiles] = useState({
    "App.js": `import React from 'react';\n\nconst App = () => {\n  return (\n    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">\n      <h1 className="text-4xl font-black">Welcome to VOID</h1>\n      <p className="text-slate-400 mt-2">Start collaborating with AI by typing @ai in the chat.</p>\n    </div>\n  );\n};\n\nexport default App;`,
    "styles.css": `:root {\n  --brand-blue: #3A86FF;\n  --brand-dark: #050508;\n}\n\nbody {\n  margin: 0;\n  font-family: 'Outfit', sans-serif;\n  background-color: var(--brand-dark);\n  color: #fff;\n}`,
    "README.md": `# VOID Collaborative Space\n\nWelcome to your new intelligence workspace! \n\n### How to work with AI:\n1. Type \`@ai\` followed by your prompt in the chat panel on the right.\n2. When the AI outputs a code block, it will automatically populate in the \`AI-Generated.js\` file tab in the editor.\n3. Click on any code block in the chat to view it in the editor.`,
    "AI-Generated.js": `// Ask the AI to write some code to see it live here!\n// Try prompting: "@ai write a clean express route for users"`
  });

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
        // Refresh project users
        setusersInProject(res.data.project.users);
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
    if (message.includes("@ai")) {
      setIsAiTyping(true);
    }
    setmessage("");
    setTimeout(scrollToBottom, 100);
  }

  // Extracts code blocks from messages to load in editor
  const extractAndLoadCode = (text) => {
    // Look for ```[language] ... ``` markdown blocks
    const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const matches = [...text.matchAll(regex)];
    if (matches.length > 0) {
      const codeContent = matches[matches.length - 1][1]; // last code block
      setProjectFiles(prev => ({
        ...prev,
        "AI-Generated.js": codeContent
      }));
      setActiveFileName("AI-Generated.js");
    }
  };

  // Run on initial page load to fetch users
  useEffect(() => {
    axios.get("/users/all").then((res) => {
      setUsers(res.data.users);
    });
  }, []);

  // Set up socket logic and retrieve project details
  useEffect(() => {
    axios.get(`/projects/get-project/${projectId}`).then((res) => {
      setusersInProject(res.data.project.users);
      if (res.data.project.messages) {
        setMessages(res.data.project.messages);
        // Find if there was any code block in history
        const history = res.data.project.messages;
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].message.includes("```")) {
            extractAndLoadCode(history[i].message);
            break;
          }
        }
      }
    });

    initializeSocket(projectId);
    
    const handleProjectMessage = (data) => {
      if (typeof data.message === "string" && data.message.trim() !== "") {
        if (data?.sender?.username === "AI") {
          setIsAiTyping(false);
          extractAndLoadCode(data.message);
        }
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
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden bg-brand-light text-brand-text font-sans selection:bg-white/10 selection:text-white">
      
      {/* Left Column: Interactive IDE Workspace (68% width) */}
      <div className="w-full md:w-[68%] h-screen relative flex flex-col bg-brand-dark text-gray-300 border-r border-gray-800">
        
        {/* Editor Top Control Bar */}
        <header className="h-[72px] min-h-[72px] border-b border-gray-800 px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/mainhome")}
              className="w-9 h-9 rounded-none bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer active:scale-95 text-white"
              title="Return to Dashboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-none bg-white animate-pulse" />
              <h2 className="text-white font-syne font-black text-sm uppercase tracking-wider">Workspace Channel</h2>
            </div>
          </div>

          {/* Copy Snippet Control */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(projectFiles[activeFileName]);
                alert("File content copied to clipboard!");
              }}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-bold uppercase tracking-wider rounded-none text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <i className="ri-file-copy-line"></i>
              <span>Copy</span>
            </button>
          </div>
        </header>

        {/* IDE Layout Space */}
        <div className="flex-1 flex min-h-0 relative">
          
          {/* File Tree Sidebar Mockup */}
          <aside className="w-56 bg-brand-dark border-r border-gray-800 flex flex-col justify-between p-5 hidden sm:flex shrink-0">
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Project Files
              </div>
              <div className="space-y-2.5">
                {Object.keys(projectFiles).map((fileName) => {
                  const isActive = activeFileName === fileName;
                  let icon = "ri-file-code-line text-zinc-400";
                  if (fileName.endsWith(".css")) icon = "ri-css3-line text-zinc-400";
                  if (fileName.endsWith(".md")) icon = "ri-markdown-line text-zinc-400";
                  if (fileName === "AI-Generated.js") icon = "ri-sparkling-2-line text-white";

                  return (
                    <button
                      key={fileName}
                      onClick={() => setActiveFileName(fileName)}
                      className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-none text-xs font-bold tracking-wide transition-all cursor-pointer ${
                        isActive ? "bg-gray-900 text-white border border-gray-800" : "text-gray-400 hover:text-white hover:bg-gray-900/50"
                      }`}
                    >
                      <i className={`text-base ${icon}`} />
                      <span className="truncate">{fileName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Status Footer */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-none p-4 font-mono text-[10px] text-gray-500 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-none bg-zinc-400" />
                <span>SYNC ONLINE</span>
              </div>
              <p>Buffer initialized.</p>
              <p>Ready to update.</p>
            </div>
          </aside>

          {/* Main Code Editor Window */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0E]">
            {/* Tabs for files in responsive mode */}
            <div className="flex sm:hidden overflow-x-auto bg-brand-dark border-b border-gray-800 p-2 gap-2">
              {Object.keys(projectFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setActiveFileName(fileName)}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold whitespace-nowrap cursor-pointer ${
                    activeFileName === fileName ? "bg-gray-900 text-white" : "text-gray-400"
                  }`}
                >
                  {fileName}
                </button>
              ))}
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed relative">
              <SyntaxHighlighter
                language={activeFileName.endsWith(".css") ? "css" : activeFileName.endsWith(".md") ? "markdown" : "javascript"}
                style={oneDark}
                customStyle={{
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: "1.6"
                }}
                showLineNumbers={true}
              >
                {projectFiles[activeFileName]}
              </SyntaxHighlighter>

              {/* Glossy watermark */}
              <div className="absolute bottom-6 right-6 font-bold text-xs uppercase tracking-widest text-gray-800 select-none pointer-events-none">
                VOID IDE v1.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Section (32% width) */}
      <div className="w-full md:w-[32%] relative flex flex-col h-screen bg-[#F8F9FB] border-l border-zinc-200 z-40 shrink-0">
        
        {/* Chat Header */}
        <div className="h-[72px] min-h-[72px] bg-white border-b border-zinc-200 w-full flex justify-between items-center px-6 sticky top-0 z-20">
          <button
            onClick={() => setisModalOpen(true)}
            className="flex items-center gap-1.5 bg-black border border-black text-white px-4 py-2 font-bold rounded-none hover:bg-zinc-800 active:scale-95 transition-all text-xs uppercase tracking-widest font-syne cursor-pointer"
          >
            <i className="ri-user-add-line text-sm"></i>
            <span>Add</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-syne font-black uppercase tracking-widest text-black bg-zinc-50 border border-black px-2.5 py-1 rounded-none mr-1.5">
              {usersInProject.length} Users
            </span>
            <button
              onClick={() => setisSidePanelOpen(true)}
              className="w-9 h-9 flex items-center justify-center bg-white border border-zinc-300 hover:border-black hover:bg-zinc-50 text-black rounded-none transition-colors cursor-pointer"
              aria-label="Show Collaborators"
            >
              <i className="ri-group-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* Chat Message Logs Area */}
        <div
          ref={messageBox}
          id="chat-container"
          className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-brand-light/30"
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
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-subtext ml-2 mb-1.5">
                    {msg?.sender?.username || "Collaborator"}
                  </span>
                )}
                
                <div
                  onClick={() => {
                    if (msg.message.includes("```")) {
                      extractAndLoadCode(msg.message);
                    }
                  }}
                  className={`
                    px-5 py-3.5 rounded-none text-sm leading-relaxed cursor-pointer transition-all duration-300
                    ${
                      isAI
                        ? "bg-white border border-black w-full mt-1.5"
                        : isSelf
                        ? "bg-black border border-black text-white hover:bg-zinc-900"
                        : "bg-zinc-100 border border-zinc-200 text-black hover:border-zinc-300"
                    }
                  `}
                >
                  {isAI ? (
                    <div className="flex flex-col gap-3 text-black">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-200">
                        <div className="w-6 h-6 rounded-none bg-zinc-50 border border-black flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-syne font-black text-[11px] uppercase tracking-wider text-black">VOID Assistant</span>
                      </div>
                      
                      <div className="text-brand-text flex flex-col gap-3 text-xs leading-relaxed ai-scroll overflow-x-auto">
                        <Markdown
                          options={{
                            overrides: {
                              p: { component: "p", props: { className: "mb-2 last:mb-0" } },
                              h1: { component: "h1", props: { className: "text-lg font-extrabold mt-3 mb-1.5 text-brand-text" } },
                              h2: { component: "h2", props: { className: "text-base font-extrabold mt-3 mb-1.5 text-brand-text" } },
                              ul: { component: "ul", props: { className: "list-disc pl-5 space-y-1 mb-2" } },
                              ol: { component: "ol", props: { className: "list-decimal pl-5 space-y-1 mb-2" } },
                              code: {
                                component: ({ inline, className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <div className="my-3 rounded-none overflow-hidden border border-zinc-200 shadow-inner">
                                      <div className="bg-zinc-50 px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200 flex justify-between items-center">
                                        <span>{match[1]} code snippet</span>
                                        <span className="text-[9px] text-zinc-500 font-extrabold">Loaded to Editor</span>
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          padding: '1rem',
                                          backgroundColor: '#0A0A0E',
                                          fontSize: '11px'
                                        }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code className="bg-zinc-100 text-black px-1.5 py-0.5 rounded-none text-[11px] font-mono border border-zinc-200" {...props}>
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
                    <span className="font-medium">{msg.message}</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking loader bubble */}
          {isAiTyping && (
            <div className="flex flex-col max-w-[85%] w-fit h-fit mx-auto w-full">
              <div className="px-5 py-4 rounded-none bg-white border border-black w-full mt-1.5">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200">
                  <div className="w-6 h-6 rounded-none bg-zinc-50 border border-black flex items-center justify-center">
                    <i className="ri-loader-4-line text-black animate-spin text-sm"></i>
                  </div>
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-black">Assistant is thinking...</span>
                </div>
                <div className="flex gap-1.5 p-2">
                  <div className="w-1.5 h-1.5 rounded-none bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-none bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-none bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-zinc-200 sticky bottom-0">
          <form
            className="flex items-center gap-2.5 bg-zinc-50 rounded-none p-1.5 border border-black shadow-inner"
            onSubmit={e => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              placeholder="Prompt with @ai or message..."
              className="flex-1 px-4 py-2 bg-transparent text-black placeholder-zinc-400 outline-none text-xs font-semibold"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center justify-center h-9 w-9 bg-black border border-black rounded-none hover:bg-zinc-800 text-white transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Send Message"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
        </div>

        {/* Side Panel: Active Members in Room */}
        <AnimatePresence>
          {isSidePanelOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-full bg-white z-50 flex flex-col shadow-2xl border-l border-zinc-200"
            >
              <header className="h-[72px] flex items-center px-6 border-b border-zinc-200 sticky top-0 bg-white justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setisSidePanelOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-none bg-white border border-black hover:bg-black hover:text-white transition-colors cursor-pointer text-black"
                    aria-label="Close panel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <h2 className="text-sm font-syne font-black uppercase tracking-wider text-black">Active Members</h2>
                </div>
                <span className="text-[10px] font-bold text-black border border-black bg-zinc-50 px-2 py-0.5 rounded-none">{usersInProject.length} Total</span>
              </header>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {usersInProject.length === 0 && (
                  <p className="text-center text-zinc-500 mt-10 font-bold uppercase text-[10px] tracking-widest">No collaborators yet.</p>
                )}
                {usersInProject.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-4 bg-zinc-50 border border-black rounded-none shadow-sm"
                  >
                    <div className="w-10 h-10 bg-black text-white border border-black rounded-none flex items-center justify-center font-black text-sm mr-4">
                      {user.username && user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-black text-sm leading-none uppercase">{user.username}</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5">Authorized Sync</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add User Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-black rounded-none p-8 w-full max-w-md shadow-2xl relative overflow-hidden text-black"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-syne font-black uppercase">Add Sync Signatures</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Select developers to invite to workspace</p>
                </div>
                <button 
                  onClick={() => setisModalOpen(false)} 
                  className="w-8 h-8 rounded-none bg-zinc-50 border border-black hover:bg-black hover:text-white flex items-center justify-center text-black cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="bg-zinc-50 rounded-none p-2 mb-6 max-h-60 overflow-y-auto border border-black">
                  {users.length === 0 && (
                    <div className="p-4 text-center text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No users found.</div>
                  )}
                  {users.map((user) => (
                    <label key={user._id} className="flex justify-between items-center px-4 py-3 rounded-none hover:bg-zinc-150 cursor-pointer border-b border-zinc-200 last:border-0 group">
                      <span className="font-bold text-black text-xs uppercase tracking-wide">{user.username}</span>
                      <div className={`w-5 h-5 rounded-none border-2 flex items-center justify-center transition-colors ${selectedUsers.includes(user._id) ? 'bg-black border-black' : 'border-zinc-300 group-hover:border-black'}`}>
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
                  className="w-full py-4 bg-black text-white font-syne font-black text-xs uppercase tracking-widest rounded-none shadow-lg hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
                >
                  Invite to Workspace
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

