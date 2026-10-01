import React, { useState } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { GradeModal } from './GradeModal';
import { useApp } from '../../contexts/AppContext';

export interface GradeDistributionProps {
  grades?: Record<string, number>;
  onGradeClick?: (grade: string) => void;
  className?: string;
}

const GRADE_CONFIG = [
  { key: 'A', bg: '#00C950' },
  { key: 'B', bg: '#0000FF' },
  { key: 'C', bg: '#FFC107' },
  { key: 'D', bg: '#8D6324' },
  { key: 'F', bg: '#FF0000' },
];

const GradeDistribution: React.FC<GradeDistributionProps> = ({
  onGradeClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const { gradeDistribution } = useApp();

  const handleGradeClick = (key: string) => {
    setSelectedGrade(key);
    setIsModalOpen(true);
    onGradeClick?.(key);
  };

  return (
    <>
      <div
        className={'w-full flex flex-col items-start justify-between gap-6 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-lg md:p-6 '}
      >
        {/* Left Header Section */}
        <div className="max-md:hidden flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-primary" />
          <div className="flex flex-col">
            <h3 className="font-sister text-xl leading-tight font-normal text-[#101828]">
              Grade Distribution
            </h3>
          </div>
        </div>

        {/* Right Grade Distribution Circles & Counts */}
        <div className="flex items-center justify-between max-md:w-full max-md:px-2 gap-4 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {GRADE_CONFIG.map(({ key, bg }) => {
            const count = gradeDistribution?.find((g) => g.grade === key)?.totalCount ?? 0;
            return (
              <div
                key={key}
                onClick={count !== 0 ? () => handleGradeClick(key) : undefined}
                className={`flex flex-col items-center gap-2 group shrink-0 ${count !== 0 ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  style={{ backgroundColor: count !== 0 ? bg : '#E5E7EB' }}
                  className=" w-12 h-12 md:w-12.5 md:h-12.5 rounded-full flex items-center justify-center shadow-sm "
                >
                  <span className="font-bold text-md md:text-[25px] text-white leading-none">
                    {key}
                  </span>
                </div>

                {/* Count & Chevron Right */}
                <div className="flex justify-between items-center text-[#101828] text-xs font-semibold">
                  <span>{count}</span>
                  {count !== 0 && <ChevronRight className="w-3 h-4 text-[#101828] stroke-1 -mr-1" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedGrade={selectedGrade}
      />
    </>
  );
};

export default GradeDistribution;