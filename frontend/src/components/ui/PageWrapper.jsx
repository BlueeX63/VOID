import React from "react";
import { motion } from "framer-motion";

const variants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom cubic bezier for smooth reveal
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const PageWrapper = ({ children, className }) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
