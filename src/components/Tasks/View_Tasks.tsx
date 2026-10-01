import React, { useState } from 'react';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Infinity as InfinityIcon, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  CalendarDays, 
} from 'lucide-react';
import { bucketTasks, Task } from '../../utils/dateBuckets';
import TaskListItem from './TaskListItem';


export type BucketType = 'overdue' | 'today' | 'thisWeek' | 'later' | 'noDueDate' | 'done';
function getFormattedDate() {
    return new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
export function getFormattedWeekRange(date = new Date()) {
  const currentDay = date.getDay();
  // Adjust for Sunday (0) being the start of the week in JS getDay()
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  // Calculate Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  // Calculate Sunday (+6 days from Monday)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format month and day
  const mondayMonth = monday.toLocaleDateString('en-KE', { month: 'short' });
  const mondayDay = monday.getDate();
  
  const sundayMonth = sunday.toLocaleDateString('en-KE', { month: 'short' });
  const sundayDay = sunday.getDate();

  // If both days are in the same month: "Sep 7 – 13"
  if (mondayMonth === sundayMonth) {
    return `${mondayMonth} ${mondayDay} – ${sundayDay}`;
  }

  // If the week spans across two months: "Aug 31 – Sep 6"
  return `${mondayMonth} ${mondayDay} – ${sundayMonth} ${sundayDay}`;
}

interface TaskAccordionProps {
  bucket: BucketType;
  tasks: Task[];
  defaultOpen?: boolean;
  sublabel?: string;
}
export const TaskAccordion: React.FC<TaskAccordionProps> = ({
  bucket,
  tasks,
  defaultOpen = false,
  sublabel,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // Configuration map 
  const styles: Record<BucketType, {
    headerBg: string;
    iconBg: string;
    icon: React.ReactNode;
    badgeBg: string;
    badgeText: string;
    title: string;
    bucketText: string;
  }> = {
    overdue: {
      headerBg: 'bg-red-200/60 hover:bg-red-200 text-red-950',
      iconBg: 'bg-[#BA1A1A] text-white',
      icon: <AlertCircle className="w-5 h-5 stroke-2 " />,
      badgeBg: 'bg-[#BA1A1A]',
      badgeText: 'text-white',
      title: 'text-red-950',
      bucketText: 'Overdue',
    },
    today: {
      headerBg: 'bg-[#F1EBFC] hover:bg-[#6A556B]/20',
      iconBg: 'bg-[#6A556B] text-white',
      icon: <Calendar className="w-5 h-5 stroke-2" />,
      badgeBg: 'bg-[#6A556B]',
      badgeText: 'text-white',
      title: 'text-slate-900',
      bucketText: 'Today',
    },
    thisWeek: {
      headerBg: 'hover:bg-slate-50',
      iconBg: 'bg-[#EDDDF6] text-slate-700',
      icon: <CalendarDays className="w-5 h-5" />,
      badgeBg: 'bg-[#EDDDF6]',
      badgeText: 'text-slate-700',
      title: 'text-slate-900',
      bucketText: 'This Week',
    },
    later: {
      headerBg: 'hover:bg-secondary/25',
      iconBg: 'bg-[#E6E0F1] text-slate-700',
      icon: <Clock className="w-5 h-5" />,
      badgeBg: 'bg-[#E6E0F1]',
      badgeText: 'text-slate-700',
      title: 'text-slate-900',
      bucketText: 'Later',
    },
    noDueDate: {
      headerBg: 'hover:bg-secondary/25',
      iconBg: 'bg-[#EBE5F6] text-slate-700',
      icon: <InfinityIcon className="w-5 h-5" />,
      badgeBg: 'bg-[#EBE5F6]',
      badgeText: 'text-slate-700',
      title: 'text-slate-900',
      bucketText: 'No Due Date',
    },
    done: {
      headerBg: 'hover:bg-slate-100',
      iconBg: 'bg-[#E4E3DB] text-slate-700',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-700',
      title: 'text-slate-900',
      bucketText: 'Done',
    },
  };

  // Safely grab current bucket configuration with fallback to 'today'
  const config = styles[bucket] || styles.today;

  // Optional: Hide accordion completely if there are no tasks
  if (!tasks || tasks.length === 0) return null;
  if (bucket==='today') { sublabel=getFormattedDate();}
  else if (bucket==='thisWeek') { sublabel=getFormattedWeekRange();}

  return (
    <div className="overflow-hidden rounded-xl border border-primary/30 bg-white ">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between p-2 px-5 text-left transition-colors cursor-pointer ${config.headerBg}`}
      >
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className={`p-1.5 rounded-lg flex items-center justify-center ${config.iconBg}`}>
            {config.icon}
          </div>

          {/* Bucket Title */}
          <h2 className={`uppercase font-semibold font-sister tracking-wider ${config.title}`}>
            {config.bucketText}
          </h2>

          {/* Task Count Badge */}
          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${config.badgeBg} ${config.badgeText}`}>
            {tasks.length}
          </span>

          {/* Optional Sublabel (e.g. "Tuesday, 1 Sept") */}
          {sublabel && (
            <span className="text-xs text-slate-500 font-medium ml-1 max-sm:hidden">
              {sublabel}
            </span>
          )}
        </div>

        {/* Expand/Collapse Chevron */}
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-3 pt-0 flex flex-col gap-2 bg-slate-50/30 border-t border-slate-100">
          <div className="pt-2 flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskListItem
                key={task._id}
                task={task}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ViewTasks({tasks,loading}: {tasks: Task[],loading: boolean}) {
    const buckets = bucketTasks(tasks);
    return (
        <div className="flex flex-col gap-6"> 
            {/* Render Task Accordions */}
            {!loading && (
                <div className="flex flex-col gap-4">
                    {Object.entries(buckets).map(([bucketKey, bucketTasks]) => {
                        // Cast the bucket string to BucketType for type safety
                        const bucket = bucketKey as BucketType;

                        return (
                            <TaskAccordion
                                key={bucket}
                                bucket={bucket}
                                tasks={bucketTasks}
                                defaultOpen={bucket === 'overdue' || bucket === 'today'}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

