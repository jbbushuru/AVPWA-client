import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    X,
    LayoutGrid,
    Timer,
    Sunrise,
    RotateCcw,
    Trash2,
    Save,
    Bell,
    BellRing,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { updateTimetableSettings, deleteTimetableSettings } from '../../services/timetableService';
import { deleteAllLessons } from '../../services/lessonService';

import type { TimetableSettings } from '../../services/timetableService';

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
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
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
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${value === opt.value
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
        <div className="flex w-full sm:max-w-50">
            <input
                type="time"
                value={to24Hour(value)}
                onChange={e => onChange(to12Hour(e.target.value))}
                className="w-full px-4 py-2 rounded-xl text-[14px] font-semibold border transition-all duration-200 cursor-pointer border-(--border-main) text-(--text-main) hover:border-primary/60 hover:text-primary bg-(--bg-main) outline-none focus:border-primary focus:text-primary"
            />
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
            <div className="shrink-0">{icon}</div>
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
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer shrink-0"
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
export default function Timetable_Settings({ isOpen, onClose }: TimetableSettingsProps) {
    const { settings, setSettings, fetchUserSettings } = useApp();
    const queryClient = useQueryClient();

    const defaultDraft: TimetableSettings = settings ?? {
        maxLessons: 0,
        lessonDuration: 0,
        firstLessonStartTime: '08:00 AM',
        notificationsEnabled: false,
        alertLeadTime: 0,
    };

    const [draft, setDraft] = useState<TimetableSettings>(defaultDraft);
    const [isSaving, setIsSaving] = useState(false);

    // Re-sync draft from live settings each time the drawer opens
    useEffect(() => {
        if (isOpen && settings) {
            setDraft({ ...settings });
        }
    }, [isOpen, settings]);

    const updateDraft = (patch: Partial<TimetableSettings>) => {
        setDraft(prev => ({ ...prev, ...patch }));
    };

    const hasChanges = JSON.stringify(draft) !== JSON.stringify(defaultDraft);
    const isValid =
        draft.maxLessons > 0 &&
        draft.lessonDuration > 0 &&
        !!draft.firstLessonStartTime &&
        (!draft.notificationsEnabled || draft.alertLeadTime > 0);
    const canSave = hasChanges && isValid;

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const updated = await updateTimetableSettings(draft);
            setSettings(updated);
        } catch (error) {
            console.error('Error saving timetable settings:', error);
        } finally {
            setIsSaving(false);
            await fetchUserSettings();
            onClose();
        }
    };

    const handleReset = async () => {
        try {
            setIsSaving(true);

            await deleteAllLessons();
            await deleteTimetableSettings();

            setSettings(null);
        } catch (error) {
            console.error('Error resetting timetable:', error);
        } finally {
            setIsSaving(false);
            await Promise.all([
                fetchUserSettings(),
                queryClient.invalidateQueries({ queryKey: ['allLessons'] }),
            ]);
            onClose();
        }
    };

    const handleClearLessons = async () => {
        try {
            setIsSaving(true);
            await deleteAllLessons();
        } catch (error) {
            console.error('Error clearing lessons:', error);
        } finally {
            setIsSaving(false);
            await queryClient.invalidateQueries({ queryKey: ['allLessons'] });
            onClose();
        }
    };

    // Option arrays
    const maxLessonOptions = [1,2,3, 4, 5, 6, 7, 8].map(n => ({ label: `${n}`, value: n }));
    const durationOptions = [1, 2, 3].map(n => ({ label: `${n}h`, value: n }));
    const leadTimeOptions = [5, 10, 15, 30, 60].map(m => ({ label: `${m} min`, value: m }));

    return (
        <>
            {/* ── Backdrop ──────────────────────────────────────────────── */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen
                        ? 'bg-black/30 backdrop-blur-sm pointer-events-auto'
                        : 'bg-transparent pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* ── Drawer ────────────────────────────────────────────────── */}
            <div
                className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-amber-50 shadow-2xl
                    transition-transform duration-300 ease-in-out
                    w-full sm:w-105
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#eeede4] shrink-0">
                    <div>
                        <h2 className="text-[17px] font-bold text-(--text-main) tracking-tight">Timetable Settings</h2>
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
                        <TimePicker
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
                        />
                        <div className="flex flex-col-reverse gap-2.5">
                            <DangerAction
                                icon={<RotateCcw size={16} color="#EF4444" />}
                                title="Reset Entire Timetable"
                                subtitle="Erases all lessons and returns to setup"
                                color="#EF4444"
                                onClick={handleReset}
                            />
                            <DangerAction
                                icon={<Trash2 size={16} color="#F59E0B" />}
                                title="Clear All Lessons"
                                subtitle="Removes lessons but keeps your settings"
                                color="#F59E0B"
                                onClick={handleClearLessons}
                            />
                        </div>
                    </Section>

                    <div className="h-4" />
                </div>

                {/* ── Sticky Save Bar ─────────────────────────────────────────────────── */}
                <div
                    className={`shrink-0 px-4 py-3 border-t border-(--border-main) bg-(--bg-card)
                        transition-all duration-300 ${canSave
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                >
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !canSave}
                        className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[15px]
                            transition-all duration-200 shadow-md ${
                                !canSave
                                    ? 'bg-gray-200 text-gray-400 pointer-events-none'
                                    : 'bg-primary text-white hover:opacity-90 active:scale-[0.98] cursor-pointer'
                            } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
}
