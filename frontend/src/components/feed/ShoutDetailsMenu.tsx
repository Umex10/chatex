"use client"

import { Ellipsis, Heart, Repeat2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"

interface ShoutDetailsMenuProps {
  /** Callback to navigate to liked by page */
  onShowLikedBy: () => void
  /** Callback to navigate to re-shouted by page */
  onShowReShoutedBy: () => void
}

/**
 * Menu-style menu for shout details (liked by / re-shouted by).
 * Renders the Ellipsis icon as a trigger. On click it opens a floating panel
 * with two actions: "Liked by" and "Re-shouted by".
 * Automatically closes when the user clicks outside.
 */
export function ShoutDetailsMenu({ onShowLikedBy, onShowReShoutedBy }: ShoutDetailsMenuProps) {
  const [open, setOpen] = useState(false)
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
      {/* Trigger: Ellipsis icon */}
      <Button
        size="icon"
        variant="secondary"
        className="bg-transparent hover:bg-secondary/50 transition-colors"
        onClick={() => setOpen(prev => !prev)}
      >
        <Ellipsis className="w-4 h-4" />
      </Button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute bottom-full right-0 mb-1 w-48 rounded-lg border border-border bg-background shadow-lg z-50">
          {/* Liked by */}
          <Button
            onClick={() => { setOpen(false); onShowLikedBy(); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-lg
              hover:bg-secondary transition-colors bg-transparent justify-start
              text-pink-500"
          >
            <Heart className="w-4 h-4" />
            Liked by
          </Button>

          {/* Re-shouted by */}
          <Button
            onClick={() => { setOpen(false); onShowReShoutedBy(); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-lg
              hover:bg-secondary transition-colors bg-transparent justify-start
              text-green-400"
          >
            <Repeat2 className="w-4 h-4" />
            Re-shouted by
          </Button>
        </div>
      )}
    </div>
  )
}
