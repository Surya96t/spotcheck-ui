import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// jsdom has no layout, so it doesn't implement this.
Element.prototype.scrollIntoView = () => {}

afterEach(cleanup)
