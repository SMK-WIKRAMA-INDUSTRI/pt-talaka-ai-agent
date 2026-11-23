import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';

const SHOWCASE_ITEMS = [
  {
    id: 'shoe',
    label: 'Sepatu',
    title: 'Talaka Runner 3D',
    subtitle: 'Signature Streetwear Footwear · Rp 649.000',
    path: '/models/shoe.glb',
    targetSize: 1.72,
    baseRotX: 0.18,
    baseRotY: -Math.PI / 2 + 0.16,
    baseRotZ: -0.32,
    floatBaseY: 0.12,
    applyShoeVariant: true,
    isJacket: false,
    isPants: false,
  },
  {
    id: 'jacket',
    label: 'Jaket',
    title: 'Talaka Studio Jacket 3D',
    subtitle: 'Structured Outerwear · Metal Hardware · Rp 489.000',
    path: '/models/jacket.glb',
    targetSize: 1.92,
    baseRotX: 0.08,
    baseRotY: 0.24,
    baseRotZ: -0.04,
    floatBaseY: 0.06,
    applyShoeVariant: false,
    isJacket: true,
    isPants: false,
  },
  {
    id: 'pants',
    label: 'Celana',
    title: 'Talaka Relaxed Denim 3D',
    subtitle: 'Editorial Tailored Fit · Dynamic Drape · Rp 349.000',
    path: '/models/pants.glb',
    targetSize: 1.82,
    baseRotX: 0.06,
    baseRotY: -0.26,
    baseRotZ: 0.03,
    floatBaseY: 0.02,
    applyShoeVariant: false,
    isJacket: false,
    isPants: true,
  },
];

// Maps item index relative to activeIndex: 0 = center, -1 = left back, +1 = right back
function getRelativeSlot(index, activeIndex, total) {
  const diff = (index - activeIndex + total) % total;
  if (diff === 0) return 0; // Center (Front Active)
  if (diff === 1) return 1; // Right Back
  return -1; // Left Back
}

export default function ShoeShowcase() {
  const stageRef = useRef(null);
  const slotRefs = useRef([]);
  const canvasRefs = useRef([]);
  const captionRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [loadedCount, setLoadedCount] = useState(0);

  const activeIndexRef = useRef(0);
  const hasMountedSlotsRef = useRef(false);
  const modelStatesRef = useRef(
    SHOWCASE_ITEMS.map((cfg, idx) => ({
      cfg,
      pivot: null,
      bones: null,
      targetRotY: cfg.baseRotY,
      targetRotX: cfg.baseRotX,
      currentRotY: cfg.baseRotY,
      currentRotX: cfg.baseRotX,
      currentRotZ: cfg.baseRotZ,
      spinOffsetY: 0,
      phase: idx * 2.1,
    }))
  );

  // Smooth GSAP orbital switch handler
  const handleSelectItem = useCallback((nextIdx) => {
    if (nextIdx === activeIndexRef.current) return;
    const prevIdx = activeIndexRef.current;
    const total = SHOWCASE_ITEMS.length;
    const rel = getRelativeSlot(nextIdx, prevIdx, total); // -1 (from left) or +1 (from right)

    // Give the incoming item a graceful 3D rotational flourish via GSAP
    const incomingState = modelStatesRef.current[nextIdx];
    if (incomingState) {
      incomingState.targetRotY = incomingState.cfg.baseRotY;
      incomingState.targetRotX = incomingState.cfg.baseRotX;
      gsap.fromTo(
        incomingState,
        { spinOffsetY: rel > 0 ? -0.85 : 0.85 },
        { spinOffsetY: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' }
      );
    }

    // Gently settle outgoing item back to its studio angle
    const outgoingState = modelStatesRef.current[prevIdx];
    if (outgoingState) {
      outgoingState.targetRotY = outgoingState.cfg.baseRotY;
      outgoingState.targetRotX = outgoingState.cfg.baseRotX;
    }

    setHoveredIdx(null);
    setActiveIndex(nextIdx);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') {
        handleSelectItem(
          (activeIndexRef.current - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length
        );
      }
      if (e.key === 'ArrowRight') {
        handleSelectItem((activeIndexRef.current + 1) % SHOWCASE_ITEMS.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSelectItem]);

  // GSAP Depth-Carousel Layout & Transition Animation
  const updateCarouselLayout = useCallback((idx, instant = false) => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageW = stage.clientWidth || 960;
    const isCompact = stageW < 640;
    const sideOffset = isCompact ? stageW * 0.36 : Math.min(stageW * 0.37, 415);
    const sideScale = isCompact ? 0.33 : 0.39;
    const sideY = isCompact ? -30 : -48;
    const sideBlur = isCompact ? 'blur(5px)' : 'blur(6.5px)';

    SHOWCASE_ITEMS.forEach((_, i) => {
      const el = slotRefs.current[i];
      if (!el) return;

      const slot = getRelativeSlot(i, idx, SHOWCASE_ITEMS.length);
      let target;

      if (slot === 0) {
        target = {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          zIndex: 30,
        };
      } else if (slot === -1) {
        target = {
          xPercent: -50,
          yPercent: -50,
          x: -sideOffset,
          y: sideY,
          scale: sideScale,
          opacity: 0.46,
          filter: sideBlur,
          zIndex: 12,
        };
      } else {
        target = {
          xPercent: -50,
          yPercent: -50,
          x: sideOffset,
          y: sideY,
          scale: sideScale,
          opacity: 0.46,
          filter: sideBlur,
          zIndex: 12,
        };
      }

      if (instant) {
        gsap.set(el, target);
      } else {
        gsap.to(el, {
          ...target,
          duration: 0.85,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
      }
    });
  }, []);

  // Trigger GSAP layout morph + caption fade when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const instant = !hasMountedSlotsRef.current;
    hasMountedSlotsRef.current = true;
    updateCarouselLayout(activeIndex, instant);

    if (!instant && captionRef.current) {
      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out', overwrite: 'auto' }
      );
    }
  }, [activeIndex, updateCarouselLayout]);

  // Keep layout responsive on resize
  useEffect(() => {
    const onResize = () => updateCarouselLayout(activeIndexRef.current, true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateCarouselLayout]);

  // Smooth GSAP hover preview for distant background 3D assets
  const handleSlotEnter = (i) => {
    if (i === activeIndexRef.current) return;
    setHoveredIdx(i);
    const el = slotRefs.current[i];
    if (!el) return;
    const stageW = stageRef.current?.clientWidth || 960;
    const hoverScale = stageW < 640 ? 0.40 : 0.48;
    gsap.to(el, {
      scale: hoverScale,
      opacity: 0.88,
      filter: 'blur(1.5px)',
      y: stageW < 640 ? -36 : -56,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleSlotLeave = (i) => {
    if (i === activeIndexRef.current) return;
    setHoveredIdx((prev) => (prev === i ? null : prev));
    const el = slotRefs.current[i];
    if (!el) return;
    const stageW = stageRef.current?.clientWidth || 960;
    const isCompact = stageW < 640;
    gsap.to(el, {
      scale: isCompact ? 0.33 : 0.39,
      opacity: 0.46,
      filter: isCompact ? 'blur(5px)' : 'blur(6.5px)',
      y: isCompact ? -30 : -48,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  // Single Shared Offscreen Three.js WebGL Studio Renderer → 3 Dedicated 2D Canvases
  useEffect(() => {
    let isDisposed = false;
    let isVisibleInViewport = true;

    const RENDER_SIZE = 580;

    // 1. Offscreen WebGLRenderer (Single GPU Context!)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(RENDER_SIZE, RENDER_SIZE, false);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;

    // Studio Environment Map (makes metallic jacket zippers, clasps & sneaker accents gleam!)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const scene = new THREE.Scene();
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.12, 3.05);

    // 2. Crisp Studio 5-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 5, 4.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 1.45);
    fillLight.position.set(-4, 2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc8a288, 1.35);
    rimLight.position.set(0, 3.5, -4);
    scene.add(rimLight);

    const bottomBounce = new THREE.DirectionalLight(0xffffff, 0.75);
    bottomBounce.position.set(0, -3.5, 1.2);
    scene.add(bottomBounce);

    // 3. Load All 3 High-Detail 3D Models Concurrently
    const loader = new GLTFLoader();
    const states = modelStatesRef.current;

    SHOWCASE_ITEMS.forEach((cfg, idx) => {
      loader.load(
        cfg.path,
        async (gltf) => {
          if (isDisposed) return;
          const root = gltf.scene;
          const state = states[idx];

          if (cfg.applyShoeVariant) {
            try {
              const beachMaterial = await gltf.parser.getDependency('material', 1);
              if (beachMaterial) {
                beachMaterial.roughness = 0.58;
                beachMaterial.metalness = 0.14;
                root.traverse((child) => {
                  if (child.isMesh) {
                    child.material = beachMaterial;
                    child.material.needsUpdate = true;
                  }
                });
              }
            } catch (e) {
              console.warn('Fallback shoe material:', e);
            }
          } else if (cfg.isJacket) {
            // Preserve PBR metallic/roughness maps for zipper & metal clasps
            root.traverse((child) => {
              if (child.isMesh) {
                child.frustumCulled = false;
                const mats = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                mats.forEach((m) => {
                  if (!m) return;
                  m.side = THREE.DoubleSide;
                  if ('envMapIntensity' in m) {
                    m.envMapIntensity = 1.15;
                  }
                  m.needsUpdate = true;
                });
              }
            });
          } else if (cfg.isPants) {
            // Capture skeleton bones so we can animate a natural editorial stride (no stiff T-pose!)
            const boneMap = {};
            root.traverse((child) => {
              if (
                child.isBone &&
                /pelvis|thigh_l|thigh_r|calf_l|calf_r|foot_l|foot_r/i.test(child.name)
              ) {
                boneMap[child.name] = {
                  bone: child,
                  restQuat: child.quaternion.clone(),
                };
              }
              if (child.isMesh || child.isSkinnedMesh) {
                child.frustumCulled = false;
                const mats = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                mats.forEach((m) => {
                  if (!m) return;
                  m.side = THREE.DoubleSide;
                  // Enrich denim tone & tactile normal weave
                  if (m.color) {
                    m.color.set('#3d5e8a');
                  }
                  if (m.normalScale) {
                    m.normalScale.set(1.2, 1.2);
                  }
                  if ('roughness' in m) m.roughness = 0.82;
                  if ('metalness' in m) m.metalness = 0.04;
                  if ('envMapIntensity' in m) m.envMapIntensity = 0.85;
                  m.needsUpdate = true;
                });
              }
            });
            state.bones = boneMap;
          }

          root.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(root);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = cfg.targetSize / maxDim;

          const pivot = new THREE.Group();
          root.scale.setScalar(scale);
          root.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          );
          pivot.add(root);
          pivot.visible = false;
          scene.add(pivot);

          state.pivot = pivot;
          setLoadedCount((c) => c + 1);
        },
        undefined,
        (err) => {
          console.error(`Failed to load 3D model ${cfg.path}:`, err);
        }
      );
    });

    // 5. Pause WebGL when off-screen for zero idle GPU cost
    let observer;
    if (stageRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleInViewport = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(stageRef.current);
    }

    // 5. Scroll Interaction — Center 3D asset smoothly rotates as the user scrolls the page
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      const activeState = states[activeIndexRef.current];
      if (activeState) {
        activeState.targetRotY += delta * 0.0085;
        activeState.targetRotX = THREE.MathUtils.clamp(
          activeState.targetRotX + delta * 0.0009,
          -0.55,
          0.55
        );
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Interactive 360° Drag on the Active Center 3D Model
    let isDragging = false;
    let dragMoved = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      // Only start drag when clicking on the active center slot
      const activeSlotEl = slotRefs.current[activeIndexRef.current];
      if (!activeSlotEl || !activeSlotEl.contains(e.target)) return;
      isDragging = true;
      dragMoved = false;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved = true;

      const activeState = states[activeIndexRef.current];
      if (activeState) {
        activeState.targetRotY += dx * 0.011;
        activeState.targetRotX = THREE.MathUtils.clamp(
          activeState.targetRotX + dy * 0.006,
          -0.65,
          0.65
        );
      }
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      if (dragMoved) {
        // Prevent accidental click right after dragging
        setTimeout(() => {
          dragMoved = false;
        }, 50);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Reusable quaternions/axes for smooth skeletal animation (zero GC allocations per frame!)
    const axisX = new THREE.Vector3(1, 0, 0);
    const axisY = new THREE.Vector3(0, 1, 0);
    const axisZ = new THREE.Vector3(0, 0, 1);
    const qTemp = new THREE.Quaternion();
    const qTemp2 = new THREE.Quaternion();

    // 7. 60fps Multi-Pass Render Loop (renders each model smoothly into its own canvas)
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisibleInViewport) return;

      const t = clock.getElapsedTime();

      for (let i = 0; i < states.length; i++) {
        const st = states[i];
        const canvas = canvasRefs.current[i];
        if (!st.pivot || !canvas) continue;

        const isActive = i === activeIndexRef.current;

        // Smooth idle organic sway & gentle turntable breathing (never stiff!)
        const idleRotY = isActive
          ? Math.sin(t * 0.65 + st.phase) * 0.14
          : Math.sin(t * 0.55 + st.phase) * 0.28;
        const idleRotX = Math.cos(t * 0.8 + st.phase) * 0.045;
        const idleRotZ = Math.sin(t * 1.15 + st.phase) * 0.032;
        const floatY = Math.sin(t * 1.65 + st.phase) * 0.055;

        // Smooth exponential damping for silky rotation
        const desiredY = st.targetRotY + st.spinOffsetY + idleRotY;
        const desiredX = st.targetRotX + idleRotX;
        st.currentRotY += (desiredY - st.currentRotY) * 0.085;
        st.currentRotX += (desiredX - st.currentRotX) * 0.085;
        st.currentRotZ += (st.cfg.baseRotZ + idleRotZ - st.currentRotZ) * 0.09;

        st.pivot.rotation.set(st.currentRotX, st.currentRotY, st.currentRotZ);
        st.pivot.position.set(0, st.cfg.floatBaseY + floatY, 0);

        // Organic floating garment sway for Jacket (soft aerodynamic breathing)
        if (st.cfg.isJacket) {
          const breath = 1 + Math.sin(t * 1.8 + st.phase) * 0.012;
          st.pivot.scale.set(breath, 1 / Math.sqrt(breath), breath);
        }

        // Dynamic editorial runway stride animation for Pants skeleton (eliminates T-pose stiffness!)
        if (st.cfg.isPants && st.bones) {
          const stride = Math.sin(t * 1.25);
          const lagStride = Math.sin(t * 1.25 - 0.65);

          if (st.bones.pelvis) {
            qTemp.setFromAxisAngle(axisY, stride * 0.07);
            qTemp2.setFromAxisAngle(axisZ, Math.cos(t * 1.25) * 0.035);
            st.bones.pelvis.bone.quaternion
              .copy(st.bones.pelvis.restQuat)
              .multiply(qTemp)
              .multiply(qTemp2);
          }
          if (st.bones.thigh_l) {
            // Negative X swings thigh forward naturally
            qTemp.setFromAxisAngle(axisX, -0.26 - stride * 0.14);
            qTemp2.setFromAxisAngle(axisZ, 0.05);
            st.bones.thigh_l.bone.quaternion
              .copy(st.bones.thigh_l.restQuat)
              .multiply(qTemp)
              .multiply(qTemp2);
          }
          if (st.bones.calf_l) {
            // Positive X bends knee naturally backward
            qTemp.setFromAxisAngle(axisX, 0.34 + lagStride * 0.15);
            st.bones.calf_l.bone.quaternion
              .copy(st.bones.calf_l.restQuat)
              .multiply(qTemp);
          }
          if (st.bones.thigh_r) {
            qTemp.setFromAxisAngle(axisX, 0.16 + stride * 0.14);
            qTemp2.setFromAxisAngle(axisZ, -0.05);
            st.bones.thigh_r.bone.quaternion
              .copy(st.bones.thigh_r.restQuat)
              .multiply(qTemp)
              .multiply(qTemp2);
          }
          if (st.bones.calf_r) {
            qTemp.setFromAxisAngle(axisX, 0.24 - lagStride * 0.12);
            st.bones.calf_r.bone.quaternion
              .copy(st.bones.calf_r.restQuat)
              .multiply(qTemp);
          }
        }

        // Render isolated pass for this item
        st.pivot.visible = true;
        renderer.render(scene, camera);

        const ctx2d = canvas.getContext('2d');
        if (ctx2d) {
          if (canvas.width !== RENDER_SIZE || canvas.height !== RENDER_SIZE) {
            canvas.width = RENDER_SIZE;
            canvas.height = RENDER_SIZE;
          }
          ctx2d.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE);
          ctx2d.drawImage(renderer.domElement, 0, 0, RENDER_SIZE, RENDER_SIZE);
        }

        st.pivot.visible = false;
      }
    };
    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      pmrem.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  const currentItem = SHOWCASE_ITEMS[activeIndex];
  const isAllLoaded = loadedCount >= SHOWCASE_ITEMS.length;

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center select-none pt-2 pb-10 overflow-visible">
      {/* ───────────────── 3D DEPTH-CAROUSEL STAGE (CLICK BACKGROUND ASSETS TO SWITCH) ───────────────── */}
      <div
        ref={stageRef}
        className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] overflow-visible"
      >
        {!isAllLoaded && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <span className="rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md px-4 py-1.5 font-mono text-xs font-semibold text-slate-600 shadow-xs">
              LOADING_3D_COLLECTION ({loadedCount}/{SHOWCASE_ITEMS.length})...
            </span>
          </div>
        )}

        {SHOWCASE_ITEMS.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.id}
              ref={(el) => {
                slotRefs.current[idx] = el;
              }}
              role={isActive ? undefined : 'button'}
              tabIndex={isActive ? -1 : 0}
              aria-label={isActive ? item.title : `Tukar ke ${item.label}`}
              onClick={() => {
                if (!isActive) handleSelectItem(idx);
              }}
              onKeyDown={(e) => {
                if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelectItem(idx);
                }
              }}
              onMouseEnter={() => handleSlotEnter(idx)}
              onMouseLeave={() => handleSlotLeave(idx)}
              className={`absolute left-1/2 top-1/2 w-[310px] h-[310px] sm:w-[410px] sm:h-[410px] md:w-[470px] md:h-[470px] flex items-center justify-center will-change-transform ${
                isActive
                  ? 'cursor-grab active:cursor-grabbing'
                  : 'cursor-pointer'
              }`}
            >
              <canvas
                ref={(el) => {
                  canvasRefs.current[idx] = el;
                }}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Subtle floating label on hover for clickable background assets */}
              {!isActive && (
                <div
                  className={`pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold text-slate-800 shadow-md transition-all duration-300 whitespace-nowrap ${
                    isHovered
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                  }`}
                >
                  Klik · {item.label}
                </div>
              )}
            </div>
          );
        })}

        {/* Soft diffused ground shadow underneath active center asset (never clips like a hard box!) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 z-20 w-52 sm:w-64 h-7 rounded-full bg-slate-900/12 blur-2xl"
        />
      </div>

      {/* ───────────────── EDITORIAL BRAND CAPTION & MODEL PILLS ───────────────── */}
      <div className="relative z-20 flex flex-col items-center text-center -mt-6 sm:-mt-8 space-y-3.5">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.25em] text-slate-950 font-serif uppercase">
          TALAKA
        </h2>

        <div ref={captionRef} className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {currentItem.title}
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            {currentItem.subtitle}
          </p>
        </div>

        {/* Interactive Switcher Pills */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 shadow-sm">
          {SHOWCASE_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(idx)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="text-[10.5px] font-mono text-slate-400">
          DRAG 360° PADA PRODUK UTAMA · KLIK ASSET DI BELAKANG UNTUK TUKAR
        </p>
      </div>
    </div>
  );
}
