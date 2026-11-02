import { beforeEach, describe, expect, it, vi } from "vitest"

import { toHex } from "@/registry/spotcheck/hooks/use-gl-palette"

describe("toHex", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      fillStyle: "",
      fillRect: () => {},
      getImageData: () => ({ data: new Uint8ClampedArray([36, 51, 224, 255]) }),
    } as unknown as CanvasRenderingContext2D)
  })

  it("reads the painted pixel rather than parsing the string", () => {
    expect(toHex("oklch(0.45 0.27 270)")).toBe("#2433e0")
  })
})
