import React, { useMemo } from 'react';
import { BarChart3, Database } from 'lucide-react';

interface Unit {
  id?: string;
  name?: string;
  year: number;
  term: number;
  points?: number;
}

interface PerformanceGraphProps {
  units?: Unit[];
  currentContext?: string;
}

const GRADE_COLORS = {
  A: { bg: '#f0fdf4', stroke: '#22c55e', text: '#15803d' },
  B: { bg: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
  C: { bg: '#fffbeb', stroke: '#f59e0b', text: '#b45309' },
  D: { bg: '#fef2f2', stroke: '#ef4444', text: '#b91c1c' },
};

const GRAPH_HEIGHT = 180;
const MAX_VALUE = 12;
const PADDING_Y = 20;
const GRAPH_INNER_HEIGHT = GRAPH_HEIGHT - PADDING_Y * 2;
const COLUMN_WIDTH = 70;

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({
  units = [],
  currentContext = 'Overall',
}) => {
  const graphData = useMemo(() => {
    let filteredUnits = units;
    if (currentContext !== 'Overall') {
      const yearMatch = currentContext.match(/\d+/);
      if (yearMatch) {
        const yearValue = parseInt(yearMatch[0], 10);
        filteredUnits = units.filter((u) => u.year === yearValue);
      }
    }

    if (!filteredUnits || filteredUnits.length === 0) return [];

    const groups: {
      [key: string]: {
        totalPoints: number;
        count: number;
        year: number;
        term: number;
        label: string;
      };
    } = {};

    filteredUnits.forEach((u) => {
      const label = currentContext === 'Overall' ? `Y${u.year}S${u.term}` : `S${u.term}`;
      const key = `${u.year}-${u.term}`;
      if (!groups[key]) {
        groups[key] = { totalPoints: 0, count: 0, year: u.year, term: u.term, label };
      }
      groups[key].totalPoints += u.points || 0;
      groups[key].count += 1;
    });

    return Object.entries(groups)
      .map(([, data]) => ({
        label: data.label,
        value: parseFloat((data.totalPoints / data.count).toFixed(2)),
        year: data.year,
        term: data.term,
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.term - b.term;
      });
  }, [units, currentContext]);

  const scrollableWidth = Math.max(
    600,
    (graphData.length - 1) * COLUMN_WIDTH + 100
  );

  const getY = (val: number) => PADDING_Y + GRAPH_INNER_HEIGHT - (val / MAX_VALUE) * GRAPH_INNER_HEIGHT;
  
  const getX = (index: number) => {
    if (graphData.length <= 1) return scrollableWidth / 2;
    return (index / (graphData.length - 1)) * (scrollableWidth - 60) + 30;
  };

  const buildSmoothPath = (data: typeof graphData) => {
    if (data.length < 2) return '';
    let d = `M ${getX(0)},${getY(data[0].value)}`;

    for (let i = 0; i < data.length - 1; i++) {
      const x1 = getX(i);
      const y1 = getY(data[i].value);
      const x2 = getX(i + 1);
      const y2 = getY(data[i + 1].value);

      const cp1x = x1 + (x2 - x1) / 2;
      const cp1y = y1;
      const cp2x = x1 + (x2 - x1) / 2;
      const cp2y = y2;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    return d;
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm w-full flex flex-col gap-3">
      {/* Premium Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] flex items-center justify-center text-[#4A90D9]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Inter',sans-serif] font-bold text-base text-gray-900 leading-tight">
              Performance Insights
            </h3>
          </div>
        </div>
      </div>

      <p className="font-['Inter',sans-serif] text-xs text-gray-500">
        {currentContext === 'Overall'
          ? 'Trend analysis across all years'
          : `Trend analysis for ${currentContext}`}
      </p>

      {/* Graph Area */}
      <div className="relative h-[200px] w-full flex items-center">
        {graphData.length === 0 ? (
          <div className="w-full h-[180px] bg-gray-100/60 rounded-xl border border-gray-200 flex flex-col items-center justify-center p-4">
            <Database className="w-6 h-6 text-gray-400 mb-1.5" />
            <p className="font-['Inter',sans-serif] font-bold text-sm text-gray-700 mb-0.5">
              No data to plot for {currentContext}.
            </p>
            <p className="font-['Inter',sans-serif] text-xs text-gray-400 text-center">
              Add units to see your progress.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Y-Axis Labels */}
            <div
              className="absolute left-0 top-[20px] bottom-[20px] w-7 flex flex-col justify-between items-start z-10 bg-white"
              style={{ height: `${GRAPH_INNER_HEIGHT}px` }}
            >
              {[12, 9, 6, 3, 0].map((val) => (
                <span key={`y-label-${val}`} className="font-['Inter',sans-serif] text-[10px] font-semibold text-gray-400 leading-none">
                  {val}
                </span>
              ))}
            </div>

            {/* Scrollable SVG & X-Axis Container */}
            <div className="ml-7 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
              <div className="relative" style={{ width: `${scrollableWidth}px`, height: `${GRAPH_HEIGHT}px` }}>
                <svg width={scrollableWidth} height={GRAPH_HEIGHT} className="overflow-visible">
                  {/* Background Bands */}
                  <rect x={0} y={getY(12)} width={scrollableWidth} height={(3 / 12) * GRAPH_INNER_HEIGHT} fill={GRADE_COLORS.A.bg} fillOpacity={0.9} />
                  <rect x={0} y={getY(9)} width={scrollableWidth} height={(3 / 12) * GRAPH_INNER_HEIGHT} fill={GRADE_COLORS.B.bg} fillOpacity={0.9} />
                  <rect x={0} y={getY(6)} width={scrollableWidth} height={(3 / 12) * GRAPH_INNER_HEIGHT} fill={GRADE_COLORS.C.bg} fillOpacity={0.9} />
                  <rect x={0} y={getY(3)} width={scrollableWidth} height={(3 / 12) * GRAPH_INNER_HEIGHT} fill={GRADE_COLORS.D.bg} fillOpacity={0.9} />

                  {/* Background Grid Lines (Horizontal) */}
                  {[0, 3, 6, 9, 12].map((val) => (
                    <line
                      key={`grid-${val}`}
                      x1={0}
                      y1={getY(val)}
                      x2={scrollableWidth}
                      y2={getY(val)}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Vertical Grid Lines */}
                  {graphData.map((_, i) => (
                    <line
                      key={`v-grid-${i}`}
                      x1={getX(i)}
                      y1={getY(0)}
                      x2={getX(i)}
                      y2={getY(12)}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Smooth Trend Path */}
                  <path
                    d={buildSmoothPath(graphData)}
                    fill="none"
                    stroke="#4A90D9"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Point Markers */}
                  {graphData.map((d, i) => (
                    <g key={`point-group-${i}`}>
                      <circle
                        cx={getX(i)}
                        cy={getY(d.value)}
                        r={8}
                        fill="#4A90D9"
                        fillOpacity={0.15}
                      />
                      <circle
                        cx={getX(i)}
                        cy={getY(d.value)}
                        r={4}
                        fill="#4A90D9"
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    </g>
                  ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-0 h-5 w-full pointer-events-none">
                  {graphData.map((d, i) => (
                    <div
                      key={`x-label-view-${i}`}
                      className="absolute w-[50px] -ml-[25px] text-center"
                      style={{ left: `${getX(i)}px` }}
                    >
                      <span className="font-['Inter',sans-serif] text-[10px] font-semibold text-gray-400">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GRADE_COLORS.A.stroke }} />
          <span className="font-['Inter',sans-serif] text-xs font-medium text-gray-600">A (10-12)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GRADE_COLORS.B.stroke }} />
          <span className="font-['Inter',sans-serif] text-xs font-medium text-gray-600">B (7-9)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GRADE_COLORS.C.stroke }} />
          <span className="font-['Inter',sans-serif] text-xs font-medium text-gray-600">C (4-6)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GRADE_COLORS.D.stroke }} />
          <span className="font-['Inter',sans-serif] text-xs font-medium text-gray-600">F/D (0-3)</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraph;
