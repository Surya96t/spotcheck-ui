"use client"

import * as React from "react"
import { Canvas, useThree, type CanvasProps } from "@react-three/fiber"

import { useInView } from "@/registry/spotcheck/hooks/use-in-view"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

// The gap between the two stops a canvas being rebuilt by small scrolls near one edge.
const NEAR_MARGIN = "300px"
const FAR_MARGIN = "900px"

let webGlAvailable: boolean | undefined

/** Checks once per page, then gives the context back because browsers cap how many can be open. */
export function supportsWebGl() {
  if (webGlAvailable === undefined) {
    const context = document.createElement("canvas").getContext("webgl2")
    context?.getExtension("WEBGL_lose_context")?.loseContext()
    webGlAvailable = Boolean(context)
  }
  return webGlAvailable
}

class GlBoundary extends React.Component<{ onFail: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFail()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function ContextWatch({ onLost }: { onLost: () => void }) {
  const canvas = useThree((state) => state.gl.domElement)

  React.useEffect(() => {
    canvas.addEventListener("webglcontextlost", onLost)
    return () => canvas.removeEventListener("webglcontextlost", onLost)
  }, [canvas, onLost])

  return null
}

type GlStageProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Describes the scene. Screen readers get it, and it replaces the canvas if WebGL fails. */
  label: string
  /** Renders every frame while on screen. Turn it off for scenes that only change on input. */
  animate?: boolean
  /** The starting camera. */
  camera?: CanvasProps["camera"]
  /** The point the camera faces. */
  lookAt?: [x: number, y: number, z: number]
  /** Runs when a click lands on nothing in the scene. */
  onPointerMissed?: CanvasProps["onPointerMissed"]
  /** The scene, built from three.js elements. */
  children: React.ReactNode
}

export function GlStage({
  label,
  animate = true,
  camera,
  lookAt,
  onPointerMissed,
  ref,
  className,
  children,
  ...props
}: GlStageProps) {
  const host = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => host.current as HTMLDivElement)

  const onScreen = useInView(host)
  const near = useInView(host, NEAR_MARGIN)
  const far = useInView(host, FAR_MARGIN)
  const reduced = useReducedMotion()
  const [live, setLive] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const fail = React.useCallback(() => setFailed(true), [])

  if (near && !live) setLive(true)
  if (!near && !far && live) {
    setLive(false)
    // A dropped context can come back, so the next approach gets a fresh try.
    setFailed(false)
  }

  const broken = failed || (live && !supportsWebGl())

  return (
    <div
      ref={host}
      role={broken ? undefined : "img"}
      aria-label={broken ? undefined : label}
      className={cn("relative min-w-0 touch-pan-y overflow-hidden", className)}
      {...props}
    >
      {broken ? (
        <p className="text-mute grid size-full place-items-center p-4 text-center font-(family-name:--f-mono) text-xs">
          {label}
        </p>
      ) : (
        live && (
          <GlBoundary onFail={fail}>
            <Canvas
              flat
              dpr={[1, 2]}
              frameloop={onScreen && animate && !reduced ? "always" : "demand"}
              gl={{ antialias: true, alpha: true }}
              camera={camera}
              onCreated={(state) => {
                if (lookAt) state.camera.lookAt(...lookAt)
              }}
              onPointerMissed={onPointerMissed}
            >
              <ContextWatch onLost={fail} />
              {children}
            </Canvas>
          </GlBoundary>
        )
      )}
    </div>
  )
}
