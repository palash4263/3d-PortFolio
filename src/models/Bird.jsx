import birdScene from '../assets/3d/bird.glb'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

const Bird = () => {
  const birdRef = useRef()
  const { scene, animations } = useGLTF(birdScene)
  const { actions, names } = useAnimations(animations, birdRef)

  // Normalized pointer position (-1 to 1), updated on mouse move
  const pointer = useRef({ x: 0, y: 0 })

  // ✅ Play animation safely
  useEffect(() => {
    if (actions && names.length > 0) {
      actions[names[0]]?.play()
    }
  }, [actions, names])

  // ✅ Track mouse position across the whole window
  useEffect(() => {
    const handlePointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // ✅ Movement logic
  useFrame(({ clock }) => {
    if (!birdRef.current) return

    const t = clock.elapsedTime

    // Base flight path: a slow loop kept to the right half so it balances,
    // rather than overlaps, the left-aligned hero copy
    const baseX = 2 + ((t * 1.5) % 22)
    const baseY = 5 + Math.sin(t * 0.8) * 0.8
    const baseZ = Math.sin(t * 0.3) * 2

    // Mouse steers the bird within a soft range around its base path
    const mouseInfluenceX = pointer.current.x * 3
    const mouseInfluenceY = pointer.current.y * 2

    const targetX = baseX + mouseInfluenceX
    const targetY = baseY + mouseInfluenceY
    const targetZ = baseZ

    // Smoothly ease toward the target so movement feels fluid, not jumpy
    birdRef.current.position.x += (targetX - birdRef.current.position.x) * 0.05
    birdRef.current.position.y += (targetY - birdRef.current.position.y) * 0.05
    birdRef.current.position.z += (targetZ - birdRef.current.position.z) * 0.05

    // Bank/tilt toward the cursor for a sense of steering
    const targetRotationZ = -pointer.current.x * 0.3
    const targetRotationX = pointer.current.y * 0.15
    birdRef.current.rotation.z += (targetRotationZ - birdRef.current.rotation.z) * 0.05
    birdRef.current.rotation.x += (targetRotationX - birdRef.current.rotation.x) * 0.05
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