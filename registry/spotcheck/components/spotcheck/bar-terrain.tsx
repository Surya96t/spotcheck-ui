"use client"

import * as React from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  BoxGeometry,
  Color,
  type InstancedMesh,
  MeshLambertMaterial,
  Object3D,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from "three"

import { GlStage } from "@/registry/spotcheck/components/spotcheck/gl-stage"
import { useGlPalette } from "@/registry/spotcheck/hooks/use-gl-palette"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const SPACING = 0.6
const BAR_WIDTH = 0.82
const POINTER_EASE = 0.1
const LIFT_EASE = 0.06
const PALETTE_TOKENS = ["--ink", "--wash", "--accent-ink"] as const
const CAMERA = { fov: 26, position: [12.5, 11, 13.5], near: 0.1, far: 200 } as const
const LOOK_AT: [number, number, number] = [0, 0.9, 0]

export type HeightSource = (col: number, row: number, time: number) => number

const defaultSource: HeightSource = (col, row, time) =>
  0.12 + 1.7 * Math.pow(0.5 + 0.5 * Math.sin(col * 0.36 + time * 0.8) * Math.cos(row * 0.47 - time * 0.55), 2.4)

type Pointer = { x: number; y: number; over: boolean }
type Palette = Record<(typeof PALETTE_TOKENS)[number], string>

type FieldProps = {
  cols: number
  rows: number
  source: HeightSource
  radius: number
  lift: number
  still: boolean
  palette: Palette | null
  pointer: React.RefObject<Pointer>
}

function Field({ cols, rows, source, radius, lift, still, palette, pointer }: FieldProps) {
  const mesh = React.useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)

  const [geometry, material] = React.useMemo(() => {
    const box = new BoxGeometry(SPACING * BAR_WIDTH, 1, SPACING * BAR_WIDTH)
    box.translate(0, 0.5, 0)
    return [box, new MeshLambertMaterial({ color: 0xffffff })] as const
  }, [])

  const scratch = React.useMemo(
    () => ({
      dummy: new Object3D(),
      color: new Color(),
      ink: new Color(),
      accent: new Color(),
      wash: new Color(),
      ray: new Raycaster(),
      ndc: new Vector2(),
      floor: new Plane(new Vector3(0, 1, 0), 0),
      hit: new Vector3(),
      bump: { x: 0, z: 0, target: { x: 0, z: 0 }, amount: 0, placed: false },
    }),
    [],
  )

  React.useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  React.useEffect(() => {
    if (!palette) return
    scratch.ink.set(palette["--ink"])
    scratch.accent.set(palette["--accent-ink"])
    scratch.wash.set(palette["--wash"])
    invalidate()
  }, [invalidate, palette, scratch])

  useFrame(({ camera, clock }) => {
    const bars = mesh.current
    if (!bars) return
    const { dummy, color, ink, accent, wash, ray, ndc, floor, hit, bump } = scratch
    const time = still ? 0 : clock.elapsedTime
    const over = pointer.current.over && !still

    if (over) {
      ndc.set(pointer.current.x, pointer.current.y)
      ray.setFromCamera(ndc, camera)
      if (ray.ray.intersectPlane(floor, hit)) {
        bump.target = { x: hit.x, z: hit.z }
        if (!bump.placed) Object.assign(bump, { x: hit.x, z: hit.z, placed: true })
      }
    }
    bump.x += (bump.target.x - bump.x) * POINTER_EASE
    bump.z += (bump.target.z - bump.z) * POINTER_EASE
    bump.amount += ((over ? 1 : 0) - bump.amount) * LIFT_EASE
    if (bump.amount < 0.001) bump.placed = false

    for (let col = 0, index = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++, index++) {
        const x = (col - (cols - 1) / 2) * SPACING
        const z = (row - (rows - 1) / 2) * SPACING
        const height = source(col, row, time)
        const distance = (x - bump.x) ** 2 + (z - bump.z) ** 2
        const raised = Math.exp(-distance / radius) * lift * bump.amount

        dummy.position.set(x, 0, z)
        dummy.scale.set(1, height + raised, 1)
        dummy.updateMatrix()
        bars.setMatrixAt(index, dummy.matrix)

        color.copy(wash).lerp(ink, Math.min(1, height / 1.5))
        if (raised > 0.25) color.lerp(accent, Math.min(1, raised / 1.8))
        bars.setColorAt(index, color)
      }
    }
    bars.instanceMatrix.needsUpdate = true
    if (bars.instanceColor) bars.instanceColor.needsUpdate = true
  })

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x555555, 1.2]} />
      <directionalLight position={[-5, 12, 6]} intensity={1.3} />
      <instancedMesh
        key={cols * rows}
        ref={mesh}
        args={[geometry, material, cols * rows]}
        frustumCulled={false}
      />
    </>
  )
}

type BarTerrainProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Bars along the long side. */
  cols?: number
  /** Bars along the short side. */
  rows?: number
  /** Height of a bar at a grid position and time in seconds. Pass it from a client component. */
  source?: HeightSource
  /** How wide the bump under the pointer spreads. */
  pointerRadius?: number
  /** How high the bump under the pointer rises. */
  pointerLift?: number
  /** Describes the data for screen readers. */
  label?: string
}

export function BarTerrain({
  cols = 30,
  rows = 16,
  source = defaultSource,
  pointerRadius = 1.6,
  pointerLift = 3.2,
  label = "3D bar field",
  className,
  ...props
}: BarTerrainProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const pointer = React.useRef<Pointer>({ x: 0, y: 0, over: false })
  const reduced = useReducedMotion()
  const palette = useGlPalette(host, PALETTE_TOKENS)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      over: true,
    }
  }

  return (
    <GlStage
      ref={host}
      label={label}
      camera={CAMERA}
      lookAt={LOOK_AT}
      className={cn("h-64 cursor-crosshair", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => (pointer.current.over = false)}
      {...props}
    >
      <Field
        cols={cols}
        rows={rows}
        source={source}
        radius={pointerRadius}
        lift={pointerLift}
        still={reduced}
        palette={palette}
        pointer={pointer}
      />
    </GlStage>
  )
}
