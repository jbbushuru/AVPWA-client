import React from 'react';
import { Sparkles, BookOpen, Ribbon, TrendingUp, Swords } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function getSublevel(
  academicSystem: "Semester" | "Trimester" | undefined,
  term: number | undefined
) {
  if (!academicSystem || !term) return 'N/A';
  const system = academicSystem === 'Semester' ? 'Sem' : 'Tri';
  return `${system} ${term}`;
}
function getScholarChapters(
  courseDuration: number | undefined,
  academicSystem: "Semester" | "Trimester" | undefined,
  year: number | undefined,
  term: number | undefined
) {
  if (!courseDuration || !academicSystem || !year || !term) return 0;

  const multiplier = academicSystem === 'Semester' ? 2 : 3;
  const totalTerms = courseDuration * multiplier;
  const currentTerm = (year-1)*multiplier + term;
  
  return `${currentTerm}/${totalTerms}`;
}
const Level = ({year}: {year: number}) => {
  return (
    <div className="bg-linear-to-br from-[rgba(166,141,173,0.2)] to-[rgba(212,165,165,0.2)] border-[1.73px] border-[#A188A8]/50 rounded-[10px] p-[13.7px] flex flex-col gap-1 justify-between h-[83.4px]">
      <div className="flex items-center gap-2 text-[#7B5E77]">
        <Sparkles className="w-4 h-4 text-[#A188A8]" />
        <span className="font-sister text-xs leading-none">Level</span>
      </div>
      <div className="font-['Inter',sans-serif] font-bold text-2xl md:text-[30px] leading-tight text-[#5C4C5F]">
        {year==0 ? 'N/A' : `Year ${year}`}
      </div>
    </div>
  )
}

const SubLevel = ({academicSystem, term}: {academicSystem: "Semester" | "Trimester", term: number }) => {
  return (
    <div className="bg-linear-to-br from-[rgba(238,215,161,0.3)] to-[rgba(181,201,195,0.2)] border-[1.73px] border-[#879B95]/50 rounded-[10px] p-[13.7px] flex flex-col gap-1 justify-between h-[83.4px]">
      <div className="flex items-center gap-2 text-[#879B95]">
        <BookOpen className="w-4 h-4 text-[#879B95]" />
        <span className="font-sister text-xs leading-none">Sublevel</span>
      </div>
      <div className="font-['Inter',sans-serif] font-bold text-2xl md:text-[30px] leading-tight text-[#5C4C5F]">
        {getSublevel(academicSystem, term)}
      </div>
    </div>
  )
}
const UnitsCompleted = ({unitsCompleted}: {unitsCompleted: number }) => {
  return (
    <div className="bg-linear-to-br from-[rgba(238,215,161,0.3)] to-[rgba(215,168,14,0.2)] border-[1.73px] border-[#D7A80E]/50 rounded-[10px] p-[13.7px] flex flex-col gap-1 justify-between h-[83.4px]">
      <div className="flex items-center gap-2 text-[#bd9510]">
        <BookOpen className="w-4 h-4 text-[#D7A80E]" />
        <span className="font-sister text-xs leading-none">Units Completed</span>
      </div>
      <div className="font-['Inter',sans-serif] font-bold text-2xl md:text-[30px] leading-tight text-[#D7A80E] text-center">
        {unitsCompleted === 0? 'N/A' : unitsCompleted}
      </div>
    </div>
  )
}
const Performance = ({performance}: {performance: number}) => {
  return (
    <div className="bg-linear-to-br from-[rgba(169,222,217,0.22)] to-[rgba(76,138,234,0.2)] border-[1.73px] border-[#2B7FFF]/40 rounded-[10px] p-[13.7px] flex flex-col gap-1 justify-between h-[83.4px]">
      <div className="flex items-center gap-2 text-[#1B61CD]">
        <Ribbon className="w-4 h-4 text-[#1B61CD]" />
        <span className="font-sister text-xs leading-none">Performance</span>
      </div>
      <div className="font-['Inter',sans-serif] font-bold text-2xl md:text-[30px] leading-tight text-[#1B61CD]">
        {performance === 0 ? 'N/A' : `${performance}/12`}
      </div>
    </div>
  )
}
  
export const Stats: React.FC = () => {
  const { profile } = useAuth();
  const unitsCompleted = 0;
  const performance = 0;

  const scholarChapters = getScholarChapters(profile?.courseDuration, profile?.academicSystem, profile?.year, profile?.term);
  const scholarChaptersPercent = (() => {
    if (!scholarChapters) return 0;
    const [current, total] = String(scholarChapters).split('/').map(Number);
    if (!total) return 0;
    return Math.round((current / total) * 100);
  })();
    
  
  return (
    <div className="md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-lg md:p-6 flex flex-col justify-between w-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-2 md:mb-3">
        <div className="flex items-center gap-2">
          <Swords className="w-4 md:w-6 h-4 md:h-6 text-black" />
          <h2 className="font-sister text-sm md:text-xl text-black font-normal leading-7">
            Your Current Stats
          </h2>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4">
        {/* Card 1: Level */}
        <Level year={profile?.year || 0} />
        {/* Card 2: Sublevel */}
        <SubLevel academicSystem={profile?.academicSystem || 'Semester'} term={profile?.term || 0} />

        {/* Card 3: Units Completed */}
        <UnitsCompleted unitsCompleted={unitsCompleted || 0} />

        {/* Card 4: Performance */}
        <Performance performance={ performance || 0} />
      </div>

      {/* Progress Bar Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="font-sister text-xs text-black">
              Scholar Chapters
            </span>
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-sm md:text-base text-black">
            {scholarChapters}
          </span>
        </div>
        {/* Bar */}
        <div className="w-full h-1 md:h-2.5 bg-[#DDBCDB] rounded-full overflow-hidden">
          <div className="h-full bg-[#6E536D] rounded-full transition-all duration-500" style={{ width: `${scholarChaptersPercent}%` }} />
        </div>
      </div>
    </div>
  );
};
