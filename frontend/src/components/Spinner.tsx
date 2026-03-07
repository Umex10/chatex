import React from 'react'

const Spinner = () => {
  return (
    <div className="relative">

      <div className="h-12 w-12 rounded-full border-4 border-violet-100"></div>

      <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
    </div>
  )
}

export default Spinner
