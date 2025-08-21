// Tree.jsx
import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export function Tree({ position, scale, camera, autoBillboard, type }) {
  const tree0 = useGLTF('models/tree.glb')
  const tree1 = useGLTF('models/tree1.glb')

  const ref = useRef()

  useFrame(() => {
    if (autoBillboard && camera && ref.current) {
      ref.current.lookAt(camera.position)
    }
  })

  const nodes = type === 0 ? tree0.nodes : tree1.nodes
  const materials = type === 0 ? tree0.materials : tree1.materials

  return (
    <group ref={ref} position={position} scale={scale} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={materials['Material.001']}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('models/tree.glb')
useGLTF.preload('models/tree1.glb')
