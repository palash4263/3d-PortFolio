import workstationScene from '../assets/3d/workstation.glb'
import { useGLTF, Center, Resize } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

/**
 * Isometric desk/workstation for the hero.
 * Slowly rotates on its own and tilts toward the cursor.
 *
 * Model: "Computer desk" by Poly by Google (CC-BY) via poly.pizza
 *
 * GLB files ship in arbitrary units, so drei's <Resize> normalizes the model
 * to 1 world unit on its largest axis and <Center> puts its origin at the
 * middle. The outer group then scales that to `targetSize`, which keeps sizing
 * predictable if the model is ever swapped out.
 */
// Resting yaw: a three-quarter view reads better than face-on
const BASE_ANGLE_Y = -0.6
// Resting pitch: slight downward look, kept small so the desk stays level
const BASE_ANGLE_X = 0.05

// Meshes stripped from the GLB — backdrop plane and the two speakers
const HIDDEN_PARTS = new Set([
  'Box005',
  'Box003',
  'Box004',
  'GeoSphere001',
  'GeoSphere002',
])

const Workstation = ({ targetSize = 6, ...props }) => {
  const groupRef = useRef()
  const floatRef = useRef()
  const { scene } = useGLTF(workstationScene)

  // Normalized pointer position (-1 to 1)
  const pointer = useRef({ x: 0, y: 0 })

  // Hide parts of the source model we don't want on the page.
  // Mesh names are generic, so these were identified by their baked bounds:
  //   Box005       - 87x61 wall/backdrop plane, reads as a grey slab
  //   Box003/004   - left/right speaker panels
  //   GeoSphere001/002 - the matching speaker cones
  // Kept: Box001 (monitor), Line001 (desk), Box009 (keyboard)
  // GLTFLoader suffixes primitives (node "Box003" -> mesh "Box003_1"), so
  // strip a trailing _N before matching, and hide the node itself when it is
  // a group wrapping several primitives.
  useEffect(() => {
    scene.traverse((child) => {
      const baseName = child.name.replace(/_\d+$/, '')
      if (HIDDEN_PARTS.has(baseName)) {
        child.visible = false
      }
    })
  }, [scene])

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // Yaw-then-pitch. With the default 'XYZ' order, combining rotation.y and
  // rotation.x introduces an apparent roll that makes the model look tilted
  // sideways even with rotation.z untouched.
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.order = 'YXZ'
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const t = clock.elapsedTime

    // Held at a fixed three-quarter angle and swayed by the cursor within a
    // limited range — no continuous 360 spin
    const targetRotationY = BASE_ANGLE_Y + pointer.current.x * 0.35
    groupRef.current.rotation.y +=
      (targetRotationY - groupRef.current.rotation.y) * 0.05

    // Gentle tilt toward the cursor, held near level
    const targetRotationX = BASE_ANGLE_X - pointer.current.y * 0.1
    groupRef.current.rotation.x +=
      (targetRotationX - groupRef.current.rotation.x) * 0.05

    // Subtle float, applied to an inner group so the `position` prop on the
    // outer group is preserved
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(t * 0.6) * 0.15
    }
  })

  return (
    <group ref={groupRef} {...props}>
      <group ref={floatRef} scale={targetSize}>
        <Resize>
          <Center>
            <primitive object={scene} />
          </Center>
        </Resize>
      </group>
    </group>
  )
}

useGLTF.preload(workstationScene)

export default Workstation
