import { useEffect, useState } from "react";
import AddLesson from "./AddLesson";
import { PlusCircle } from "lucide-react";
import { getLessons, Lesson as APILesson } from "../../services/lessonService";

const LessonCounter = ({ count, slots }: { count: number, slots: number }) => {
    const lessonSlots = Array.from({ length: slots }, (_, i) => i);

    return (
        <div className="flex items-center justify-between w-full">
            <p
                className="text-sm font-normal flex-1"
            >   {count} of {slots} lessons added
            </p>

            <div className="flex items-center gap-3 flex-2">
                {lessonSlots.map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-full rounded-full transition-colors duration-200 ${
                            i < count ? "bg-purple-600" : "bg-purple-200"
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
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
        <div className="flex-1 p-4 rounded-md border bg-blue-50/50">
            <h3 className="font-bold text-lg">{lesson.unitName}</h3>
            <p className="text-sm text-neutral-600">{lesson.time} | {lesson.venue}</p>
            <p className="text-sm text-neutral-500">{lesson.lecturer}</p>
        </div>
    );
};

const DailyLessonTask = () => {
    return (
        <div className="p-4 border rounded-md bg-neutral-50"> Task </div>
    )
}

function DailyLessons({ date }: { date: Date }) {
    const [lessons, setLessons] = useState<APILesson[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(1);

    const fetchDailyLessons = async () => {
        try {
            const data: any = await getLessons();
            // Handle if backend returns { count, lessons } or just array
            const allLessons: APILesson[] = data.lessons || data || [];

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

            setLessons(Array.from(todaysSlots.values()));
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
        }
    };

    useEffect(() => {
        fetchDailyLessons();
    }, [date]);

    const handleAddClick = (slot: number) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const slots = [1, 2, 3, 4, 5]; // Example slots

    return (
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
                onLessonAdded={fetchDailyLessons}
                date={date}
                slot={selectedSlot}
            />
        </div>
    )
}

export default function Daily({ date }: { date: Date }) {
    const count = 2;
    const slots = 5;
    return (
        <div className="flex flex-col gap-6">
            <LessonCounter count={count} slots={slots} />
            <DailyLessons date={date} />
        </div>
    )
}