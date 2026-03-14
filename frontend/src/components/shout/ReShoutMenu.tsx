"use client"

import { Repeat2, Quote } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { CreateShout } from "./CreateShout"
import { ShoutQuote } from "@/types/Shout"

/** Props for the ReShoutMenu component. */
interface ReShoutMenuProps {
  /** Whether the current user has already re-shouted this post. */
  isReShouted: boolean
  /** Triggered when the user selects "Re-Shout" or "Undo Re-Shout". */
  onReShout: () => void
  /** The shout to be quoted — passed to the quote composer dialog. */
  quotedShout: ShoutQuote
}

/**
 * Popover-style re-shout menu component.
 * Renders the Repeat2 icon as a trigger. On click it opens a floating panel
 * with two actions: "Re-Shout" (toggle) and "Quote".
 * Automatically closes when the user clicks outside.
 */
export function ReShoutMenu({ isReShouted, onReShout, quotedShout }: ReShoutMenuProps) {
  const [open, setOpen] = useState(false)
  // Separate state for the quote dialog — must be outside the dropdown conditional
  const [quoteOpen, setQuoteOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger: Repeat2 icon */}
      <div
        className="p-2 rounded-full transition-colors group-hover:bg-green-400/10 cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        <Repeat2
          className={`w-[18px] h-[18px] transition-colors ${isReShouted
              ? "text-green-400"
              : "text-zinc-500 group-hover:text-green-400"
            }`}
        />
      </div>

      {/* Quote dialog — always mounted outside the menu so it doesn't unmount on close */}
      <CreateShout variant="QUOTE" quotedShout={quotedShout} open={quoteOpen} 
      onOpenChange={setQuoteOpen} onReShout={onReShout}>
        <span className="hidden" />
      </CreateShout>

      {/* Re-Shout menu */}
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-44 rounded-lg border border-border bg-background shadow-lg z-50">
          {/* Re-Shout / Undo Re-Shout */}
          <Button
            onClick={() => { setOpen(false); onReShout(); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-lg
              hover:bg-secondary transition-colors bg-transparent justify-start
              text-green-400"
          >
            <Repeat2 className="w-4 h-4" />
            {isReShouted ? "Undo Re-Shout" : "Re-Shout"}
          </Button>

          {/* Quote — closes dropdown and opens the quote dialog */}
          <Button
            onClick={() => { setOpen(false); setQuoteOpen(true); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-lg
              hover:bg-secondary transition-colors bg-transparent justify-start"
          >
            <Quote className="w-4 h-4" />
            {quotedShout ? "Quote" : "Unqoute"}
          </Button>

        </div>
      )}
    </div>
  )
}
