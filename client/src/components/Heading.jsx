import React from "react";

const Heading = ({ text }) => {
  return (
    <div className="twelve relative text-center">
      <h1 className="text-[21px]  font-bold tracking-wide uppercase w-[160px] mx-auto whitespace-nowrap pb-[13px] relative">
        {/* Before pseudo-element */}
        <span className="absolute top-0 left-0 h-[3px] w-[75px] bg-[var(--iconCol)] -translate-y-[4px]"></span>
        {text}
        {/* After pseudo-element */}
        <span className="absolute bottom-0 right-0 h-[3px] w-[75px] bg-[var(--iconCol)] translate-y-[-10px]"></span>
      </h1>
    </div>
  );
};

export default Heading;
