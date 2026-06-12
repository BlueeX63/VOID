import axios from "../config/axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendOtp } from "./Register";
import PageWrapper from "../components/ui/PageWrapper";
import { motion } from "framer-motion";

const Verify = () => {
  const navigate = useNavigate();
  const [otp, setotp] = useState('');

  function handleChange(e) {
    setotp(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    axios.post('/users/verify', { code: otp }).then((res) => {
      console.log(res);
      navigate('/mainhome');
    }).catch((err) => { console.log(err); });
  }

  async function resendotp() {
    resendOtp();
  }

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-brand-light text-brand-text relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-100/60 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md p-10 glass rounded-3xl z-10 mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Verify Email
          </h2>
          <p className="text-brand-subtext text-sm font-medium">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

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
              className="w-full px-4 py-4 border border-black/5 shadow-inner rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white text-center text-3xl font-bold tracking-[0.5em] text-brand-text placeholder-gray-300 transition-all outline-none"
              pattern="[0-9]{6}"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white transition-all bg-brand-blue hover:opacity-90 shadow-lg shadow-brand-blue/30"
          >
            Verify Code
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-brand-subtext font-medium">
            Didn't receive the code?{' '}
            <button onClick={resendotp} className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors">
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Verify;