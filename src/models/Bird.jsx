import birdScene from '../assets/3d/bird.glb'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

const Bird = () => {
  const birdRef = useRef()
  const { scene, animations } = useGLTF(birdScene)
  const { actions, names } = useAnimations(animations, birdRef)

  // ✅ Play animation safely
  useEffect(() => {
    if (actions && names.length > 0) {
      actions[names[0]]?.play()
    }
  }, [actions, names])

  // ✅ Movement logic
useFrame(({ clock }) => {
  if (!birdRef.current) return

  const t = clock.elapsedTime

  // Start from top-left corner, fly across to top-right corner
  birdRef.current.position.x = -20 + (t * 2 % 40)  // moves left → right continuously
  birdRef.current.position.y = 8 + Math.sin(t * 0.8) * 0.5  // stays near top with slight bob
  birdRef.current.position.z = Math.sin(t * 0.3) * 2

  // Always face right since it moves left → right
  birdRef.current.rotation.y = 0
})

  return (
    <primitive
      ref={birdRef}
      object={scene}
      position={[-20, 2, 1]}
      scale={[0.01, 0.01, 0.01]}
    />
  )
}

export default Bird