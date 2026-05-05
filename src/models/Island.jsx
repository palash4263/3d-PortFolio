import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/island.glb";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  position,
  scale,
  ...props
}) {
  const islandRef = useRef();
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const rotationAngle = useRef(0);

  const dampingFactor = 0.95;
  const autoRotationSpeed = 0.003; // ✅ constant (no error)

  const isRotatingRef = useRef(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

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
      if (!isRotatingRef.current || !islandRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;

      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      rotationAngle.current = islandRef.current.rotation.y;
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
    if (!islandRef.current) return;

    const time = state.clock.elapsedTime;

    const baseY = position?.[1] ?? -6.5;
    const baseX = position?.[0] ?? 0;
    const baseZ = position?.[2] ?? -43.4;

    // 🌊 Floating motion
    islandRef.current.position.y =
      baseY + Math.sin(time * 0.8) * 0.3;

    // ✨ subtle tilt
    islandRef.current.rotation.x = Math.sin(time * 0.4) * 0.05;
    islandRef.current.rotation.z = Math.cos(time * 0.4) * 0.05;

    // 🔄 Always rotate
    rotationAngle.current += autoRotationSpeed;

    // 🖱️ Add drag inertia
    rotationSpeed.current *= dampingFactor;
    if (Math.abs(rotationSpeed.current) < 0.0001) {
      rotationSpeed.current = 0;
    }
    rotationAngle.current += rotationSpeed.current;

    islandRef.current.rotation.y = rotationAngle.current;

    // 📍 Stage detection
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
      ref={islandRef}
      scale={scale}
      position={[
        position?.[0] ?? 0,
        position?.[1] ?? -6.5,
        position?.[2] ?? -43.4,
      ]}
      {...props}
    >
      <mesh geometry={nodes.polySurface944_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface945_tree1_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface946_tree2_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface947_tree1_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface948_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.polySurface949_tree_body_0.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.pCube11_rocks1_0.geometry} material={materials.PaletteMaterial001} />
    </group>
  );
}