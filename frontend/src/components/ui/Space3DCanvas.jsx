import React, { useEffect, useRef, useState } from "react";

const Space3DCanvas = ({ currentShapeIndex = 0 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, lastX: 0, lastY: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const ambientStars = [];
    const particleCount = 550;
    const starCount = 180;
    const focalLength = 350;

    // Base Half-Moon (Hemisphere) configuration
    const baseRadius = 240;
    const baseLatitudes = 8;
    const baseLongitudes = 16;
    const baseCenterY = 160; // offset downwards to sit at the base

    // Rotation variables
    let angleX = 0.003;
    let angleY = 0.003;
    let currentAngleX = 0;
    let currentAngleY = 0;

    const shapePositions = {
      sphere: [],
      torus: [],
      helix: [],
      wave: []
    };

    // Math builders for target structures
    // 1. Sphere
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = 110;
      shapePositions.sphere.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta) - 20, // slightly offset upwards
        z: r * Math.cos(phi)
      });
    }

    // 2. Torus
    const r1 = 100;
    const r2 = 40;
    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 2 * 10;
      const v = (i / particleCount) * Math.PI * 2;
      shapePositions.torus.push({
        x: (r1 + r2 * Math.cos(v)) * Math.cos(u),
        y: (r1 + r2 * Math.cos(v)) * Math.sin(u) - 20,
        z: r2 * Math.sin(v)
      });
    }

    // 3. DNA Helix
    for (let i = 0; i < particleCount; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const t = (i / particleCount) * Math.PI * 4;
      const r = 70;
      shapePositions.helix.push({
        x: r * Math.cos(t) * strand,
        y: (i - particleCount / 2) * 0.5 - 20,
        z: r * Math.sin(t) * strand
      });
    }

    // 4. Wave Sheet
    const cols = Math.floor(Math.sqrt(particleCount));
    const spacing = 16;
    for (let i = 0; i < particleCount; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      shapePositions.wave.push({
        x: (c - cols / 2) * spacing,
        y: -40,
        z: (r - cols / 2) * spacing
      });
    }

    // Initialize morphing particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        size: Math.random() * 1.2 + 0.6,
        color: i % 3 === 0 ? "170, 170, 170" : i % 3 === 1 ? "100, 100, 100" : "255, 255, 255"
      });
    }

    // Initialize starfield stars with mouse-interactive speed variables
    for (let i = 0; i < starCount; i++) {
      ambientStars.push({
        x: (Math.random() - 0.5) * width * 2.5,
        y: (Math.random() - 0.5) * height * 2.5,
        z: Math.random() * 800,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
        offsetX: 0, // repulsion dynamic offset
        offsetY: 0
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseRef.current.targetX = (clientX - width / 2) * 0.0002;
      mouseRef.current.targetY = (clientY - height / 2) * 0.0002;

      // Tracking absolute mouse pos for repulsion field
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;

      if (mouseRef.current.isDown) {
        const deltaX = e.clientX - mouseRef.current.lastX;
        const deltaY = e.clientY - mouseRef.current.lastY;
        currentAngleY += deltaX * 0.004;
        currentAngleX -= deltaY * 0.004;
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      let targetCoords = shapePositions.sphere;
      if (currentShapeIndex === 1) targetCoords = shapePositions.torus;
      else if (currentShapeIndex === 2) targetCoords = shapePositions.helix;
      else if (currentShapeIndex === 3) targetCoords = shapePositions.wave;

      // Mouse swivel easing
      angleY += (mouseRef.current.targetX - angleY) * 0.06;
      angleX += (mouseRef.current.targetY - angleX) * 0.06;

      const finalAngleX = currentAngleX + angleX + Math.sin(time * 0.15) * 0.0005;
      const finalAngleY = currentAngleY + angleY + time * 0.0015;

      const cosX = Math.cos(finalAngleX);
      const sinX = Math.sin(finalAngleX);
      const cosY = Math.cos(finalAngleY);
      const sinY = Math.sin(finalAngleY);

      // 1. Draw Starfield with cursor-repulsion force vectors
      for (let i = 0; i < starCount; i++) {
        const star = ambientStars[i];
        star.z -= star.speed;
        if (star.z <= 0) {
          star.z = 800;
          star.offsetX = 0;
          star.offsetY = 0;
        }

        // Star perspective projection
        const scale = focalLength / star.z;
        let projX = (star.x + star.offsetX) * scale + width / 2;
        let projY = (star.y + star.offsetY) * scale + height / 2;

        // Calculate cursor repulsion
        const dx = projX - mouseRef.current.x;
        const dy = projY - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 220;

        if (dist < repelRadius && mouseRef.current.x > 0) {
          const force = (repelRadius - dist) * 0.18;
          // Apply offset to star coordinates
          star.offsetX += (dx / dist) * force * 0.2;
          star.offsetY += (dy / dist) * force * 0.2;
        } else {
          // Slowly recover original position
          star.offsetX *= 0.98;
          star.offsetY *= 0.98;
        }

        // Recalculate with offset
        projX = (star.x + star.offsetX) * scale + width / 2;
        projY = (star.y + star.offsetY) * scale + height / 2;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          const alpha = (1 - star.z / 800) * 0.45;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(projX, projY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Buffer projected points to render depth correctly
      const projected = [];

      // 2. Process central morphing 3D shapes
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const target = targetCoords[i] || { x: 0, y: 0, z: 0 };

        let tx = target.x;
        let ty = target.y;
        let tz = target.z;

        // Spherical organic blob waving noise
        if (currentShapeIndex === 0) {
          const waveStrength = 16;
          const noise = Math.sin(tx * 0.035 + time * 2) * Math.cos(ty * 0.035 + time * 2) * Math.sin(tz * 0.035 + time * 2);
          tx += (tx / 110) * noise * waveStrength;
          ty += (ty / 110) * noise * waveStrength;
          tz += (tz / 110) * noise * waveStrength;
        } else if (currentShapeIndex === 3) {
          ty += Math.sin(tx * 0.04 + time * 2) * Math.cos(tz * 0.04 + time * 2) * 12;
        }

        // Easing interpolation
        p.x += (tx - p.x) * 0.06;
        p.y += (ty - p.y) * 0.06;
        p.z += (tz - p.z) * 0.06;

        // Rotations
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        const scale = focalLength / (focalLength + z2);
        if (scale > 0) {
          const projX = x1 * scale + width / 2;
          const projY = y2 * scale + height / 2;

          projected.push({
            x: projX,
            y: projY,
            scale: scale,
            z: z2,
            color: p.color,
            size: p.size,
            isBase: false
          });
        }
      }

      // 3. Process the Rotating Half-Moon (Hemisphere) Wireframe at the base
      // Base rotates continuously around Y axis
      const baseAngleY = time * 0.12;
      const cosBaseY = Math.cos(baseAngleY + angleY);
      const sinBaseY = Math.sin(baseAngleY + angleY);
      
      const baseAngleX = finalAngleX * 0.3; // tilt base slightly less for ground feel
      const cosBaseX = Math.cos(baseAngleX + 0.5); // look from slightly above
      const sinBaseX = Math.sin(baseAngleX + 0.5);

      // Build wireframe hemisphere lines (latitudes rings and longitudinal arcs)
      for (let lat = 0; lat < baseLatitudes; lat++) {
        // lat_angle goes from 0 (equator/bottom) to PI/2 (top pole)
        const latAngle = (lat / baseLatitudes) * (Math.PI / 2);
        const rRing = baseRadius * Math.cos(latAngle);
        const yRing = baseRadius * Math.sin(latAngle) + baseCenterY;

        // Place points along this latitude ring
        const ringPointsCount = 24;
        for (let pt = 0; pt < ringPointsCount; pt++) {
          const ptAngle = (pt / ringPointsCount) * Math.PI * 2;
          
          // Original local 3D coordinates (centered at base offset)
          const bx = rRing * Math.cos(ptAngle);
          const by = yRing;
          const bz = rRing * Math.sin(ptAngle);

          // Apply Y rotation
          let x1 = bx * cosBaseY - bz * sinBaseY;
          let z1 = bz * cosBaseY + bx * sinBaseY;
          
          // Apply X rotation (ground perspective tilt)
          let y2 = by * cosBaseX - z1 * sinBaseX;
          let z2 = z1 * cosBaseX + by * sinBaseX;

          // Projection
          const scale = focalLength / (focalLength + z2);
          if (scale > 0) {
            const projX = x1 * scale + width / 2;
            const projY = y2 * scale + height / 2;

            projected.push({
              x: projX,
              y: projY,
              scale: scale,
              z: z2,
              color: "100, 100, 100", // subtle gray color for base grid lines
              size: 1.0,
              isBase: true
            });
          }
        }
      }

      // Sort by Z index
      projected.sort((a, b) => b.z - a.z);

      // Render connected lines for wireframe mesh
      // Latitudinal circular connections for base wireframe
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;

      // Draw projected elements
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        if (p.isBase) {
          // Draw base wireframe nodes
          const baseAlpha = Math.min(Math.max((p.z + 100) / 400, 0.05), 0.35);
          ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw main shape morphing particle nodes
          const alpha = Math.min(Math.max((p.z + 200) / 400, 0.15), 1);
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale * 1.4, 0, Math.PI * 2);
          ctx.fill();

          if (p.z < -60 && p.scale > 1.2) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.scale * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw mesh web lines for central elements
      if (currentShapeIndex === 0 || currentShapeIndex === 1) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.4;
        const step = currentShapeIndex === 0 ? 5 : 4;
        for (let i = 0; i < projected.length; i += step) {
          const pi = projected[i];
          if (pi.isBase || pi.z > 200) continue;

          let connections = 0;
          for (let j = i + 1; j < projected.length; j++) {
            const pj = projected[j];
            if (pj.isBase || connections > 2) break;

            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 35) {
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentShapeIndex]);

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ${hovered ? "scale-[1.01]" : "scale-100"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "grab" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />
      <div className="absolute bottom-10 w-[400px] h-[100px] bg-white/5 blur-[80px] pointer-events-none" />
    </div>
  );
};

export default Space3DCanvas;
