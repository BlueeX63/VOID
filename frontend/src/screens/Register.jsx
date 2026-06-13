import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../config/axios";
import { userContext } from "../context/UserContext";
import PageWrapper from "../components/ui/PageWrapper";
import NeuralNetworkCanvas from "../components/ui/NeuralNetworkCanvas";

let name = '';
let mail = '';
let pass = '';

const Register = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { setuserData } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "username") {
      setusername(value);
    } else if (name === "email") {
      setemail(value);
    } else if (name === "password") {
      setpassword(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    name = username;
    mail = email;
    pass = password;

    axios.post('/users/register', {
      username, email, password
    }, { withCredentials: true }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      setuserData(res.data.user);
      navigate('/verify');
    }).catch((err) => {
      console.log(err.response?.data);
      setErrorMsg(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Registration failed. Try again.");
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <PageWrapper className="min-h-screen flex bg-black text-brand-text-dark relative overflow-hidden font-sans">

      {/* Left Column - Visual Neural Networks */}
      <div className="hidden lg:flex lg:w-1/2 relative items-end p-16 overflow-hidden border-r border-gray-900 bg-black">
        <NeuralNetworkCanvas />
        
        {/* Top left Logo */}
        <div className="absolute top-12 left-12 z-20 flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
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
        </div>

        {/* Text Overlay */}
        <div className="relative z-10 text-white max-w-2xl space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-syne font-black tracking-[0.08em] leading-none uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 pr-8 pb-2"
          >
            Join the <br />
            Collective
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-brand-subtext-dark text-xs font-semibold uppercase tracking-widest leading-relaxed"
          >
            Create your sync signature, configure your credentials, and start collaborating in intelligent workspaces powered by AI.
          </motion.p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#020202]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-panel-dark p-8 sm:p-10 rounded-none border border-white/10 bg-black"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-syne font-black tracking-tight text-white mb-2 uppercase">Create Account</h2>
            <p className="text-brand-subtext-dark font-semibold text-[10px] tracking-wider uppercase">Fill in the details to get started</p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-transparent text-white border border-white p-4 text-xs font-syne uppercase tracking-widest mb-6 text-center rounded-none"
            >
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[9px] font-bold text-brand-subtext-dark uppercase tracking-widest mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={handleChange}
                  className="w-full px-5 py-4 glass-input-dark rounded-none text-white placeholder-brand-subtext-dark/40 text-xs font-semibold focus:outline-none"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-brand-subtext-dark uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 glass-input-dark rounded-none text-white placeholder-brand-subtext-dark/40 text-xs font-semibold focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-brand-subtext-dark uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={handleChange}
                    className="w-full pl-5 pr-12 py-4 glass-input-dark rounded-none text-white placeholder-brand-subtext-dark/40 text-xs font-semibold focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-subtext-dark hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold text-black bg-white hover:bg-zinc-200 transition-colors duration-300 flex items-center justify-center gap-2 rounded-none active:scale-[0.98] cursor-pointer disabled:opacity-50 font-syne"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="tracking-widest uppercase text-xs font-black">Sign Up Free</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-brand-subtext-dark font-bold uppercase tracking-wider">
              Already have an account?{" "}
              <Link to="/login" className="font-extrabold text-white underline hover:text-zinc-300 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export const resendOtp = async () => {
  await axios.post('/users/register', {
    username: name, email: mail, password: pass
  }, { withCredentials: true }).then((res) => {
    console.log("OTP Resent successfully.");
  }).catch(err => { console.log(err.message) });
};

export default Register;


