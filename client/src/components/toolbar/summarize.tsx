import { SummarizeResponse } from "@/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "postcss"
import { Button } from "../ui/button"
import { useState } from "react"
import StreamText from "../stream-text"

type SummarizeProps = {
  summarizeText: () => Promise<SummarizeResponse>
}

const Summarize = ({ summarizeText }: SummarizeProps) => {
  const [text, setText] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)

  const handleSummarize = async () => {
    const res = await summarizeText()
    if (res.data) {
      setText(res.data.response)
      setOpen(true)
      return
    }

    toast(`Error: ${res.error?.response}`, {
      id: "error-toast",
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
      classNames: {
        toast: "!bg-red-600",
        title: "!text-white",
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <Sparkles
            className="w-4 h-4 text-ring cursor-pointer"
            onClick={handleSummarize}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>summarize email</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Summarized email</DialogTitle>
          </DialogHeader>
          <div>
            <StreamText text={text} speed={10} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Summarize
