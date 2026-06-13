import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../utils/cn";

const AnimatedCard = ({ children, className, containerClassName }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className={cn("perspective-1000", containerClassName)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-full w-full rounded-none glass transition-all duration-300 ease-out hover:shadow-xl",
          className
        )}
      >
        <div
          className="absolute inset-0 rounded-none opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 25%, transparent 30%)",
            transform: "translateZ(1px)"
          }}
        />
        <div className="h-full w-full" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedCard;
