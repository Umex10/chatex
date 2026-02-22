import * as React from "react"

/** Breakpoint in pixels below which the layout is considered mobile. */
const MOBILE_BREAKPOINT = 640

/**
 * Custom hook that tracks whether the current viewport width is below the mobile breakpoint.
 * Subscribes to a MediaQueryList change event and updates reactively on resize.
 *
 * @returns `true` if the viewport is mobile-sized, `false` otherwise
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
