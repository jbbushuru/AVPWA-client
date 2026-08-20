import { useState } from 'react';
import {
    X,
    Clock,
    LayoutGrid,
    Timer,
    Sunrise,
    RotateCcw,
    Trash2,
    CalendarDays,
    Save,
    Bell,
    BellRing,
} from 'lucide-react';

// ─── Minimal local types (mirror your mobile TimetableContext) ────────────────
interface TimetableSettings {
    maxLessons: number;
    lessonDuration: number;
    firstLessonStartTime: number;
    notificationsEnabled: boolean;
    alertLeadTime: number;
    hasOnboarded: boolean;
}

// Stub hook – replace with your real TimetableContext when wired up
function useTimetable() {
    const [settings, setSettings] = useState<TimetableSettings>({
        maxLessons: 5,
        lessonDuration: 1,
        firstLessonStartTime: 8,
        notificationsEnabled: true,
        alertLeadTime: 15,
        hasOnboarded: true,
    });

    const lessons: Record<string, Record<string, unknown>> = {};

    const updateSettings = (next: TimetableSettings) => setSettings(next);
    const resetTimetable = (cb?: () => void) => { cb?.(); };
    const clearAllLessons = () => {};

    return { settings, updateSettings, resetTimetable, clearAllLessons, lessons };
}
// ─────────────────────────────────────────────────────────────────────────────

interface TimetableSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

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
            className="rounded-2xl p-5 mb-4 border bg-(--bg-card)"
            style={danger ? { borderColor: '#EF444440' } : { borderColor: 'var(--border-main)' }}
        >
            {children}
        </div>
    );
}

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    titleColor?: string;
    right?: React.ReactNode;
}
function SectionHeader({ icon, title, subtitle, titleColor, right }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold font-sister leading-tight" style={{ color: titleColor ?? 'var(--text-main)' }}>
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
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${
                        value === opt.value
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

interface DangerActionProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
    onClick: () => void;
}
function DangerAction({ icon, title, subtitle, color, onClick }: DangerActionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left"
            style={{
                borderColor: color + '35',
                backgroundColor: color + '08',
            }}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <p className="text-[14px] font-semibold" style={{ color }}>{title}</p>
                <p className="text-[11px] mt-0.5 text-(--text-muted)">{subtitle}</p>
            </div>
        </button>
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
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0"
            style={{ backgroundColor: checked ? accentColor : 'var(--border-main)' }}
        >
            <span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: checked ? 'translateX(22px)' : 'translateX(4px)' }}
            />
        </button>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TimetableSettings({ isOpen, onClose }: TimetableSettingsProps) {
    const { settings, updateSettings, resetTimetable, clearAllLessons, lessons } = useTimetable();

    const [draft, setDraft] = useState<TimetableSettings>({ ...settings });
    const [hasChanges, setHasChanges] = useState(false);

    const updateDraft = (patch: Partial<TimetableSettings>) => {
        setDraft(prev => ({ ...prev, ...patch }));
        setHasChanges(true);
    };

    const handleSave = () => {
        updateSettings({ ...draft, hasOnboarded: true });
        setHasChanges(false);
        onClose();
    };

    // Stats
    const totalLessonDays = Object.keys(lessons).length;
    const totalLessons = Object.values(lessons).reduce(
        (acc, day) => acc + Object.keys(day).length, 0
    );

    // Option arrays
    const maxLessonOptions = [3, 4, 5, 6, 7, 8].map(n => ({ label: `${n}`, value: n }));
    const durationOptions = [1, 2, 3].map(n => ({ label: `${n}h`, value: n }));
    const startTimeOptions = [6, 7, 8, 9, 10, 11].map(h => ({ label: `${h}:00 AM`, value: h }));
    const leadTimeOptions = [5, 10, 15, 30, 60].map(m => ({ label: `${m} min`, value: m }));

    return (
        <>
            {/* ── Backdrop ──────────────────────────────────────────────── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-300 ${
                    isOpen
                        ? 'bg-black/30 backdrop-blur-sm pointer-events-auto'
                        : 'bg-transparent pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* ── Drawer ────────────────────────────────────────────────── */}
            <div
                className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-(--bg-card) shadow-2xl
                    transition-transform duration-300 ease-in-out
                    w-full sm:w-[420px]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-main) flex-shrink-0"
                    style={{ backgroundColor: 'var(--primary)' + '0d' }}>
                    <div>
                        <h2 className="text-[17px] font-bold text-(--text-main) tracking-tight">Timetable Settings</h2>
                        <p className="text-[12px] text-(--text-muted) mt-0.5">Configure your schedule preferences</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-muted) hover:text-(--text-main) hover:bg-(--bg-main) transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-4 py-5">

                    {/* ── Quick Stats ─────────────────────────────────── */}
                    <div
                        className="flex items-center justify-around rounded-2xl p-4 mb-5 border"
                        style={{
                            backgroundColor: 'var(--primary)' + '10',
                            borderColor: 'var(--primary)' + '28',
                        }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <CalendarDays size={18} className="text-primary" />
                            <span className="text-[20px] font-bold text-(--text-main)">{totalLessonDays}</span>
                            <span className="text-[11px] font-medium text-(--text-muted)">Days</span>
                        </div>

                        <div className="w-px h-10" style={{ backgroundColor: 'var(--primary)' + '25' }} />

                        <div className="flex flex-col items-center gap-1">
                            <LayoutGrid size={18} className="text-primary" />
                            <span className="text-[20px] font-bold text-(--text-main)">{totalLessons}</span>
                            <span className="text-[11px] font-medium text-(--text-muted)">Lessons</span>
                        </div>

                        <div className="w-px h-10" style={{ backgroundColor: 'var(--primary)' + '25' }} />

                        <div className="flex flex-col items-center gap-1">
                            <Clock size={18} className="text-primary" />
                            <span className="text-[20px] font-bold text-(--text-main)">
                                {draft.lessonDuration}{draft.lessonDuration === 1 ? 'hr' : 'hrs'}
                            </span>
                            <span className="text-[11px] font-medium text-(--text-muted)">Per Class</span>
                        </div>
                    </div>

                    {/* ── Max Lessons ─────────────────────────────────── */}
                    <Section>
                        <SectionHeader
                            icon={<IconCircle color="#10B981"><LayoutGrid size={16} color="#10B981" /></IconCircle>}
                            title="Max Lessons Per Day"
                            subtitle="How many lesson slots to show each day"
                        />
                        <PillSelect
                            options={maxLessonOptions}
                            value={draft.maxLessons}
                            onChange={v => updateDraft({ maxLessons: v })}
                        />
                    </Section>

                    {/* ── Lesson Duration ─────────────────────────────── */}
                    <Section>
                        <SectionHeader
                            icon={<IconCircle color="#6366F1"><Timer size={16} color="#6366F1" /></IconCircle>}
                            title="Lesson Duration"
                            subtitle="Length of each lesson in hours"
                        />
                        <PillSelect
                            options={durationOptions}
                            value={draft.lessonDuration}
                            onChange={v => updateDraft({ lessonDuration: v })}
                        />
                    </Section>

                    {/* ── Start Time ──────────────────────────────────── */}
                    <Section>
                        <SectionHeader
                            icon={<IconCircle color="#F59E0B"><Sunrise size={16} color="#F59E0B" /></IconCircle>}
                            title="First Lesson Starts At"
                            subtitle="Earliest time slot available"
                        />
                        <PillSelect
                            options={startTimeOptions}
                            value={draft.firstLessonStartTime}
                            onChange={v => updateDraft({ firstLessonStartTime: v })}
                        />
                    </Section>

                    {/* ── Notifications ───────────────────────────────── */}
                    <Section>
                        <SectionHeader
                            icon={<IconCircle color="#10B981"><Bell size={16} color="#10B981" /></IconCircle>}
                            title="Lesson Reminders"
                            subtitle="Get notified before your classes start"
                            right={
                                <Toggle
                                    checked={draft.notificationsEnabled ?? true}
                                    onChange={v => updateDraft({ notificationsEnabled: v })}
                                    accentColor="#10B981"
                                />
                            }
                        />
                    </Section>

                    {/* ── Reminder Timing (conditional) ───────────────── */}
                    {draft.notificationsEnabled && (
                        <Section>
                            <SectionHeader
                                icon={<IconCircle color="#10B981"><BellRing size={16} color="#10B981" /></IconCircle>}
                                title="Reminder Timing"
                                subtitle="Minutes before class to alert you"
                            />
                            <PillSelect
                                options={leadTimeOptions}
                                value={draft.alertLeadTime ?? 15}
                                onChange={v => updateDraft({ alertLeadTime: v })}
                            />
                        </Section>
                    )}

                    {/* ── Danger Zone ─────────────────────────────────── */}
                    <Section danger>
                        <SectionHeader
                            icon={<IconCircle color="#EF4444"><Trash2 size={16} color="#EF4444" /></IconCircle>}
                            title="Danger Zone"
                            subtitle="Irreversible actions"
                            titleColor="#EF4444"
                        />
                        <div className="flex flex-col gap-2.5">
                            <DangerAction
                                icon={<RotateCcw size={16} color="#EF4444" />}
                                title="Reset Entire Timetable"
                                subtitle="Erases all lessons and returns to setup"
                                color="#EF4444"
                                onClick={() => resetTimetable(onClose)}
                            />
                            <DangerAction
                                icon={<Trash2 size={16} color="#F59E0B" />}
                                title="Clear All Lessons"
                                subtitle="Removes lessons but keeps your settings"
                                color="#F59E0B"
                                onClick={clearAllLessons}
                            />
                        </div>
                    </Section>

                    <div className="h-4" />
                </div>

                {/* ── Sticky Save Bar ─────────────────────────────────────── */}
                <div
                    className={`flex-shrink-0 px-4 py-3 border-t border-(--border-main) bg-(--bg-card)
                        transition-all duration-300 ${
                            hasChanges
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                >
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-primary text-white font-semibold text-[15px]
                            hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
