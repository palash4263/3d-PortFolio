import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function DotwareDeveloper({
  isRotating,
  setIsRotating,
  setCurrentStage,
  position,
  scale,
  ...props
}) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const headRef = useRef();
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
      (position?.[1] ?? 0) + Math.sin(time * 0.6) * 0.3;

    // Auto rotation + drag inertia
    rotationAngle.current += autoRotationSpeed;
    rotationSpeed.current *= dampingFactor;
    if (Math.abs(rotationSpeed.current) < 0.0001) {
      rotationSpeed.current = 0;
    }
    rotationAngle.current += rotationSpeed.current;

    groupRef.current.rotation.y = rotationAngle.current;

    // Animate arms (typing motion)
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * 3) * 0.4 - 0.3;
      leftArmRef.current.rotation.z = -0.2;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(time * 3 + Math.PI) * 0.4 - 0.3;
      rightArmRef.current.rotation.z = 0.2;
    }

    // Animate legs (subtle swaying)
    if (leftLegRef.current) {
      leftLegRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    }

    if (rightLegRef.current) {
      rightLegRef.current.rotation.z = Math.sin(time * 1.5 + Math.PI) * 0.1;
    }

    // Head look around
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.15;
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }

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
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 0.7]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Dotted body pattern */}
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <mesh
            key={`dot-${i}-${j}`}
            position={[
              (i - 3.5) * 0.3,
              (j - 2.5) * 0.4,
              0.5,
            ]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))
      )}

      {/* Head */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.55]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
        <mesh position={[0.2, 0.1, 0.55]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00ffff"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.7, 0.8, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#0099ff"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Left Hand */}
        <mesh position={[0, -1.3, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.7, 0.8, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#0099ff"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Right Hand */}
        <mesh position={[0, -1.3, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.35, -1.3, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Left Foot */}
        <mesh position={[0, -1.2, 0.15]}>
          <boxGeometry args={[0.35, 0.2, 0.5]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.35, -1.3, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Right Foot */}
        <mesh position={[0, -1.2, 0.15]}>
          <boxGeometry args={[0.35, 0.2, 0.5]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Laptop */}
      <group position={[1.5, -0.5, -0.5]}>
        {/* Laptop Screen */}
        <mesh position={[0, 0.3, 0]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1, 0.7, 0.1]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Laptop Base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[1, 0.15, 0.4]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Code lines on screen */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`code-line-${i}`} position={[-0.4, 0.15 - i * 0.15, 0.08]}>
            <boxGeometry args={[0.7 - i * 0.1, 0.05, 0.02]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Aura Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.2, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
