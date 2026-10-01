import { useEffect, useState } from "react";
import TimetableSetup from "../components/Timetable/TimetableSetup";
import ViewToggle, { ViewMode } from "../components/Timetable/ViewToggle";
import Daily from "../components/Timetable/View_Daily";
import Weekly from "../components/Timetable/View_Weekly";
import TimetableHeader from "../components/Timetable/TimetableHeader";
import ActionButton from "../components/Shared/Button";
import { Settings, Upload } from "lucide-react";
import Dates from "../components/Timetable/Dates";
import Timetable_Settings from "../components/Timetable/TimetableSettings";
import { TimetableSettings } from "../services/timetableService";
import { useApp } from "../contexts/AppContext";

export default function Timetable() {
    const { isAlreadySetup, isLoading} = useApp();
    const [view, setView] = useState<ViewMode>("Daily");
    const [date, setDate] = useState<Date>(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 1. Show loading placeholder
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isAlreadySetup) {
        return <TimetableSetup />;
    }

    return (
        <>
            <div className="flex flex-col gap-6 max-md:gap-2">
                <div className="flex justify-between items-center max-md:hidden ">
                    <TimetableHeader />
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
                            className="w-10 h-10 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                            onClick={() => setIsSettingsOpen(true)}
                        />

                    </div>
                </div>
                <div className="flex justify-between max-md:flex-col-reverse max-md:gap-2">
                    <Dates activeView={view} date={date} onDateChange={setDate} />
                    <ViewToggle activeView={view} onViewChange={setView} />
                </div>
                {/* View rendering based on lifted state */}
                {view === "Daily" && (
                    <Daily date={date} />
                )}
                {view === "Weekly" && (
                    <Weekly date={date}/>
                )}
                <div>

                </div>
            </div>
            {/* Mobile Buttons */}
            <div className="fixed bottom-20 right-6 flex justify-between items-center md:hidden ">
                <div className="flex flex-col gap-2">
                    <ActionButton
                        icon={Upload}
                        bgColor='bg-primary hover:opacity-60'
                        iconColor="text-white"
                        className="rounded-full! w-12 h-12 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                    />
                    <ActionButton
                        icon={Settings}
                        bgColor='bg-primary hover:opacity-60'
                        iconColor="text-white"
                        className="rounded-full! w-12 h-12 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                        onClick={() => setIsSettingsOpen(true)}
                    />
                </div>
            </div>
            <Timetable_Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}
