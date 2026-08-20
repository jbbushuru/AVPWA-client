import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { StrengthTerm } from "../../services/unitService";
import { Dumbbell, ChevronDown } from "lucide-react";

function StrengthItem({ str }: { str: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
    className="flex flex-col rounded-sm  overflow-hidden shadow-sm"
    >
      <div
        className={`flex items-center justify-between text-md p-2.5 cursor-pointer`}
        style={{backgroundColor: `${str.signatureColor}50`}}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase text-gray-700 font-medium">
          {str.categoryName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
            Avg: &nbsp;&nbsp;{str.averageGrade}
          </span>
          <span className="text-xs font-bold text-gray-500">
            ({str.units.length} {str.units.length === 1 ? "unit" : "units"})
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="px-3 pb-3 pt-1" style={{backgroundColor: `${str.signatureColor}30`}}>
          <ul className="space-y-1.5 mt-2">
            {str.units.map((unit: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-start text-xs text-gray-600 gap-2"
              >
                <div className="flex flex-row items-center gap-3">
                  <span className="font-semibold text-gray-700">{unit.code} </span>
                  <span className="h-0.5 w-0.5 rounded-full bg-gray-700"> </span>
                  <span className="text-gray-500 line-clamp-1"> {unit.name}</span>
                </div>
                <span className="font-bold text-gray-800 px-1.5 py-0.5 rounded">
                  {unit.grade}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Card({term, strengths}: StrengthTerm){
    const {profile} = useAuth();
    const system = profile?.academicSystem;
    
    return (
      <div className="p-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
          {system === "Semester" ? "Sem" : "Term"} {term}
        </span>

        <div className="space-y-2">
          {strengths.map((str, sIdx) => (
            <StrengthItem key={sIdx} str={str} />
          ))}
        </div>
      </div>
    )
}

export default function StrengthEvolutionTimeline() {
  const {strengthDistribution} = useApp();
  const {profile} = useAuth();
  const courseDuration = profile?.courseDuration || 4;
  const currentYear = profile?.year || 4;
  if (!strengthDistribution) return <div className="text-gray-700 font-medium text-base py-1"> No strength distribution available yet</div>;
  // Generate default display for Years 1 through 4
  const allYears = Array.from({length:courseDuration}, (_, i) => i + 1);

  // Quick lookup map for available API data
  const dataMap = new Map(strengthDistribution.map((item) => [item.yr, item]));

  return (
    <div className="w-full">
      {/* Timeline Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell className="text-blue-500 w-6 h-6"/>
          <div className="flex flex-col">
          <h1 className="text-2xl  font-sister text-gray-800 tracking-wide">
            Strength Evolution Timeline
          </h1>
          <p className="text-sm text-gray-500">
          How your primary strengths changed over time
          </p>
          </div>
        </div>
        
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 space-y-6">
        {/* Continuous Vertical Connector Line */}
        <div className="absolute left-3 top-3 bottom-8 w-[2px] bg-gray-200 -z-0" />

        {allYears.map((yearNum) => {
          const yearData = dataMap.get(yearNum);
          const isCurrent = yearNum === currentYear;
          const hasData = yearData && yearData.terms.length > 0;

          return (
            <div key={yearNum} className="relative flex pl-6 items-start gap-4">
              {/* Timeline Node Dot */}
              <div
                className={`absolute  -left-5 top-9 z-10 flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 ${
                  isCurrent ? "ring-4 ring-primary shadow-lg shadow-primary border-6 border-gray-200 bg-white" : ""
                }`}
              >
              </div>


              {/* Year Card */}
              <div
                className={`w-full rounded-lg p-4 transition-all ${
                  isCurrent
                    ? "bg-white border-l-4 border-primary shadow-sm"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                {/* Year Badge Header */}
                <div className="flex items-center gap-1">
                  <span
                    className={`text-md font-sister ${
                      isCurrent ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    Year {yearNum}
                  </span>
                  {isCurrent && (
                    <span className="text-xs italic font-semibold  text-primary  rounded-md">
                      - Current Year
                    </span>
                  )}
                </div>

                {/* Card Content Body */}
                {!hasData ? (
                  <p className="text-gray-700 font-medium text-base py-1">
                    No units recorded yet
                  </p>
                ) : (
                  <div className="space-y-3 mt-2">
                    {yearData.terms.map((term, tIdx) => (
                      <Card key={tIdx} {...term}/>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}