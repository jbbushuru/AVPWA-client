import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export const AcademicCompass: React.FC = () => {
  return (
    <div>
      {/* Title with icon following Stats.tsx format */}
      <div className="flex items-center gap-2 mb-1">
        <Compass className="w-5 h-5 text-[#A188A8]" />
        <h2 className="font-sister text-lg md:text-xl text-black font-normal leading-7">
          Academic Compass
        </h2>
      </div>    

    <div className="bg-gradient-to-b from-[#7B5B75] to-[#594255] rounded-lg p-6 text-white flex flex-col justify-between items-center text-center shadow-md w-full">
      {/* Description */}
      <div className="flex flex-col gap-3 my-auto max-w-[240px]">
        <p className="font-['Inter',sans-serif] text-sm text-white/90 leading-relaxed font-light">
          Based on your current performance, are you on track or slipping?
        </p>
        <p className="font-['Inter',sans-serif] text-sm text-white/90 leading-relaxed font-light">
          Set a target to be able to find out!
        </p>
      </div>

      {/* Action Button */}
      <button className="mt-3 md:mt-6 md:w-full md:py-3.5 py-1 px-6 font-sister bg-white text-[#594255] rounded-full text-md md:text-lg font-medium flex items-center justify-center gap-2 hover:bg-white/95 transition-all shadow-sm active:scale-[0.98]">
        <span>Set Target</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
    </div>
  );
};

export default AcademicCompass;
