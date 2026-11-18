import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ShoeShowcase() {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Camera position for clear side-profile perspective
    camera.position.set(0, 0.15, 2.7);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. Crisp Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0fdfa, 2.0);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.5);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const bottomBounce = new THREE.DirectionalLight(0xffffff, 1.0);
    bottomBounce.position.set(0, -3, 1);
    scene.add(bottomBounce);

    // 3. Ground Soft Contact Shadow (Matching image floating shadow)
    const shadowGeo = new THREE.PlaneGeometry(2.6, 2.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.28)');
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
    shadowMesh.position.set(0, -0.62, 0);
    scene.add(shadowMesh);

    // 4. Load the 3D Shoe Model and Apply Beach Variant (Cyan Blue Sneaker)
    const shoeGroup = new THREE.Group();
    scene.add(shoeGroup);

    let shoeModel = null;

    // Base pose matching user's image: side profile, heel raised high, toe pointed slightly down
    const BASE_ROTATION_Y = -Math.PI / 2 + 0.12; // Side profile facing right
    const BASE_ROTATION_X = 0.20;                 // Slight top view tilt to see collar and laces
    const BASE_ROTATION_Z = -0.36;                // Heel (belakang) tilted significantly HIGHER than the toe (depan)

    let targetRotationY = BASE_ROTATION_Y;
    let targetRotationX = BASE_ROTATION_X;
    let currentRotationY = BASE_ROTATION_Y;
    let currentRotationX = BASE_ROTATION_X;

    const loader = new GLTFLoader();
    loader.load(
      '/models/shoe.glb',
      async (gltf) => {
        shoeModel = gltf.scene;

        // Apply "beach" material variant (material index 1: Vibrant Cyan Blue + White Sole)
        try {
          const beachMaterial = await gltf.parser.getDependency('material', 1);
          if (beachMaterial) {
            beachMaterial.roughness = 0.65;
            beachMaterial.metalness = 0.15;
            shoeModel.traverse((child) => {
              if (child.isMesh) {
                child.material = beachMaterial;
                child.material.needsUpdate = true;
              }
            });
          }
        } catch (e) {
          console.warn('Fallback variant assignment:', e);
        }

        // Center and scale model
        const box = new THREE.Box3().setFromObject(shoeModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.7 / maxDim;

        shoeModel.scale.setScalar(scale);
        shoeModel.position.x = -center.x * scale;
        shoeModel.position.y = -center.y * scale;
        shoeModel.position.z = -center.z * scale;

        // Set initial pose: heel elevated/tilted upwards
        shoeGroup.rotation.set(BASE_ROTATION_X, BASE_ROTATION_Y, BASE_ROTATION_Z);
        shoeGroup.add(shoeModel);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load shoe model:', err);
        setIsLoading(false);
      }
    );

    // 5. Scroll Interaction: Scrolling rotates the shoe 360 degrees smoothly
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      targetRotationY += delta * 0.008;
      targetRotationX += delta * 0.001;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Direct Wheel event over the shoe canvas
    const handleWheel = (e) => {
      const delta = e.deltaY || e.deltaX;
      targetRotationY += delta * 0.006;
    };
    mount.addEventListener('wheel', handleWheel, { passive: true });

    // 7. Interactive Drag to freely orbit & inspect the 3D shoe
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

    // 8. 60fps Render Loop with physical floating dampening
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp dampening
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      if (shoeGroup) {
        shoeGroup.rotation.y = currentRotationY;
        shoeGroup.rotation.x = currentRotationX;
        // Keep the heel tilted up dynamically (bagian belakang lebih tinggi dari depan)
        shoeGroup.rotation.z = BASE_ROTATION_Z + Math.sin(elapsedTime * 1.6) * 0.03;
        // Posisi sepatu agak ke atas
        shoeGroup.position.y = 0.22 + Math.sin(elapsedTime * 2.2) * 0.04;

        // Shadow scales with floating height
        shadowMesh.scale.setScalar(1 + shoeGroup.position.y * 0.4);
      }

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

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none pt-4 pb-8 overflow-visible">
      {/* ───────────────── PURE 3D WEBGL CANVAS (NO BOX, DIRECT ON CANVAS) ───────────────── */}
      <div
        ref={mountRef}
        className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing bg-transparent"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-slate-400">
            LOADING_3D_ASSET...
          </div>
        )}
      </div>

      {/* ───────────────── BRAND NAME ONLY: TALAKA ───────────────── */}
      <div className="relative z-20 flex flex-col items-center text-center -mt-4 sm:-mt-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.25em] text-slate-950 font-serif uppercase">
          TALAKA
        </h2>
      </div>
    </div>
  );
}
