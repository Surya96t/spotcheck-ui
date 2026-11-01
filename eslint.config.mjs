import next from "eslint-config-next/core-web-vitals"
import ts from "eslint-config-next/typescript"

const config = [
  { ignores: [".next/**", "public/r/**", "reference/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
  ...next,
  ...ts,
]

export default config
