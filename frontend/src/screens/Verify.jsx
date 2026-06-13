import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/axios";
import { resendOtp } from "./Register";
import PageWrapper from "../components/ui/PageWrapper";
import NeuralNetworkCanvas from "../components/ui/NeuralNetworkCanvas";
import { motion } from "framer-motion";

const Verify = () => {
  const navigate = useNavigate();
  const [otp, setotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setotp(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    axios.post('/users/verify', { code: otp }).then((res) => {
      navigate('/mainhome');
    }).catch((err) => {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Verification code is invalid or has expired.");
    }).finally(() => {
      setLoading(false);
    });
  }

  async function resendotp() {
    setErrorMsg("");
    try {
      await resendOtp();
      alert("Verification code has been resent to your email.");
    } catch (err) {
      setErrorMsg("Failed to resend code. Please try again.");
    }
  }

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-black text-brand-text-dark relative overflow-hidden font-sans">
      
      {/* Background Neural Networks */}
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

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 sm:p-10 glass-panel-dark rounded-none z-10 mx-4 border border-white/10 bg-black"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 border border-white/10 text-white flex items-center justify-center mx-auto mb-5">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-3xl font-syne font-black tracking-tight text-white mb-2 uppercase">
            Verify Email
          </h2>
          <p className="text-brand-subtext-dark font-semibold text-[10px] tracking-wider uppercase">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-transparent text-white border border-white p-4 text-xs font-syne uppercase tracking-widest mb-6 text-center rounded-none"
          >
            {errorMsg}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength="6"
              value={otp}
              onChange={handleChange}
              placeholder="000000"
              className="w-full px-4 py-4 border border-white/10 bg-zinc-950 focus:border-white text-center text-3xl font-bold tracking-[0.5em] text-white placeholder-zinc-800 transition-all outline-none rounded-none"
              pattern="[0-9]{6}"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-black bg-white hover:bg-zinc-200 transition-colors duration-300 flex items-center justify-center gap-2 rounded-none active:scale-[0.98] cursor-pointer disabled:opacity-50 font-syne"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="tracking-widest uppercase text-xs font-black">Verify Code</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-brand-subtext-dark font-bold uppercase tracking-wider">
            Didn't receive the code?{' '}
            <button onClick={resendotp} className="font-extrabold text-white underline hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-none">
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Verify;