import React, { useEffect, useState } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { getAllUnits } from '../../services/unitService';

export interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade?: string | null;
}

interface Unit {
  _id: string;
  code: string;
  name: string;
  grade: string;
  category: any;
  year?: number;
  term?: number;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !selectedGrade) return;

    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUnits({ grade: selectedGrade });
        setUnits(Array.isArray(data) ? data : data.units ?? []);
      } catch (err) {
        setError('Failed to load units. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [isOpen, selectedGrade]);

  if (!isOpen) return null;

  const GRADE_COLORS: Record<string, string> = {
    A: '#00C950',
    B: '#0000FF',
    C: '#FFC107',
    D: '#8D6324',
    F: '#FF0000',
  };
  const gradeColor = selectedGrade ? (GRADE_COLORS[selectedGrade] ?? '#6B7280') : '#6B7280';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e2535] rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: gradeColor }}
            >
              <span className="font-bold text-base text-white leading-none">
                {selectedGrade}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#101828] dark:text-white leading-tight">
                Grade {selectedGrade} Units
              </h2>
              {!loading && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {units.length} {units.length === 1 ? 'unit' : 'units'} found
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading units…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && units.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400 dark:text-gray-500">
              <BookOpen className="w-10 h-10" />
              <p className="text-sm font-medium">No units with grade {selectedGrade}</p>
            </div>
          )}

          {!loading && !error && units.length > 0 && (
            <ul className="flex flex-col gap-3">
              {units.map((unit) => (
                <li
                  key={unit._id}
                  className="flex items-start justify-between gap-3 rounded-xl dark:bg-[#262f45] px-4 py-3"
                  style={{ backgroundColor: gradeColor + '15' }}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm uppercase font-semibold text-[#101828] dark:text-white truncate">
                      {unit.name}
                    </span>
                    <span className="text-[10px] font-bold tracking widest  text-gray-500 dark:text-gray-400">
                      {unit.code}
                      {unit.year && unit.term ? ` · Y${unit.year} T${unit.term}` : ''}
                      {unit.category ? ` · ${unit.category.name}` : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
