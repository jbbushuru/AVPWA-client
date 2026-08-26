import React from 'react';
import { MapPin, User, Check, X, Clock, PlusCircle } from 'lucide-react';
import { Lesson as APILesson } from '../../services/lessonService';
import { useApp } from '../../contexts/AppContext';
import { getLessonStatus, LessonStatus } from '../../utils/getLessonStatus';

interface LessonCardProps {
  lesson: APILesson;
  date: Date;
  currentTime: string;
  view?: 'daily' | 'weekly';
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, date, currentTime, view = 'weekly' }) => {
  const { settings } = useApp();
  const lessonDuration = settings?.lessonDuration || 60;

  const status: LessonStatus = getLessonStatus(lesson, date, lessonDuration, currentTime);

  // Configuration map for card styles & badges
  const styles = {
    completed: {
      card: 'bg-slate-50/80 border border-slate-200/60',
      title: 'line-through text-slate-500',
      badge: 'bg-slate-200/70 text-slate-700',
      badgeIcon: <Check className="w-3.5 h-3.5 stroke-[2.5]" />,
      badgeText: 'Completed',
    },
    ongoing: {
      card: 'bg-white border-y border-r border-slate-200 border-l-4 border-l-[#7B5E77] shadow-sm',
      title: 'text-[#7B5E77]',
      badge: 'bg-[#7B5E77]/10 text-[#7B5E77]',
      badgeIcon: <Clock className="w-3.5 h-3.5" />,
      badgeText: lesson.time,
    },
    upcoming: {
      card: 'bg-white border border-slate-200/80 hover:border-[#7B5E77]/40 shadow-sm',
      title: 'text-[#7B5E77]',
      badge: 'bg-slate-100 text-slate-600',
      badgeIcon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
      badgeText: lesson.time,
    },
    cancelled: {
      card: 'bg-rose-50/30 border border-rose-200/70',
      title: 'line-through text-slate-400',
      badge: 'bg-rose-100/80 text-rose-600 font-medium',
      badgeIcon: <X className="w-3.5 h-3.5 stroke-[2.5]" />,
      badgeText: 'Cancelled',
    },
  }[status];

  return (
    <div className={`relative flex-1 w-full h-full p-4 rounded-md transition-all ${styles.card}`}>
      {/* Top Badge */}
      <div className="flex justify-end max-md:hidden">
        <div className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 font-medium ${styles.badge}`}>
          {styles.badgeIcon}
          <span>{styles.badgeText}</span>
        </div>
      </div>

      {/* Lesson Details */}
      <h3 className={`font-bold text-lg max-md:text-xs line-clamp-2 ${styles.title}`}>
        {lesson.unitName}
      </h3>

      <div className={`mt-2 flex ${view === 'daily' ? 'flex-row gap-4 flex-wrap' : 'flex-col gap-1'} text-[10px] md:text-sm text-slate-500`}>
        {lesson.venue && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 max-md:w-2.5 max-md:h-2.5 text-slate-400" />
            <span>{lesson.venue}</span>
          </div>
        )}
        {lesson.lecturer && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 max-md:w-2.5 max-md:h-2.5 text-slate-400" />
            <span>{lesson.lecturer}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const EmptySlot = ({ onClick, view='daily' }: { onClick: () => void, view?: 'weekly' | 'daily' }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex-1 w-full h-full flex flex-row items-center justify-center gap-2 py-8 max-md:py-6 rounded-md max-md:rounded-xl border border-dashed border-primary hover:bg-primary/10 text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer"
        >
            <PlusCircle className="w-6 h-6 stroke-1 md:stroke-[1.5] stroke-primary" />
            <span className={`${view==='weekly' ? 'max-md:hidden' : 'max-md:block'}  font-sister text-md text-primary tracking-wide`}>Add Lesson</span>
        </button>
    );
};