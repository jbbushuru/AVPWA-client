import { Bell, BellRing, Clock, LayoutGrid, Save, Sunrise, Timer } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useState, useEffect } from "react";
import { setTimetableSettings } from "../../services/timetableService";
// ── Small reusable components ─────────────────────────────────────────────────

interface IconCircleProps {
    color: string;
    children: React.ReactNode;
}
function IconCircle({ color, children }: IconCircleProps) {
    return (
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '18' }}
        >
            {children}
        </div>
    );
}

interface SectionProps {
    children: React.ReactNode;
    danger?: boolean;
}
function Section({ children, danger }: SectionProps) {
    return (
        <div
            className="px-0 py-2 mt-1 md:mb-4 flex flex-col md:flex-row items-start md:items-center justify-between"
            style={danger ? { borderColor: '#EF444440' } : { borderColor: 'var(--border-main)' }}
        >
            {children}
        </div>
    );
}

interface SectionHeaderProps {
    icon: React.ReactNode;
    title?: string;
    subtitle?: string;
    right?: React.ReactNode;
}
function SectionHeader({ icon, title, subtitle, right }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-4 max-md:w-full">
            <div className="hidden md:block">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xl font-sister leading-tight">
                    {title}
                </p>
                <p className="text-[12px] mt-0.5 text-(--text-muted)">{subtitle}</p>
            </div>
            {right}
        </div>
    );
}

interface PillSelectProps {
    options: { label: string; value: number }[];
    value: number;
    onChange: (v: number) => void;
}
function PillSelect({ options, value, onChange }: PillSelectProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-3 md:px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${value === opt.value
                            ? 'bg-primary text-white border-primary shadow-sm scale-[1.03]'
                            : 'border-(--border-main) text-(--text-muted) hover:border-primary/60 hover:text-primary bg-(--bg-main)'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

interface TimePickerProps {
    value: string;
    onChange: (v: string) => void;
}
function TimePicker({ value, onChange }: TimePickerProps) {
    const to24Hour = (time12h: string) => {
        if (!time12h || !time12h.includes(' ')) return "08:00"; // fallback if invalid
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = (parseInt(hours, 10) + 12).toString();
        }
        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const to12Hour = (time24h: string) => {
        if (!time24h) return "08:00 AM";
        const [hours24, minutes] = time24h.split(':');
        let hours = parseInt(hours24, 10);
        const modifier = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
    };

    return (
        <div className="relative flex items-center justify-between  p-4 py-2  rounded-xl border border-(--border-main) bg-(--bg-main) text-(--text-main) hover:border-primary/60 hover:text-primary transition-all duration-200 focus-within:border-primary focus-within:text-primary">
            <div className="text-[14px] font-semibold ">{value || "08:00 AM"}</div>
            <div className="hidden md:block">
            <Clock className="text-(--text-muted) pointer-events-none self-center ml-3 -mt-[1.5px]" size={14}/>
            </div>
            <input
                type="time"
                value={to24Hour(value)}
                onChange={e => onChange(to12Hour(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    );
}

interface ToggleProps {
    checked: boolean;
    onChange: (v: boolean) => void;
    accentColor?: string;
}
function Toggle({ checked, onChange, accentColor = '#10B981' }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 border-[2px] border-transparent"
            style={{ backgroundColor: checked ? accentColor : 'var(--border-main)' }}
        >
            <span className={`absolute left-1.5 text-[10px] font-bold text-white transition-opacity duration-200 pointer-events-none ${checked ? 'opacity-100' : 'opacity-0'}`}>
                ON
            </span>
            <span className={`absolute right-1.5 text-[10px] font-bold text-(--text-muted) transition-opacity duration-200 pointer-events-none ${!checked ? 'opacity-100' : 'opacity-0'}`}>
                OFF
            </span>
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-200 z-10 ${checked ? 'translate-x-7' : 'translate-x-0'}`}
            />
        </button>
    );
}
export default function TimetableSetup() { 
const {setSettings, settings, fetchUserSettings} = useApp();

const defaultDraft = {
    maxLessons: 0,
    lessonDuration: 0,
    firstLessonStartTime: "08:00 AM",
    notificationsEnabled: false,
    alertLeadTime: 0,
};

const [draft, setDraft] = useState(settings || defaultDraft);   
const [isSaving, setIsSaving] = useState(false);
const updateDraft = (updates: Partial<typeof draft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
};

const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings || defaultDraft);
const isValid = draft.maxLessons > 0 && 
                draft.lessonDuration > 0 && 
                !!draft.firstLessonStartTime &&
                (!draft.notificationsEnabled || draft.alertLeadTime > 0);
const canSave = hasChanges && isValid;

const saveSettings = async () => {
    try {
        setIsSaving(true);
        const updatedSettings = await setTimetableSettings(draft as any);
        setSettings(updatedSettings);
    } catch (error) {
        console.error('Error saving timetable settings:', error);
    } finally {
        setIsSaving(false);
        fetchUserSettings();
    }
};
function getFormattedDate() {
    return new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
return(
    <div className="pb-24 md:pb-0">
        {/* Header */}
        <div className="flex items-center  shrink-0"
            style={{ backgroundColor: 'var(--primary)' + '0d' }}>
            <div>
                <h2 className="text-xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight">Timetable Set Up</h2>
                <div className="text-primary text-xs md:text-[14px] font-semibold tracking-wide">
                    {getFormattedDate()}
                </div>
                <p className="text-slate-500 text-xs md:text-[14px] font-normal leading-relaxed">Configure your timetable to fit your academic routine</p>
            </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 py-2 md:py-6">
            {/* ── Max Lessons ─────────────────────────────────── */}
            <Section>
                <SectionHeader
                    icon={<IconCircle color="#10B981"><LayoutGrid size={16} color="#10B981" /></IconCircle>}
                    title="Max Lessons Per Day"
                    subtitle="What is the maximum number of lessons you can have in a day?"
                />
                <PillSelect
                    options={[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ label: `${n}`, value: n }))}
                    value={draft.maxLessons}
                    onChange={(v: number) => updateDraft({ maxLessons: v })}
                />
            </Section>

            {/* ── Lesson Duration ─────────────────────────────── */}
            <Section>
                <SectionHeader
                    icon={<IconCircle color="#6366F1"><Timer size={16} color="#6366F1" /></IconCircle>}
                    title="Lesson Duration"
                    subtitle="How long is each lesson in hours?"
                />
                <PillSelect
                    options={[1, 2, 3].map(n => ({ label: `${n}h`, value: n }))}
                    value={draft.lessonDuration}
                    onChange={v => updateDraft({ lessonDuration: v })}
                />
            </Section>

            {/* ── Start Time ──────────────────────────────────── */}
            <Section>
                <SectionHeader
                    icon={<IconCircle color="#F59E0B"><Sunrise size={16} color="#F59E0B" /></IconCircle>}
                    title="First Lesson Starts At"
                    subtitle="What time does your first lesson of the day start?"
                />
                <TimePicker
                    value={draft.firstLessonStartTime as any}
                    onChange={v => updateDraft({ firstLessonStartTime: v as any })}
                />
            </Section>

            {/* ── Notifications ───────────────────────────────── */}
            <Section>
                <SectionHeader
                    icon={<IconCircle color="#10B981"><Bell size={16} color="#10B981" /></IconCircle>}
                    title='Lesson Reminders'
                    right={
                        <Toggle
                            checked={draft.notificationsEnabled ?? true}
                            onChange={v => {
                                updateDraft({ notificationsEnabled: v });
                            }}
                            accentColor="#10B981"
                        />
                    }
                />
            </Section>
                {draft.notificationsEnabled && (
                    <Section>
                        <SectionHeader
                            icon={<IconCircle color="#10B981"><BellRing size={16} color="#10B981" /></IconCircle>}
                            subtitle="How early do you want reminders before your next class?"
                        />
                        <PillSelect
                        options={[5, 10, 15, 30, 60].map(m => ({ label: `${m} m`, value: m }))}
                        value={draft.alertLeadTime ?? 15}
                        onChange={v => updateDraft({ alertLeadTime: v })}
                    />
                </Section>
            )}
            
            <div className="h-4" />
        </div>
        {/* ── Save Bar ─────────────────────────────────────── */}
        <button
            type="button"
            onClick={saveSettings}
            disabled={isSaving || !canSave}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[15px]
                transition-all duration-200 shadow-md ${!canSave ? 'bg-gray-200 text-gray-400 translate-y-2 pointer-events-none' : 'bg-primary text-white opacity-100 translate-y-0'
            } ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98] cursor-pointer'}`}
        >
            <Save size={18} />
            {isSaving ? 'Saving Settings...' : 'Set Up Timetable'}
        </button>
    </div>
)
}