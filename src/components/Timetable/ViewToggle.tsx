export type ViewMode = "Daily" | "Weekly";

interface ViewToggleProps {
    activeView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center justify-between">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1.5 bg-primary/25 border border-(--border-main) rounded-full select-none gap-1">
                <button
                    type="button"
                    onClick={() => onViewChange("Daily")}
                    className={`px-10 pb-0.5 pt-1 text-center font-sister text-md font-normal tracking-widest rounded-full transition-all duration-300 ease-in-out cursor-pointer border ${
                        activeView === "Daily"
                            ? "bg-(--bg-card) text-(--text-main) border-(--border-main)/60 shadow-xs"
                            : "bg-transparent text-(--text-muted) border-transparent shadow-none hover:text-(--text-main)"
                    }`}
                >
                    Daily View
                </button>
                <button
                    type="button"
                    onClick={() => onViewChange("Weekly")}
                    className={`px-10 pb-0.5 pt-1 text-center font-sister text-md font-normal tracking-widest rounded-full transition-all duration-300 ease-in-out cursor-pointer border ${
                        activeView === "Weekly"
                            ? "bg-(--bg-card) text-(--text-main) border-(--border-main)/60 shadow-xs"
                            : "bg-transparent text-(--text-muted) border-transparent shadow-none hover:text-(--text-main)"
                    }`}
                >
                    Weekly View
                </button>
            </div>
        </div>
    );
}



