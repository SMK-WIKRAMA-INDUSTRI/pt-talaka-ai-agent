import React, { useEffect, useRef } from 'react';

/**
 * ParticleBackground
 *
 * Antigravity-style particle canvas localized specifically to the Hero Hub area:
 * - Color Palette: Warm Ivory (#FAF6F0), Soft Mocca (#9E7B66), Espresso Brown (#4A3525), Sand Beige (#E5D7C4)
 * - Moderate count: ~70 particles, clean, aesthetic, and never cluttered.
 *
 * Behaviors:
 * 1. Idle State:
 *    Particles gently flow along the radiating arcs into the central wheel hub,
 *    accompanying the streaming cables ("animasi menyalurkan").
 *
 * 2. Hover / Interactive State (Cursor in Hub area):
 *    Particles immediately snap into concentric circles around the cursor,
 *    rotating tangentially along the circular arcs just like on antigravity.google.
 *    Subtle concentric dashed guide rings appear around the cursor.
 */
export default function ParticleBackground({ containerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef?.current || canvas.parentElement || document.body;

    // Harmonized Talaka Warm Fashion Palette (No rainbow colors)
    const PALETTE = [
      [74, 53, 37],    // #4A3525 - Espresso Brown (Accent)
      [158, 123, 102], // #9E7B66 - Soft Mocca (Supporting)
      [115, 82, 58],   // Rich Deep Mocca
      [185, 148, 122], // Light Cinnamon Mocca
      [205, 178, 150], // Sand Beige
      [90, 65, 45],    // Dark Espresso
      [145, 112, 92],  // Warm Taupe
    ];

    let W = 0;
    let H = 0;
    let particles = [];
    let rafId = null;

    // Concentric ring radii around the cursor (Antigravity concentric snap)
    const RING_RADII = [45, 85, 130, 180, 240, 305];
    const MAX_INFLUENCE_DIST = 310;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    function resize() {
      if (!canvas) return;
      const rect = container.getBoundingClientRect();
      W = canvas.width = rect.width || 1000;
      H = canvas.height = rect.height || 520;

      // Clean, moderate count: ~70 particles (not too many)
      const count = Math.max(55, Math.min(85, Math.floor(W / 14)));
      particles = Array.from({ length: count }, (_, i) => createParticle(i, count));
    }

    function createParticle(index = 0, total = 70) {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      // Fan angle from top-left to top-right above the wheel
      const angleRatio = index / total;
      const angle = Math.PI * (0.82 + angleRatio * 1.36) + (Math.random() - 0.5) * 0.15;
      const dist = 110 + Math.random() * 320;
      const hubX = W * 0.5;
      const hubY = H * 0.90;

      return {
        // Current position
        x: hubX + Math.cos(angle) * dist,
        y: hubY + Math.sin(angle) * (dist * 0.65),
        // Idle radial coordinates
        angle,
        dist,
        speed: 0.55 + Math.random() * 0.65,
        // Dash geometry
        len: 6 + Math.random() * 6,       // 6-12px
        thick: 1.8 + Math.random() * 0.8, // 1.8-2.6px
        strokeAngle: angle + Math.PI,    // Pointing inward initially
        color,
        alpha: 0.35 + Math.random() * 0.45,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    }

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Check if pointer is inside the hub area
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouse.targetX = clientX - rect.left;
        mouse.targetY = clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Smooth mouse tracking
      if (mouse.active) {
        if (mouse.x < -500) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.12;
          mouse.y += (mouse.targetY - mouse.y) * 0.12;
        }

        // Draw delicate concentric dashed guideline rings around the cursor
        ctx.save();
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        for (let r = 0; r < RING_RADII.length - 1; r++) {
          const radius = RING_RADII[r];
          const fade = Math.max(0, 0.28 - r * 0.045);
          ctx.strokeStyle = `rgba(229, 215, 196, ${fade.toFixed(3)})`; // Sand Beige (#E5D7C4)
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        mouse.x += (-1000 - mouse.x) * 0.08;
        mouse.y += (-1000 - mouse.y) * 0.08;
      }

      const time = performance.now() * 0.001;
      const hubX = W * 0.5;
      const hubY = H * 0.90;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let inCursorCircle = false;

        // 1. Interactive Cursor Mode: Antigravity concentric circle formation
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distFromMouse = Math.hypot(dx, dy);

          if (distFromMouse < MAX_INFLUENCE_DIST) {
            inCursorCircle = true;

            // Find closest concentric ring
            let closestRing = RING_RADII[0];
            let minDiff = Math.abs(distFromMouse - closestRing);
            for (let r = 1; r < RING_RADII.length; r++) {
              const diff = Math.abs(distFromMouse - RING_RADII[r]);
              if (diff < minDiff) {
                minDiff = diff;
                closestRing = RING_RADII[r];
              }
            }

            const theta = Math.atan2(dy, dx);
            const targetX = mouse.x + Math.cos(theta) * closestRing;
            const targetY = mouse.y + Math.sin(theta) * closestRing;

            // Snappy snap force to quickly form clean circle
            const influence = Math.pow(1 - distFromMouse / MAX_INFLUENCE_DIST, 1.2);
            const snapForce = influence * 0.22;
            p.x += (targetX - p.x) * snapForce;
            p.y += (targetY - p.y) * snapForce;

            // Subtle orbital motion along the ring
            const orbitSpeed = (0.28 + (closestRing % 25) * 0.008) * influence;
            p.x += -Math.sin(theta) * orbitSpeed;
            p.y += Math.cos(theta) * orbitSpeed;

            // Align dash tangent to circle circumference
            const tangentAngle = theta + Math.PI / 2;
            let angleDiff = tangentAngle - p.strokeAngle;
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
            p.strokeAngle += angleDiff * (influence * 0.35 + 0.1);
          }
        }

        // 2. Idle Mode: Menyalurkan flow into the central hub wheel
        if (!inCursorCircle) {
          // Advance inward along radial fan toward central wheel
          p.dist -= p.speed;

          // When particle enters near the wheel, wrap back to outer fan
          if (p.dist < 80) {
            p.dist = 360 + Math.random() * 80;
            p.angle = Math.PI * (0.84 + Math.random() * 1.32);
          }

          const targetIdleX = hubX + Math.cos(p.angle) * p.dist;
          const targetIdleY = hubY + Math.sin(p.angle) * (p.dist * 0.65);

          // Smoothly drift toward idle trajectory
          p.x += (targetIdleX - p.x) * 0.08;
          p.y += (targetIdleY - p.y) * 0.08;

          // Align dash pointing inward toward wheel
          const inwardAngle = Math.atan2(hubY - p.y, hubX - p.x);
          let idleAngleDiff = inwardAngle - p.strokeAngle;
          idleAngleDiff = Math.atan2(Math.sin(idleAngleDiff), Math.cos(idleAngleDiff));
          p.strokeAngle += idleAngleDiff * 0.08;
        }

        // Shimmer alpha
        const pulse = Math.sin(time * 1.8 + p.pulsePhase) * 0.08;
        const finalAlpha = Math.max(
          0.2,
          Math.min(0.9, p.alpha + pulse + (inCursorCircle ? 0.22 : 0))
        );

        // Draw particle dash
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.strokeAngle);

        ctx.beginPath();
        ctx.moveTo(-p.len * 0.5, 0);
        ctx.lineTo(p.len * 0.5, 0);
        ctx.lineWidth = p.thick;
        ctx.strokeStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${finalAlpha.toFixed(3)})`;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 6 }}
      aria-hidden="true"
    />
  );
}
