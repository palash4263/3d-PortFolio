import { useEffect, useRef } from "react";
import planeScene from "../assets/3d/plane.glb";
import { useAnimations, useGLTF } from "@react-three/drei";

const Plane = (props) => {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions && actions["Take 001"]) {
      actions["Take 001"].play(); // ✅ always play animation
    }
  }, [actions]);

  return (
    <primitive
      ref={ref}
      object={scene}
      {...props}
    />
  );
};

export default Plane;