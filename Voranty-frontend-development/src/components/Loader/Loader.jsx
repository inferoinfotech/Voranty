import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-[700px]">
      <svg
        className="animate-spin-slow"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        {/* Outer rotating circle */}
        <circle
          className="stroke-[#37B5FF]"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="4"
          strokeDasharray="282" // Adjusted dasharray to match the circumference
          strokeDashoffset="0" // Start the stroke from the beginning
        />

        {/* Inner rotating circle */}
        <circle
          className="stroke-[#0B2838] animate-dash-reverse"
          cx="50"
          cy="50"
          r="25"
          fill="none"
          strokeWidth="4"
          strokeDasharray="157"
          strokeDashoffset="157"
        />

        {/* Pulsing dots */}
        <circle className="fill-blue-400 animate-pulse" cx="50" cy="5" r="3" />
        <circle className="fill-blue-400 animate-pulse" cx="95" cy="50" r="3" />
        <circle className="fill-blue-400 animate-pulse" cx="50" cy="95" r="3" />
        <circle className="fill-blue-400 animate-pulse" cx="5" cy="50" r="3" />
      </svg>
    </div>
  );
};

export default Loader;
