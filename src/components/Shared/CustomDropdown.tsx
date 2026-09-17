import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomDropdown({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  className = "",
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[highlighted] as HTMLElement | undefined;
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted, open]);

  function selectOption(index: number) {
    setOpen(false);
    onChange(options[index].value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setHighlighted((h) => Math.min(h + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && highlighted >= 0) {
          selectOption(highlighted);
        } else {
          setOpen(true);
          setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className={className}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => {
          setOpen((o) => !o);
          setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={handleKeyDown}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span>{selectedIndex === -1 ? placeholder : options[selectedIndex].label}</span>
        <ChevronDown
          size={16}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {open && (
        <ul ref={listRef} role="listbox" tabIndex={-1}>
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={selectedIndex === i}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => selectOption(i)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}