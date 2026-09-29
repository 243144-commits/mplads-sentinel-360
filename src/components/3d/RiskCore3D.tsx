import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type CoreMode = 'DATA_CLUSTER' | 'ANOMALY_NETWORK' | 'EVIDENCE_ORB' | 'GEOSPATIAL_GRID' | 'TORUS_FLOW';

interface RiskCore3DProps {
  mode?: CoreMode;
  riskScore?: number; // 0 - 100
  size?: 'compact' | 'hero' | 'fullscreen';
  interactive?: boolean;
}

export const RiskCore3D: React.FC<RiskCore3DProps> = ({
  mode = 'DATA_CLUSTER',
  riskScore = 78,
  size = 'hero',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [currentModeState, setCurrentModeState] = useState<CoreMode>(mode);

  // Sync mode state
  useEffect(() => {
    setCurrentModeState(mode);
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId: number;

    // Core 3D objects
    let centralMesh: THREE.Mesh;
    let wireMesh: THREE.Mesh;
    let particlesMesh: THREE.Points;
    let innerOrb: THREE.Mesh;

    // Mouse coordinates with smooth damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    try {
      scene = new THREE.Scene();
      
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 400;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 7;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Controlled Intelligence Spectrum Colors:
      // Deep Navy / Electric Indigo (#4F46E5) / Violet (#7C3AED) / Magenta (#C026D3) / Cyan (#06B6D4) / Teal (#0D9488)
      const colorIndigo = new THREE.Color(0x4f46e5);
      const colorViolet = new THREE.Color(0x7c3aed);
      const colorMagenta = new THREE.Color(0xc026d3);
      const colorCyan = new THREE.Color(0x06b6d4);
      const colorTeal = new THREE.Color(0x0d9488);

      // Evaluate active color tint based on riskScore
      let primaryColor = colorIndigo;
      let secondaryColor = colorCyan;
      if (riskScore >= 80) {
        primaryColor = new THREE.Color(0xef4444); // Risk priority critical
        secondaryColor = colorMagenta;
      } else if (riskScore >= 60) {
        primaryColor = colorMagenta;
        secondaryColor = colorViolet;
      } else {
        primaryColor = colorTeal;
        secondaryColor = colorIndigo;
      }

      // Lights
      const ambientLight = new THREE.AmbientLight(0x0b0f19, 2.5);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(primaryColor, 4.0);
      keyLight.position.set(5, 5, 6);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(secondaryColor, 2.5);
      fillLight.position.set(-5, -3, 3);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(colorCyan, 3.0, 10);
      rimLight.position.set(0, 0, -4);
      scene.add(rimLight);

      // 1. Central Core Mesh (Icosahedron with subdivision for fluid deformation)
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 5);
      // Store original vertices for morphing
      const positionAttr = coreGeo.attributes.position;
      const originalPositions = new Float32Array(positionAttr.array);

      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x0c1222,
        roughness: 0.15,
        metalness: 0.7,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.4,
        ior: 1.45,
        wireframe: false,
        transparent: true,
        opacity: 0.88,
      });

      centralMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(centralMesh);

      // 2. Wireframe Lattice Layer (Neural Network / Anomaly Grid)
      const wireGeo = new THREE.IcosahedronGeometry(1.62, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: secondaryColor,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      wireMesh = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wireMesh);

      // 3. Inner Glowing Pulsing Orb (Evidence Nucleus)
      const innerGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const innerMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: 0.45,
      });
      innerOrb = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerOrb);

      // 4. Surrounding Intelligence Particles
      const particleCount = 280;
      const particleGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(particleCount * 3);
      const pColors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 2.4 + Math.random() * 1.5;

        pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pPositions[i * 3 + 2] = r * Math.cos(phi);

        // Mix between Electric Indigo and Cyan/Teal
        const mixRatio = Math.random();
        const c = new THREE.Color().lerpColors(colorIndigo, colorCyan, mixRatio);
        pColors[i * 3] = c.r;
        pColors[i * 3 + 1] = c.g;
        pColors[i * 3 + 2] = c.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particlesMesh);

      // Morphing State variables
      let time = 0;

      // Mouse listener
      const handleMouseMove = (e: MouseEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouse.targetX = (x - 0.5) * 2;
        mouse.targetY = -(y - 0.5) * 2;
      };

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);
      container.addEventListener('mousemove', handleMouseMove);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        time += 0.015;

        // Smooth cursor interpolation (damping)
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Parallax rotation
        centralMesh.rotation.y = time * 0.2 + mouse.x * 0.6;
        centralMesh.rotation.x = Math.sin(time * 0.15) * 0.2 + mouse.y * 0.4;

        wireMesh.rotation.y = -time * 0.25 + mouse.x * 0.4;
        wireMesh.rotation.z = time * 0.15;

        particlesMesh.rotation.y = time * 0.1;
        particlesMesh.rotation.x = -time * 0.05;

        // Morphing vertex dynamics based on mode
        const posArray = positionAttr.array as Float32Array;
        const count = positionAttr.count;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const ox = originalPositions[idx];
          const oy = originalPositions[idx + 1];
          const oz = originalPositions[idx + 2];

          // Compute distance from center
          const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);

          let displacement = 0;

          if (currentModeState === 'DATA_CLUSTER') {
            // Cluster frequency
            displacement = Math.sin(ox * 2.5 + time * 1.5) * Math.cos(oy * 2.5 + time * 1.2) * 0.18;
          } else if (currentModeState === 'ANOMALY_NETWORK') {
            // Angular sharp spikes
            const spike = Math.sin(ox * 4.0 + time * 2) * Math.sin(oz * 4.0 + time * 2);
            displacement = spike * (riskScore > 75 ? 0.35 : 0.2);
          } else if (currentModeState === 'EVIDENCE_ORB') {
            // Smooth liquid breathing
            displacement = Math.sin(dist * 3.0 - time * 2.5) * 0.12;
          } else if (currentModeState === 'GEOSPATIAL_GRID') {
            // Planar wave ripples
            displacement = Math.sin(ox * 3.0 + oz * 3.0 + time * 2.0) * 0.2;
          } else {
            // Torus flow
            displacement = Math.sin(oy * 4.0 + time * 3.0) * 0.15;
          }

          const scale = 1 + displacement;
          posArray[idx] = ox * scale;
          posArray[idx + 1] = oy * scale;
          posArray[idx + 2] = oz * scale;
        }

        positionAttr.needsUpdate = true;
        coreGeo.computeVertexNormals();

        // Inner orb pulse
        const pulse = 1 + Math.sin(time * 3) * 0.08;
        innerOrb.scale.set(pulse, pulse, pulse);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch {
      setWebGLFailed(true);
    }
  }, [currentModeState, riskScore, interactive]);

  const containerHeight = size === 'compact' ? 'h-48' : size === 'fullscreen' ? 'h-96' : 'h-80 md:h-[420px]';

  return (
    <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-hidden`}>
      {/* 3D Canvas Container */}
      {!webGLFailed && (
        <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Graceful 2D Fallback if WebGL unavailable */}
      {webGLFailed && (
        <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-900/60 via-purple-800/40 to-cyan-700/50 border border-indigo-500/30 flex items-center justify-center animate-pulse shadow-2xl shadow-indigo-950/60">
          <div className="w-24 h-24 rounded-full border border-cyan-400/40 animate-ping opacity-25" />
          <div className="absolute text-center text-xs font-mono text-cyan-300">
            SENTINEL CORE<br />ACTIVE
          </div>
        </div>
      )}

      {/* Mode Indicator & Morph Switcher Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-lg text-xs font-medium">
        {(['DATA_CLUSTER', 'ANOMALY_NETWORK', 'EVIDENCE_ORB', 'GEOSPATIAL_GRID'] as CoreMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setCurrentModeState(m)}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
              currentModeState === m
                ? 'bg-indigo-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {m === 'DATA_CLUSTER' && 'Data Cluster'}
            {m === 'ANOMALY_NETWORK' && 'Anomaly Net'}
            {m === 'EVIDENCE_ORB' && 'Evidence Orb'}
            {m === 'GEOSPATIAL_GRID' && 'Geo Grid'}
          </button>
        ))}
      </div>
    </div>
  );
};
