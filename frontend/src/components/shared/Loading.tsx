import React from 'react';
import Spinner from './Spinner';

/** Full-screen spinner shown while async content is loading. */
const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
     <Spinner></Spinner>
    </div>
  );
};

export default Loading;