// TreeWorld.jsx
import React, { useMemo } from 'react'
import { useControls } from 'leva'
import seedrandom from 'seedrandom'
import { Tree } from './Tree' // <- Import the updated Tree component

export default function TreeWorld({ camera }) {
  const { treeScale, seed, autoBillboard } = useControls('Tree World', {
    treeScale: { value: 0.35, min: 0.1, max: 2, step: 0.01 },
    seed: { value: 'hello123' },
    autoBillboard: { value: true }
  })

  const trees = useMemo(() => {
    const rng = seedrandom(seed)
    const count = 50
    const area = 10
    const results = []

    for (let i = 0; i < count; i++) {
      const x = (rng() - 0.5) * area
      const z = (rng() - 0.5) * area
      const y = 0
      const type = Math.round(rng()) // 0 or 1
      results.push({ position: [x, y, z], type })
    }

    return results
  }, [seed])

  return (
    <>
      {trees.map((tree, index) => (
        <Tree
          key={index}
          position={tree.position}
          scale={[treeScale, treeScale, treeScale]}
          camera={camera}
          autoBillboard={autoBillboard}
          type={tree.type}
        />
      ))}
    </>
  )
}
