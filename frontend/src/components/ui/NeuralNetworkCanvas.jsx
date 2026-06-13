import React, { useEffect, useRef } from "react";

const NeuralNetworkCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const nodes = [];
    const nodeCount = 95;
    const maxDistance = 110;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "255, 255, 255" : i % 3 === 1 ? "180, 180, 180" : "100, 100, 100", // white, light gray, dark gray
        pulseFactor: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.05 + 0.02
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      // Pure black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce walls
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse attraction physics
        if (mouseRef.current.isHovered) {
          const dx = mouseRef.current.x - n.x;
          const dy = mouseRef.current.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullRadius = 180;

          if (dist < pullRadius) {
            const pullForce = (pullRadius - dist) / pullRadius * 0.28;
            n.x += (dx / dist) * pullForce;
            n.y += (dy / dist) * pullForce;
          }
        }

        n.pulseFactor += n.pulseSpeed;
      });

      // Draw connection lines
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Smooth gradient stroke matching node color theme
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulseFactor) * 0.5 + 0.8;
        
        ctx.fillStyle = `rgba(${n.color}, ${0.5 + pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo for larger nodes
        if (n.size > 2) {
          ctx.fillStyle = `rgba(255, 255, 255, 0.06)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size * 3 * pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Top highlighted gloss overlays
      const gloss = ctx.createLinearGradient(0, 0, width, height);
      gloss.addColorStop(0, "rgba(255, 255, 255, 0.015)");
      gloss.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      gloss.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />;
};

export default NeuralNetworkCanvas;
