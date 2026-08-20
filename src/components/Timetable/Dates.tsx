import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFormattedDate, getFormattedWeekRange } from "../../utils/formatters";
import { ViewMode } from "./ViewToggle";

interface DatesProps {
    activeView: ViewMode;
    date: Date;
    onDateChange: (date: Date) => void;
}

export default function Dates({ activeView, date, onDateChange }: DatesProps) {
    const handlePrevious = () => {
        const newDate = new Date(date);
        if (activeView === "Daily") {
            newDate.setDate(date.getDate() - 1);
        } else {
            newDate.setDate(date.getDate() - 7);
        }
        onDateChange(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(date);
        if (activeView === "Daily") {
            newDate.setDate(date.getDate() + 1);
        } else {
            newDate.setDate(date.getDate() + 7);
        }
        onDateChange(newDate);
    };

    return (
        <div className="inline-flex items-center justify-between py-2 select-none gap-6">
            {/* Prev */}
            <button
                type="button"
                className="text-(--text-main) opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center p-1"
                aria-label="Previous date"
                onClick={handlePrevious}
            >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Date */}
            <h2 className="font-sister text-xl font-normal text-(--text-main) tracking-wide text-center">
                {activeView === "Weekly" ? getFormattedWeekRange(date) : getFormattedDate(date)}
            </h2>

            {/* Next */}
            <button
                type="button"
                className="text-(--text-main) opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center p-1"
                aria-label="Next date"
                onClick={handleNext}
            >
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
        </div>
    );
}