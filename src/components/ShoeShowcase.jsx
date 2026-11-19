import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SHOWCASE_ITEMS = [
  {
    id: 'shoe',
    label: 'Sepatu',
    title: 'Talaka Runner 3D',
    path: '/models/shoe.glb',
    targetSize: 1.7,
    baseRotX: 0.2,
    baseRotY: -Math.PI / 2 + 0.12,
    baseRotZ: -0.36,
    floatBaseY: 0.22,
    applyShoeVariant: true,
  },
  {
    id: 'tshirt',
    label: 'Kaos',
    title: 'Kaos Oversize 3D',
    path: '/models/tshirt.glb',
    targetSize: 1.65,
    baseRotX: 0.08,
    baseRotY: 0.22,
    baseRotZ: 0,
    floatBaseY: 0.1,
    applyShoeVariant: false,
  },
  {
    id: 'pants',
    label: 'Celana',
    title: 'Celana Talaka 3D',
    path: '/models/pants.glb',
    targetSize: 1.78,
    baseRotX: 0.06,
    baseRotY: -0.2,
    baseRotZ: 0,
    floatBaseY: 0.06,
    applyShoeVariant: false,
  },
];

export default function ShoeShowcase() {
  const mountRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const activeIndexRef = useRef(0);
  const switchModelFnRef = useRef(null);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  }, []);

  // Keyboard arrow support when not typing in an input/textarea
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext]);

  // Trigger model swap inside existing Three.js scene when activeIndex changes
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (switchModelFnRef.current) {
      switchModelFnRef.current(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let isDisposed = false;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 2.75);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    mount.appendChild(renderer.domElement);

    // 2. Crisp Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0fdfa, 2.0);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x9e7b66, 1.4);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const bottomBounce = new THREE.DirectionalLight(0xffffff, 1.0);
    bottomBounce.position.set(0, -3, 1);
    scene.add(bottomBounce);

    // 3. Soft Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.26)');
    grad.addColorStop(0.45, 'rgba(15, 23, 42, 0.08)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.78, 0);
    scene.add(shadowMesh);

    // 4. Model Container & Cache
    const showcaseGroup = new THREE.Group();
    scene.add(showcaseGroup);

    const modelCache = new Map();
    const loader = new GLTFLoader();

    let activeCfg = SHOWCASE_ITEMS[0];
    let targetRotationY = activeCfg.baseRotY;
    let targetRotationX = activeCfg.baseRotX;
    let currentRotationY = activeCfg.baseRotY;
    let currentRotationX = activeCfg.baseRotX;
    let currentRotZ = activeCfg.baseRotZ;
    let currentBaseY = activeCfg.floatBaseY;
    let currentScaleAnim = 1;
    let loadSeq = 0;

    const showPreparedModel = (modelObj, cfg) => {
      // Hide all cached models first
      modelCache.forEach((cached) => {
        cached.visible = false;
      });
      modelObj.visible = true;
      if (modelObj.parent !== showcaseGroup) {
        showcaseGroup.add(modelObj);
      }

      activeCfg = cfg;
      targetRotationY = cfg.baseRotY;
      targetRotationX = cfg.baseRotX;
      currentRotationY = cfg.baseRotY - 0.45;
      currentRotationX = cfg.baseRotX;
      currentScaleAnim = 0.72;
      setIsLoading(false);
    };

    const loadAndSwitch = (index) => {
      const cfg = SHOWCASE_ITEMS[index] || SHOWCASE_ITEMS[0];
      const seq = ++loadSeq;

      if (modelCache.has(cfg.id)) {
        showPreparedModel(modelCache.get(cfg.id), cfg);
        return;
      }

      setIsLoading(true);
      loader.load(
        cfg.path,
        async (gltf) => {
          if (isDisposed) return;
          const root = gltf.scene;

          if (cfg.applyShoeVariant) {
            try {
              const beachMaterial = await gltf.parser.getDependency('material', 1);
              if (beachMaterial) {
                beachMaterial.roughness = 0.65;
                beachMaterial.metalness = 0.15;
                root.traverse((child) => {
                  if (child.isMesh) {
                    child.material = beachMaterial;
                    child.material.needsUpdate = true;
                  }
                });
              }
            } catch (e) {
              console.warn('Fallback variant assignment:', e);
            }
          } else {
            root.traverse((child) => {
              if (child.isMesh || child.isSkinnedMesh) {
                child.frustumCulled = false;
                const mats = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                mats.forEach((m) => {
                  if (!m) return;
                  m.side = THREE.DoubleSide;
                  if ('roughness' in m && m.roughness < 0.75) {
                    m.roughness = 0.85;
                  }
                  if ('metalness' in m && m.metalness > 0.1) {
                    m.metalness = 0.05;
                  }
                  m.needsUpdate = true;
                });
              }
            });
          }

          root.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(root);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = cfg.targetSize / maxDim;

          // Wrap inside a clean pivot group so centering & scaling never conflict
          const pivot = new THREE.Group();
          root.scale.setScalar(scale);
          root.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          );
          pivot.add(root);
          pivot.visible = false;
          showcaseGroup.add(pivot);
          modelCache.set(cfg.id, pivot);

          if (seq === loadSeq && activeIndexRef.current === index) {
            showPreparedModel(pivot, cfg);
          }
        },
        undefined,
        (err) => {
          console.error(`Failed to load 3D model ${cfg.path}:`, err);
          if (seq === loadSeq) setIsLoading(false);
        }
      );
    };

    switchModelFnRef.current = loadAndSwitch;
    loadAndSwitch(activeIndexRef.current);

    // 5. Scroll Interaction
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      targetRotationY += delta * 0.008;
      targetRotationX += delta * 0.001;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Direct Wheel Event over 3D Canvas
    const handleWheel = (e) => {
      const delta = e.deltaY || e.deltaX;
      targetRotationY += delta * 0.006;
    };
    mount.addEventListener('wheel', handleWheel, { passive: true });

    // 7. Interactive Drag to Orbit 360°
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      targetRotationY += deltaX * 0.009;
      targetRotationX += deltaY * 0.005;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 8. 60fps Render Loop with Smooth Transitions & Floating Motion
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentRotationY += (targetRotationY - currentRotationY) * 0.09;
      currentRotationX += (targetRotationX - currentRotationX) * 0.09;
      currentRotZ += (activeCfg.baseRotZ - currentRotZ) * 0.1;
      currentBaseY += (activeCfg.floatBaseY - currentBaseY) * 0.1;
      currentScaleAnim += (1 - currentScaleAnim) * 0.12;

      showcaseGroup.scale.setScalar(currentScaleAnim);
      showcaseGroup.rotation.y = currentRotationY;
      showcaseGroup.rotation.x = currentRotationX;
      showcaseGroup.rotation.z = currentRotZ + Math.sin(elapsedTime * 1.6) * 0.025;
      showcaseGroup.position.y = currentBaseY + Math.sin(elapsedTime * 2.2) * 0.04;

      shadowMesh.scale.setScalar(
        Math.max(0.7, 0.95 + showcaseGroup.position.y * 0.35) * currentScaleAnim
      );

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      switchModelFnRef.current = null;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('wheel', handleWheel);
      mount.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentItem = SHOWCASE_ITEMS[activeIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none pt-4 pb-8 overflow-visible">
      {/* ───────────────── 3D WEBGL STAGE WITH LEFT / RIGHT ARROWS ───────────────── */}
      <div className="relative w-full flex items-center justify-center">
        {/* Prev Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Produk 3D sebelumnya"
          className="absolute left-2 sm:left-6 z-30 h-11 w-11 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md text-slate-800 shadow-md hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* WebGL Mount */}
        <div
          ref={mountRef}
          className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing bg-transparent"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="rounded-full border border-slate-200 bg-white/90 px-4 py-1.5 font-mono text-xs font-semibold text-slate-600 shadow-xs">
                LOADING_{currentItem.id.toUpperCase()}_3D...
              </span>
            </div>
          )}
        </div>

        {/* Next Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Produk 3D berikutnya"
          className="absolute right-2 sm:right-6 z-30 h-11 w-11 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md text-slate-800 shadow-md hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ───────────────── BRAND NAME & 3D MODEL SWITCHER PILLS ───────────────── */}
      <div className="relative z-20 flex flex-col items-center text-center -mt-4 sm:-mt-6 space-y-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.25em] text-slate-950 font-serif uppercase">
          TALAKA
        </h2>

        {/* Interactive Switcher Bar */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md p-1.5 shadow-sm">
          {SHOWCASE_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
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

        <p className="text-[11px] font-mono text-slate-400">
          {currentItem.title.toUpperCase()} · DRAG 360° ATAU KLIK PANAH ‹ ›
        </p>
      </div>
    </div>
  );
}
