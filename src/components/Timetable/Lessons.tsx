import { PlusCircle } from "lucide-react";
import { ViewMode } from "./ViewToggle";
import { useEffect, useState, useMemo } from "react";
import { getLessons, Lesson as APILesson } from "../../services/lessonService";
import AddLesson from "./AddLesson";
import { useLessons } from "../../hooks/useLessons";

const EmptySlot = ({ onClick }: { onClick: () => void }) => {
    return (  
        <button
            type="button"
            onClick={onClick}
            className="flex-1 flex flex-row items-center justify-center gap-2 py-8 rounded-md border-2 border-dashed border-neutral-300/80 hover:border-neutral-400 text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer"
        >
            <PlusCircle className="w-6 h-6 stroke-[1.5]" />
            <span className="font-sister text-md tracking-wide">Add Lesson</span>
        </button>
    );
};

const LessonCard = ({ lesson }: { lesson: APILesson }) => {
    return (
        <div className="flex-1 p-4 rounded-md max-md:rounded-xl border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors shadow-sm">
            <h3 className="font-sister font-bold text-lg text-primary">{lesson.unitName}</h3>
            <p className="text-sm font-medium text-neutral-700 mt-1">{lesson.time} <span className="text-neutral-400 mx-1">|</span> {lesson.venue}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{lesson.lecturer}</p>
        </div>
    );
};

const DailyLessonTask = () => {
  return (
        <div className="p-4 rounded-md max-md:rounded-xl border-2 border-neutral-200 bg-white shadow-sm flex flex-col items-center justify-center text-neutral-400 hover:border-primary/30 transition-colors cursor-pointer">
            <span className="font-sister tracking-wide">Tasks</span>
        </div>
  )
}

function DailyLessons({ date }: { date: Date }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(1);

    const { data: allLessons = [], invalidateLessons } = useLessons();

    const lessons = useMemo(() => {
        const targetDateStr = date.toISOString().split('T')[0];
        const targetDateObj = new Date(targetDateStr);
        const targetDayOfWeek = targetDateObj.getDay();

        const todaysSlots = new Map<number, APILesson>();

        // First pass: find repeating lessons that apply today
        allLessons.forEach((l: APILesson) => {
            if (l.repeat === 'weekly' || l.repeat === 'bi-weekly') {
                const lessonDateObj = new Date(l.dateKey);
                
                // It must start on or before the target date and fall on the same day of the week
                if (lessonDateObj <= targetDateObj && lessonDateObj.getDay() === targetDayOfWeek) {
                    if (l.repeat === 'weekly') {
                        todaysSlots.set(l.slot, l);
                    } else if (l.repeat === 'bi-weekly') {
                        // Calculate exact week difference
                        const diffTime = Math.abs(targetDateObj.getTime() - lessonDateObj.getTime());
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        const diffWeeks = Math.floor(diffDays / 7);
                        
                        // Check if it's an even number of weeks since start
                        if (diffWeeks % 2 === 0) {
                            todaysSlots.set(l.slot, l);
                        }
                    }
                }
            }
        });

        // Second pass: apply exact date matches (overrides repeating lessons if they exist)
        allLessons.forEach((l: APILesson) => {
            if (l.dateKey === targetDateStr) {
                if (l.unitName === '__HIDDEN__') {
                    todaysSlots.delete(l.slot); // Cancelled for this day
                } else {
                    todaysSlots.set(l.slot, l); // Specific lesson overrides
                }
            }
        });

        return Array.from(todaysSlots.values());
    }, [allLessons, date]);

    const handleLessonAdded = () => {
        invalidateLessons();
        setIsModalOpen(false);
    };

    const handleAddClick = (slot: number) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const slots = [1, 2, 3, 4, 5]; // Example slots

    return(
      <div className="flex flex-col gap-4">
        {slots.map(slot => {
            const lesson = lessons.find(l => l.slot === slot);
            return (
                <div key={slot} className="grid grid-cols-[3fr_1fr] gap-2">
                    {lesson ? (
                        <LessonCard lesson={lesson} />
                    ) : (
                        <EmptySlot onClick={() => handleAddClick(slot)} />
                    )}
                    <DailyLessonTask />  
                </div>
            );
        })}
        <AddLesson 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLessonAdded={handleLessonAdded}
            date={date}
            slot={selectedSlot}
        />
      </div>  
    )
}

function WeeklyLessons({ date }: { date: Date }){
    return(
        <div>WeeklyLessons: {date.toDateString()}</div>
    )
}

export default function Lessons({ activeView, date }: { activeView: ViewMode, date: Date }) {
    if (activeView === "Daily") {
        return <DailyLessons date={date} />;
    }
    return <WeeklyLessons date={date} />;
}