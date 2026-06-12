import React from 'react'
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Verify from '../screens/Verify'
import Projects from '../screens/Projects'
import FirstPage from '../screens/FirstPage' // Fixed case if needed
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<FirstPage />} />
        <Route path='/mainhome' element={<UserAuth><Home /></UserAuth>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/all-projects' element={<UserAuth><Projects /></UserAuth>} />
        <Route path='/project/:id' element={<UserAuth><Project /></UserAuth>} />
      </Routes>
    </AnimatePresence>
  );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default AppRoutes