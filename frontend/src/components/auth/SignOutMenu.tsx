"use client"

import { LogOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"

/** Props for the SignOutMenu component. */
interface SignOutMenuProps {
  children: React.ReactNode
  onSignOut: () => void
}

/**
 * Popover-style sign-out menu component.
 * Wraps its children — typically the user avatar/name row in the sidebar footer —
 * and shows a "Sign out" button in a floating panel above the trigger when clicked.
 * Automatically closes when the user clicks outside.
 */
export function SignOutMenu({ children, onSignOut }: SignOutMenuProps) {
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
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <div onClick={() => setOpen(prev => !prev)}>
        {children}
      </div>

      {/* Sign Out Popover */}
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-56 rounded-lg border border-border bg-background shadow-lg z-50">
          <Button
            onClick={() => { setOpen(false); onSignOut(); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-secondary transition-colors
            bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      )}
    </div>
  )
}
