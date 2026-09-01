import React from 'react';
import { LucideIcon, Medal, Award, AlertTriangle } from 'lucide-react';

export interface AptitudeCardProps {
  icon: LucideIcon;
  title: string;
  category: string;
  categoryPoints: number | string;
}

export const AptitudeCard: React.FC<AptitudeCardProps> = ({
  icon: Icon,
  title,
  category,
  categoryPoints,
}) => {
  const isStrength =
    typeof categoryPoints === 'number'
      ? categoryPoints >= 0
      : !title.toLowerCase().includes('watch');

  return (
    <div
      className={`flex-1 rounded-lg p-3 flex flex-row items-center justify-between border shadow-sm transition-all ${
        isStrength
          ? 'bg-[#f0fdf4] border-[#16a34a]/25'
          : 'bg-[#fff7ed] border-[#ea580c]/25'
      }`}
    >
      {/* Left Content */}
      <div className="flex flex-row items-center flex-1 min-w-0 mr-2.5">
        <div
          className={`w-10 h-10 rounded-[14px] flex items-center justify-center mr-2.5 shrink-0 ${
            isStrength ? 'bg-[#dcfce7]' : 'bg-[#ffedd5]'
          }`}
        >
          <Icon
            className={`w-[18px] h-[18px] ${
              isStrength ? 'text-[#16a34a]' : 'text-[#ea580c]'
            }`}
          />
        </div>

        <div className="flex flex-col justify-center min-w-0 flex-1">
          <span className="font-['Inter',sans-serif] text-xs text-gray-500 truncate">
            {title}
          </span>
          <span
            className={`font-sister text-md md:text-[17px] leading-tight truncate ${
              isStrength ? 'text-[#15803d]' : 'text-[#9a3412]'
            }`}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Points Badge */}
      <div
        className={`flex flex-row items-center px-2.5 py-1.5 rounded-[12px] shrink-0 ml-2.5 ${
          isStrength ? 'bg-[#dcfce7]' : 'bg-[#ffedd5]'
        }`}
      >
        <Medal
          className={`w-3 h-3 mr-1 ${
            isStrength ? 'text-[#16a34a]' : 'text-[#ea580c]'
          }`}
        />
        <span
          className={`font-['Inter',sans-serif] text-[13px] font-extrabold ${
            isStrength ? 'text-[#166534]' : 'text-[#c2410c]'
          }`}
        >
          {typeof categoryPoints === 'number' && categoryPoints > 0
            ? `+${categoryPoints}`
            : categoryPoints}
        </span>
      </div>
    </div>
  );
};

export const PerformanceCards: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <AptitudeCard
        title="Top Strength Area"
        icon={Award}
        category="Computer Science"
        categoryPoints={12}
      />
      <AptitudeCard
        title="Area to Watch"
        icon={AlertTriangle}
        category="Applied Mathematics"
        categoryPoints={-3}
      />
      <AptitudeCard
        title="Top Strength Area"
        icon={Award}
        category="Computer Science"
        categoryPoints={12}
      />
    </div>
  );
};

export default PerformanceCards;
