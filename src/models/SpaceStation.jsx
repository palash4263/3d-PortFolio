import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function SpaceStation({
  isRotating,
  setIsRotating,
  setCurrentStage,
  position,
  scale,
  ...props
}) {
  const groupRef = useRef();
  const { gl, viewport } = useThree();

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const rotationAngle = useRef(0);

  const dampingFactor = 0.95;
  const autoRotationSpeed = 0.002;

  const isRotatingRef = useRef(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // Pointer/Touch event handling
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsRotating(true);
      lastX.current = e.touches ? e.touches[0].clientX : e.clientX;
    };

    const handlePointerUp = (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsRotating(false);

      let clientX =
        e.changedTouches && e.changedTouches.length > 0
          ? e.changedTouches[0].clientX
          : e.clientX;

      const delta = (clientX - lastX.current) / viewport.width;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    };

    const handlePointerMove = (e) => {
      if (!isRotatingRef.current || !groupRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;

      groupRef.current.rotation.y += delta * 0.01 * Math.PI;
      rotationAngle.current = groupRef.current.rotation.y;
      rotationSpeed.current = delta * 0.01 * Math.PI;

      lastX.current = clientX;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("touchstart", handlePointerDown);
    canvas.addEventListener("touchend", handlePointerUp);
    canvas.addEventListener("touchmove", handlePointerMove);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchend", handlePointerUp);
      canvas.removeEventListener("touchmove", handlePointerMove);
    };
  }, [gl, viewport, setIsRotating]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating motion
    groupRef.current.position.y =
      (position?.[1] ?? 0) + Math.sin(time * 0.6) * 0.4;

    // Subtle tilt
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.03;
    groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.03;

    // Auto rotation + drag inertia
    rotationAngle.current += autoRotationSpeed;
    rotationSpeed.current *= dampingFactor;
    if (Math.abs(rotationSpeed.current) < 0.0001) {
      rotationSpeed.current = 0;
    }
    rotationAngle.current += rotationSpeed.current;

    groupRef.current.rotation.y = rotationAngle.current;

    // Stage detection
    const normalized =
      ((rotationAngle.current % (2 * Math.PI)) + 2 * Math.PI) %
      (2 * Math.PI);

    switch (true) {
      case normalized >= 5.45 && normalized <= 5.85:
        setCurrentStage(4);
        break;
      case normalized >= 0.85 && normalized <= 1.3:
        setCurrentStage(3);
        break;
      case normalized >= 2.4 && normalized <= 2.6:
        setCurrentStage(2);
        break;
      case normalized >= 4.25 && normalized <= 4.75:
        setCurrentStage(1);
        break;
      default:
        setCurrentStage(null);
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={[
        position?.[0] ?? 0,
        position?.[1] ?? 0,
        position?.[2] ?? 0,
      ]}
      {...props}
    >
      {/* Crystalline Structure - Core */}
      {/* Central Diamond Crystal */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
          wireframe={false}
        />
      </mesh>

      {/* Inner Pyramid Crystals - 4 positions */}
      {[
        [1.2, 1.2, 1.2],
        [-1.2, 1.2, 1.2],
        [1.2, -1.2, -1.2],
        [-1.2, -1.2, -1.2],
      ].map((pos, i) => (
        <mesh key={`crystal-inner-${i}`} position={pos}>
          <tetrahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Outer Crystal Shards - 8 positions */}
      {[
        [2, 0, 0],
        [-2, 0, 0],
        [0, 2, 0],
        [0, -2, 0],
        [0, 0, 2],
        [0, 0, -2],
        [1.4, 1.4, 1.4],
        [-1.4, -1.4, -1.4],
      ].map((pos, i) => (
        <mesh key={`crystal-outer-${i}`} position={pos} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}>
          <coneGeometry args={[0.5, 1.2, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Core Connecting Rings */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff0099"
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.8, 0.15, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* First Rotating Ring - Horizontal */}
      <group rotation={[0, 0, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[4, 0.3, 32, 32]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.7}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Ring Segments */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`ring1-seg-${i}`} position={[4 * Math.cos((i * Math.PI) / 2), 0, 4 * Math.sin((i * Math.PI) / 2)]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff0055"
              emissiveIntensity={0.9}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Second Rotating Ring - Vertical */}
      <group rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[5, 0.25, 32, 32]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00dd44"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Ring Segments */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`ring2-seg-${i}`} position={[5 * Math.cos((i * Math.PI) / 2), 5 * Math.sin((i * Math.PI) / 2), 0]}>
            <octahedronGeometry args={[0.4]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff77"
              emissiveIntensity={0.8}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Third Rotating Ring - Tilted */}
      <group rotation={[0, 0, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[6, 0.2, 32, 32]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffaa00"
            emissiveIntensity={0.7}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Ring Segments */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`ring3-seg-${i}`} position={[6 * Math.cos((i * Math.PI * 2) / 5), 0, 6 * Math.sin((i * Math.PI * 2) / 5)]}>
            <icosahedronGeometry args={[0.35]} />
            <meshStandardMaterial
              color="#ffff00"
              emissive="#ffdd00"
              emissiveIntensity={0.9}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Solar Panels - Top */}
      {[0, 1].map((i) => (
        <mesh key={`panel-top-${i}`} position={[3 + i * 2, 3, 0]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[2, 4, 0.1]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#0077ff"
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Solar Panels - Bottom */}
      {[0, 1].map((i) => (
        <mesh key={`panel-bottom-${i}`} position={[3 + i * 2, -3, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[2, 4, 0.1]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#0077ff"
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Antenna Spires */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={`antenna-${i}`} position={[5 * Math.cos(angle), 0, 5 * Math.sin(angle)]}>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[0.2, 4, 16]} />
            <meshStandardMaterial
              color="#ff0088"
              emissive="#ff0055"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={1}
              metalness={1}
              roughness={0}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Glow Ring */}
      <mesh scale={[1.05, 1.05, 1.05]} position={[0, 0, 0]}>
        <torusGeometry args={[6.5, 0.1, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ff00"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
