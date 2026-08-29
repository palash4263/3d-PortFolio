import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Nebula({
  isRotating,
  setIsRotating,
  setCurrentStage,
  position,
  scale,
  ...props
}) {
  const groupRef = useRef();
  const particleGroupRef = useRef();
  const { gl, viewport } = useThree();

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const rotationAngle = useRef(0);

  const dampingFactor = 0.95;
  const autoRotationSpeed = 0.001;

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
      (position?.[1] ?? 0) + Math.sin(time * 0.5) * 0.5;

    // Subtle tilt
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.02;
    groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.02;

    // Auto rotation + drag inertia
    rotationAngle.current += autoRotationSpeed;
    rotationSpeed.current *= dampingFactor;
    if (Math.abs(rotationSpeed.current) < 0.0001) {
      rotationSpeed.current = 0;
    }
    rotationAngle.current += rotationSpeed.current;

    groupRef.current.rotation.y = rotationAngle.current;

    // Particle animation
    if (particleGroupRef.current) {
      particleGroupRef.current.children.forEach((particle, index) => {
        particle.position.y += Math.sin(time * 0.3 + index) * 0.001;
        particle.position.x += Math.cos(time * 0.2 + index) * 0.001;
        particle.material.opacity = 0.3 + Math.sin(time * 0.5 + index) * 0.2;
      });
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

  // Generate nebula particles
  const generateParticles = () => {
    const particles = [];

    // Cyan/Blue nebula cloud
    for (let i = 0; i < 40; i++) {
      particles.push(
        <mesh
          key={`cyan-${i}`}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.5 + 0.2, 8, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#0099ff"
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.8}
            transparent
            opacity={Math.random() * 0.4 + 0.2}
          />
        </mesh>
      );
    }

    // Magenta/Pink nebula cloud
    for (let i = 0; i < 35; i++) {
      particles.push(
        <mesh
          key={`magenta-${i}`}
          position={[
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9,
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.4 + 0.15, 8, 8]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff0099"
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.8}
            transparent
            opacity={Math.random() * 0.35 + 0.15}
          />
        </mesh>
      );
    }

    // Purple nebula cloud
    for (let i = 0; i < 30; i++) {
      particles.push(
        <mesh
          key={`purple-${i}`}
          position={[
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.35 + 0.15, 8, 8]} />
          <meshStandardMaterial
            color="#9900ff"
            emissive="#7700ff"
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.9}
            transparent
            opacity={Math.random() * 0.3 + 0.1}
          />
        </mesh>
      );
    }

    // Bright cyan center stars
    for (let i = 0; i < 15; i++) {
      particles.push(
        <mesh
          key={`stars-${i}`}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.15 + 0.05, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0}
            transparent
            opacity={0.9}
          />
        </mesh>
      );
    }

    return particles;
  };

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
      {/* Nebula Cloud Particles */}
      <group ref={particleGroupRef}>{generateParticles()}</group>

      {/* Outer glow rings */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[6, 0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[5.5, 0.25, 32, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff0099"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[5, 0.2, 32, 32]} />
        <meshStandardMaterial
          color="#9900ff"
          emissive="#7700ff"
          emissiveIntensity={0.35}
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
