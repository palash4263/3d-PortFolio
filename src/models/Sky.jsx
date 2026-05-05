import { useGLTF } from "@react-three/drei"
import skyScene from '../assets/3d/sky.glb'
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

const Sky = ({ isRotating }) => {
  const { scene } = useGLTF(skyScene)
  const skyRef = useRef()

  useFrame((_, delta) => {
    if (isRotating && skyRef.current) {
      skyRef.current.rotation.y += 0.25 * delta
    }
  })

  return <primitive ref={skyRef} object={scene} />
}

export default Sky