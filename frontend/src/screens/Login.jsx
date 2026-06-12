import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { userContext } from '../context/UserContext';
import PageWrapper from '../components/ui/PageWrapper';

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const { setuserData } = useContext(userContext);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "email") {
      setemail(value);
    } else if (name === "password") {
      setpassword(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.post('/users/login', {
      email, password
    }, { withCredentials: true }).then((res) => {
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      setuserData(res.data.user);
      navigate('/mainhome');
    }).catch((err) => {
      console.log(err.response?.data);
    });
  }

  return (
    <PageWrapper className="min-h-screen flex bg-brand-light text-brand-text relative overflow-hidden">

      {/* Left Column - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center border-r border-black/5 bg-white/30 backdrop-blur-xl">
        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/60 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center max-w-md">
          <div className="w-20 h-20 mb-8 rounded-2xl bg-brand-blue flex items-center justify-center shadow-xl shadow-brand-blue/20">
            <span className="text-white font-black text-3xl">V</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4">Welcome Back to VOID</h2>
          <p className="text-brand-subtext text-lg font-medium">Continue building the future of collaboration. Log in to access your workspaces, meetings, and AI companions.</p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md glass p-10 rounded-3xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-brand-subtext font-medium text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-brand-subtext uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/80 border border-black/5 shadow-sm rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text placeholder-brand-subtext transition-all outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-subtext uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/80 border border-black/5 shadow-sm rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text placeholder-brand-subtext transition-all outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white transition-all bg-brand-blue hover:opacity-90 shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-brand-subtext font-medium">
              New to VOID?{' '}
              <Link to="/register" className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;