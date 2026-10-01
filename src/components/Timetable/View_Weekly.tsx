import { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { PlusCircle } from "lucide-react";
import { useLessons } from "../../hooks/useLessons";
import { useActiveLessonTimer } from "../../hooks/useActiveLessonTimer";
import AddLesson from "./AddLesson";
import { Lesson as APILesson } from "../../services/lessonService";
import { isLessonOngoing } from "../../utils/getOngoingStatus";
import { EmptySlot, LessonCard } from "./LessonCards";

//----------Helper function to get dates of the week----------
function getWeekDates(anchorDate: Date): Date[] {
    const date = new Date(anchorDate);
    const day = date.getDay();

    const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diffToMonday));

    return Array.from({ length: 7 }, (_, i) => {
        const weekDay = new Date(monday);
        weekDay.setDate(monday.getDate() + i);
        return weekDay;
    });
}
const SlotTag = ({ slot }: { slot: number }) => {
    return (
        <div className="flex justify-center items-center bg-amber-100 text-amber-800 border border-amber-200/50 p-2 rounded-full max-md:p-1.5 w-8 h-8 max-md:w-6 max-md:h-6">
            <p className="text-sm font-medium max-md:text-[10px]">L{slot}</p>
        </div>
    )
}
const DayOfWeek = ({ date }: { date: Date }) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const thisDate = date.toLocaleDateString('en-US', { day: 'numeric' });
    const isToday = date.toDateString() === new Date().toDateString();

    return (
        <div className={`flex flex-col items-center justify-center w-full uppercase max-md:text-sm border flex-1 h-full rounded-md border-primary ${isToday ? 'text-white bg-primary font-extrabold tracking-wider' : 'font-semibold'}`}>
            <p>{day}</p>
            <p>{thisDate}</p>
        </div>
    )
}
function WeeklyLessons({ dates, maxLessons }: { dates: Date[], maxLessons: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { data: allLessons = [], invalidateLessons } = useLessons();
    const currentTime = useActiveLessonTimer();

    const slots = Array.from({ length: maxLessons }, (_, i) => i + 1);

    const handleLessonAdded = () => {
        invalidateLessons();
        setIsModalOpen(false);
    };

    const handleAddClick = (slot: number, date: Date) => {
        setSelectedSlot(slot);
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full overflow-x-auto pb-15">
            <div className="min-w-3xl">
                {/* Header Row */}
                <div className="grid" style={{ gridTemplateColumns: `80px repeat(${maxLessons}, minmax(0, 1fr))` }}>
                    <div />
                {slots.map((slot) => (
                    <div key={`header-${slot}`} className="p-2 flex items-center justify-center">
                        <SlotTag slot={slot} />
                    </div>
                ))}
            </div>

            {/* Matrix Rows */}
            {dates.map((date, index) => {
                // Determine lessons for this day
                const targetDateStr = date.toISOString().split('T')[0];
                const targetDateObj = new Date(targetDateStr);
                const targetDayOfWeek = targetDateObj.getDay();

                const todaysSlots = new Map<number, APILesson>();

                allLessons.forEach((l: APILesson) => {
                    if (l.repeat === 'weekly' || l.repeat === 'bi-weekly') {
                        const lessonDateObj = new Date(l.dateKey);
                        if (lessonDateObj <= targetDateObj && lessonDateObj.getDay() === targetDayOfWeek) {
                            if (l.repeat === 'weekly') {
                                todaysSlots.set(l.slot, l);
                            } else if (l.repeat === 'bi-weekly') {
                                const diffTime = Math.abs(targetDateObj.getTime() - lessonDateObj.getTime());
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                const diffWeeks = Math.floor(diffDays / 7);
                                if (diffWeeks % 2 === 0) {
                                    todaysSlots.set(l.slot, l);
                                }
                            }
                        }
                    }
                });

                allLessons.forEach((l: APILesson) => {
                    if (l.dateKey === targetDateStr) {
                        if (l.unitName === '__HIDDEN__') {
                            todaysSlots.delete(l.slot);
                        } else {
                            todaysSlots.set(l.slot, l);
                        }
                    }
                });

                return (
                    <div key={`row-${index}`} className="grid" style={{ gridTemplateColumns: `80px repeat(${maxLessons}, minmax(0, 1fr))` }}>
                        {/* Day Column */}
                        <div className="p-2 flex items-stretch justify-center h-full">
                            <DayOfWeek date={date} />
                        </div>

                        {/* Slots Columns */}
                        {slots.map((slot) => {
                            const lesson = todaysSlots.get(slot);
                            return (
                                <div key={`cell-${index}-${slot}`} className="p-2 flex items-stretch justify-center h-full">
                                    {lesson ? <LessonCard lesson={lesson} date={date} currentTime={currentTime} /> : <EmptySlot onClick={() => handleAddClick(slot, date)} view="weekly"/>}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            </div>

            <AddLesson
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLessonAdded={handleLessonAdded}
                date={selectedDate}
                slot={selectedSlot}
            />
        </div>
    );
}

export default function Weekly({ date }: { date: Date }) {
    const { settings } = useApp();
    const maxLessons = settings?.maxLessons || 5;
    const dates = getWeekDates(date);

    return (
        <WeeklyLessons dates={dates} maxLessons={maxLessons} />
    )
}