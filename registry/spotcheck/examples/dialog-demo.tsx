import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/registry/spotcheck/components/spotcheck/dialog"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ink" />}>Compare runs</DialogTrigger>
      <DialogContent title="Compare two runs" description="R-2041 scored 0.912 and R-2040 scored 0.884.">
        <DialogClose render={<Button />}>Done</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
