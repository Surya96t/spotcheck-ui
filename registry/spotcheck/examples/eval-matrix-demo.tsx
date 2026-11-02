import { EvalMatrix } from "@/registry/spotcheck/components/spotcheck/eval-matrix"

const VALUES = [
  [0.93, 0.96, 0.88, 0.91, 0.97],
  [0.89, 0.93, 0.82, 0.9, 0.96],
  [0.8, 0.84, 0.69, 0.86, 0.94],
  [0.74, 0.62, 0.71, 0.78, 0.88],
]

export function EvalMatrixDemo() {
  return (
    <EvalMatrix
      label="Eval scores by model and task"
      rows={["atlas-l", "atlas-m", "atlas-s", "local/32b"]}
      cols={["QA", "Tools", "Code", "Extract", "Safety"]}
      values={VALUES}
    />
  )
}
