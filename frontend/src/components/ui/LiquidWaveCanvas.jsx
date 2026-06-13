import React, { useEffect, useRef } from "react";

const LiquidWaveCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const waves = [
      {
        y: height * 0.5,
        length: 0.002,
        amplitude: 60,
        frequency: 0.012,
        color: "rgba(16, 185, 129, 0.06)", // emerald
        speed: 0.01
      },
      {
        y: height * 0.55,
        length: 0.003,
        amplitude: 40,
        frequency: 0.015,
        color: "rgba(6, 182, 212, 0.08)", // cyan
        speed: 0.015
      },
      {
        y: height * 0.45,
        length: 0.0015,
        amplitude: 80,
        frequency: 0.008,
        color: "rgba(58, 134, 255, 0.05)", // brand-blue
        speed: 0.007
      }
    ];

    // Glow particles traveling along the wave streams
    const streamParticles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      streamParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedX: Math.random() * 0.6 + 0.2,
        size: Math.random() * 1.8 + 0.8,
        waveIndex: i % waves.length,
        offsetY: (Math.random() - 0.5) * 80
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      waves[0].y = height * 0.5;
      waves[1].y = height * 0.55;
      waves[2].y = height * 0.45;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const animate = () => {
      // Create dark green luxurious ambient background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#051614"); // Darkest teal-black
      bgGrad.addColorStop(0.5, "#020c0b");
      bgGrad.addColorStop(1, "#010606");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      time += 0.01;

      // Mouse position smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Render flowing wave layers
      waves.forEach((wave, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 3) {
          // Sine wave formula
          let y = wave.y + Math.sin(x * wave.length + time * wave.frequency * 100) * wave.amplitude;
          
          // Hover distortion: push waves away slightly near the mouse
          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) * 0.15;
            y += (dy / dist) * force;
          }

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();

        // Stroke highlight
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 - idx * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update and draw floating particles
      streamParticles.forEach((p) => {
        p.x += p.speedX;
        if (p.x > width) {
          p.x = -10;
          p.y = Math.random() * height;
        }

        // Snap particles to snap closely to corresponding wave stream
        const wave = waves[p.waveIndex];
        const baseWaveY = wave.y + Math.sin(p.x * wave.length + time * wave.frequency * 100) * wave.amplitude;
        p.y += (baseWaveY + p.offsetY - p.y) * 0.05;

        // Draw glowing particle
        const opacity = Math.min(Math.max(1 - p.x / width, 0.15), 0.7);
        ctx.fillStyle = `rgba(16, 255, 185, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow blur around particles
        ctx.fillStyle = `rgba(16, 255, 185, ${opacity * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Top highlighted gloss overlay
      const gloss = ctx.createLinearGradient(0, 0, width, height);
      gloss.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      gloss.addColorStop(0.3, "rgba(255, 255, 255, 0)");
      gloss.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      gloss.addColorStop(1, "rgba(0, 0, 0, 0.2)");
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />;
};

export default LiquidWaveCanvas;
