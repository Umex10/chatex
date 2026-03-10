import React from 'react'

/** Reusable animated spinner component used as a loading indicator throughout the app. */
const Spinner = () => {
  return (
    <div className="relative">

      {/* Static ring background */}
      <div className="h-12 w-12 rounded-full border-4 border-violet-100"></div>

      {/* Animated spinning ring */}
      <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
    </div>
  )
}

export default Spinner
