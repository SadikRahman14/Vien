import React from 'react';

const Title = ({ txt1, txt2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3 group cursor-pointer">
      <p className="w-8 sm:w-20 h-[1px] sm:h-[2px] bg-gray-700 transition-all duration-300 group-hover:sm:w-12"></p>

      <p className=" text-[#14768b]">
        {txt1}{' '}
        <span className="text-[#0C586A] font-medium">{txt2}</span>
      </p>

      {/* right line */}
      <p className="w-8 sm:w-8 h-[1px] sm:h-[2px] bg-gray-700 transition-all duration-300 group-hover:sm:w-12"></p>
    </div>
  );
};

export default Title;
