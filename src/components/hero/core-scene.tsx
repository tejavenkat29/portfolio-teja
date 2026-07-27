"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The only WebGL on the site. It earns its place by doing something CSS can't:
 * a real wireframe solid with a depth-sorted point shell that reacts to the
 * pointer in 3D. Mounted lazily, only on capable pointer devices, and unmounted
 * whenever it scrolls out of view.
 */
function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }

  return positions;
}

function Core() {
  const shell = React.useRef<THREE.Mesh>(null);
  const inner = React.useRef<THREE.Mesh>(null);
  const cloud = React.useRef<THREE.Points>(null);
  const group = React.useRef<THREE.Group>(null);

  const pointPositions = React.useMemo(() => fibonacciSphere(420, 1.92), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    if (shell.current) {
      shell.current.rotation.y += dt * 0.16;
      shell.current.rotation.x = Math.sin(t * 0.22) * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.28;
      inner.current.rotation.z += dt * 0.06;
      const pulse = 1 + Math.sin(t * 1.15) * 0.035;
      inner.current.scale.setScalar(pulse);
    }
    if (cloud.current) {
      cloud.current.rotation.y -= dt * 0.05;
    }
    if (group.current) {
      // Ease toward the pointer instead of snapping — reads as weight.
      const targetY = state.pointer.x * 0.42;
      const targetX = -state.pointer.y * 0.3;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.045;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.045;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial color="#6366F1" wireframe transparent opacity={0.34} />
      </mesh>

      <mesh ref={inner}>
        <icosahedronGeometry args={[0.86, 0]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.16} />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial color="#00D9FF" transparent opacity={0.28} wireframe />
      </mesh>

      <points ref={cloud}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          color="#c7ccff"
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * WebGL can fail for reasons that have nothing to do with this code — hardware
 * acceleration switched off, a blocklisted driver, a privacy extension. When it
 * does, the scene disappears and the CSS orbits carry the composition. It never
 * surfaces as an unhandled error.
 */
class WebGLBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Intentionally silent: a decorative layer must never log noise at a visitor.
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function CoreScene() {
  // Phones run this at up to 3x native; capping keeps the fragment count in the
  // same ballpark as desktop. Read once at mount — the component is `ssr: false`,
  // and a resize past the breakpoint isn't worth re-creating the context for.
  const maxDpr = React.useRef(
    typeof window !== "undefined" && window.innerWidth < 768 ? 1.4 : 1.75,
  ).current;

  return (
    <WebGLBoundary>
      <Canvas
        dpr={[1, maxDpr]}
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0);
        }}
      >
        <Core />
      </Canvas>
    </WebGLBoundary>
  );
}
