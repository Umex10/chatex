"use client"

import { LogOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"

interface SignOutMenuProps {
  children: React.ReactNode
  onSignOut: () => void
}

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
      <div onClick={() => setOpen(prev => !prev)}>
        {children}
      </div>

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
