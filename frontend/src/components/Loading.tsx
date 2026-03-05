import React from 'react';

/** Full-screen spinner shown while async content is loading. */
const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
      <div className="relative">

        <div className="h-12 w-12 rounded-full border-4 border-violet-100"></div>
        

        <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loading;