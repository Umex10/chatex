"use client"

import { Ellipsis, Heart, Repeat2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"

import Link from "next/link"

interface ShoutDetailsMenuProps {
  /** URL to navigate to liked by page */
  likedByUrl?: string
  /** URL to navigate to re-shouted by page */
  reShoutedByUrl?: string
  /** Fallback callbacks if URLs are not provided */
  onShowLikedBy?: () => void
  onShowReShoutedBy?: () => void
}

/**
 * Menu-style menu for shout details (liked by / re-shouted by).
 * Renders the Ellipsis icon as a trigger. On click it opens a floating panel
 * with two actions: "Liked by" and "Re-shouted by".
 * Automatically closes when the user clicks outside.
 */
export function ShoutDetailsMenu({ likedByUrl, reShoutedByUrl, onShowLikedBy, onShowReShoutedBy }: ShoutDetailsMenuProps) {
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
        <div className="absolute bottom-full right-0 mb-1 w-48 flex flex-col rounded-lg border border-border bg-background shadow-lg z-50 overflow-hidden">
          {/* Liked by */}
          {likedByUrl ? (
            <Link
              href={likedByUrl}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-base
                hover:bg-secondary transition-colors bg-transparent justify-start
                text-pink-500"
            >
              <Heart className="w-4 h-4" />
              Liked by
            </Link>
          ) : (
            <Button
              onClick={() => { setOpen(false); onShowLikedBy?.(); }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-none
                hover:bg-secondary transition-colors bg-transparent justify-start
                text-pink-500"
            >
              <Heart className="w-4 h-4" />
              Liked by
            </Button>
          )}

          {/* Re-shouted by */}
          {reShoutedByUrl ? (
            <Link
              href={reShoutedByUrl}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-base
                hover:bg-secondary transition-colors bg-transparent justify-start
                text-green-400"
            >
              <Repeat2 className="w-4 h-4" />
              Re-shouted by
            </Link>
          ) : (
            <Button
              onClick={() => { setOpen(false); onShowReShoutedBy?.(); }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-none
                hover:bg-secondary transition-colors bg-transparent justify-start
                text-green-400"
            >
              <Repeat2 className="w-4 h-4" />
              Re-shouted by
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
