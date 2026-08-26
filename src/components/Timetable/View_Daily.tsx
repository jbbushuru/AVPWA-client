import { useState, useMemo, useEffect } from "react";
import AddLesson from "./AddLesson";
import { PlusCircle } from "lucide-react";
import { Lesson as APILesson } from "../../services/lessonService";
import { useApp } from "../../contexts/AppContext";
import { useLessons } from "../../hooks/useLessons";
import { useActiveLessonTimer } from "../../hooks/useActiveLessonTimer";
import { isLessonOngoing } from "../../utils/getOngoingStatus";
import { EmptySlot, LessonCard } from "./LessonCards";

const LessonCounter = ({ count }: { count: number }) => {
    const { settings } = useApp();
    const slots = settings?.maxLessons;
    const lessonSlots = [...Array(slots ? slots : 5)];

    return (
        <div className="flex items-center justify-between w-full">
            <p
                className="text-sm font-normal flex-1 max-md:text-xs"
            >   {count} of {slots ? slots : 5} lessons added
            </p>

            <div className="flex items-center gap-3 flex-1 max-md:gap-1.5">
                {lessonSlots.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 max-md:h-1 w-full rounded-full transition-colors duration-200 ${i < count ? "bg-primary" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
const DailyLessonTask = () => {
    return (
        <button
            type="button"
            onClick={() => alert('Not Implemented yet!')}
            className="flex-1 w-full flex flex-row items-center justify-center gap-2 py-8 max-md:py-6 rounded-md max-md:rounded-xl border border-dashed border-primary hover:bg-primary/10 text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer"
        >
            <PlusCircle className="w-4 h-4 md:w-6 md:h-6 stroke-1 md:stroke-[1.5] stroke-primary" />
            <span className="max-md:hidden font-sister text-md text-primary tracking-wide">Add Task</span>
        </button>
    )
}

function DailyLessons({ date, lessons }: { date: Date; lessons: APILesson[] }) {
    const { settings } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const currentTime = useActiveLessonTimer();

    const { invalidateLessons } = useLessons();

    const handleLessonAdded = () => {
        invalidateLessons();
        setIsModalOpen(false);
    };

    const handleAddClick = (slot: number) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const numSlots = settings?.maxLessons || 5;
    const slots = Array.from({ length: numSlots }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-4">
            {slots.map(slot => {
                const lesson = lessons.find(l => l.slot === slot);
                return (
                    <div key={slot}>
                        {lesson ? (
                            <div className="grid grid-cols-[3fr_1fr] gap-3">
                                <LessonCard lesson={lesson} date={date} currentTime={currentTime} view="daily" />
                                <DailyLessonTask />
                            </div>
                        ) : (
                            <EmptySlot onClick={() => handleAddClick(slot)} />
                        )}

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

export default function Daily({ date }: { date: Date }) {
    const { data: allLessons = [] } = useLessons();

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

    return (
        <div className="flex flex-col gap-6 max-md:gap-4 max-md:pb-15">
            <LessonCounter count={lessons.length} />
            <DailyLessons date={date} lessons={lessons} />
        </div>
    )
}