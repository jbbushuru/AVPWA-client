import { useState } from "react";
import TimetableSetup from "../components/Timetable/TimetableSetup";
import ViewToggle, { ViewMode } from "../components/Timetable/ViewToggle";
import Daily from "../components/Timetable/View_Daily";
import Weekly from "../components/Timetable/View_Weekly";
import TimetableHeader from "../components/Timetable/TimetableHeader";
import ActionButton from "../components/Shared/Button";
import { Settings, Upload } from "lucide-react";
import Dates from "../components/Timetable/Dates";
import Lessons from "../components/Timetable/Lessons";
import TimetableSettings from "../components/Timetable/TimetableSettings";

export default function Timetable() {
    const [isAlreadySetup, setIsAlreadySetup] = useState(true);
    const [view, setView] = useState<ViewMode>("Daily");
    const [date, setDate] = useState<Date>(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!isAlreadySetup) {
        return <TimetableSetup />;
    }

    return (
        <>
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center ">
            <TimetableHeader/>
            <div className="flex gap-4">
                <ActionButton 
                text="Upload Timetable"
                icon={Upload}
                bgColor='bg-white'
                borderColor="border-primary"
                iconColor="text-primary"
                textColor='text-primary'
                /> 
                <ActionButton 
                icon={Settings}
                bgColor='bg-primary hover:opacity-60'
                iconColor="text-white"
                className="rounded-full w-10 h-10 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                onClick={() => setIsSettingsOpen(true)}
                />    
                 
            </div>
            </div>
            <div className="flex justify-between">
                <Dates activeView={view} date={date} onDateChange={setDate} />
                <ViewToggle activeView={view} onViewChange={setView} />
            </div>
            {/* View rendering based on lifted state */}
            {view === "Daily" && (
                <Daily date={date} />
            )}
            {view === "Weekly" && (
                <Weekly />
            )}
            <div>
                
            </div>
        </div>
        <TimetableSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}
