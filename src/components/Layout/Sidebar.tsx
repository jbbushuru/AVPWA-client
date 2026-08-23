import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Lock, CalendarClock, ClipboardCheck} from 'lucide-react';

export default function Sidebar() {
  const [selectedYear, setSelectedYear] = useState('Year 1');

  const academicYears = [
    { name: 'Year 1', locked: false },
    { name: 'Year 2', locked: true },
    { name: 'Year 3', locked: true },
    { name: 'Year 4', locked: true },
  ];

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Units', icon: BookOpen, href: '/units' },
    { label: 'Timetable', icon: CalendarClock, href: '/timetable' },
    { label: 'Tasks', icon: ClipboardCheck, href: '/tasks' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 p-6 px-3 gap-6 h-full bg-primary text-gray-200 shrink-0 relative z-30 shadow-lg overflow-y-auto">
        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      `flex items-center p-2 mb-3 rounded-md transition-all duration-200 font-bold text-xs uppercase tracking-wider ${
                        isActive
                          ? 'bg-bg-main text-primary shadow-md'
                          : 'hover:bg-[#8a5b6c]/60 text-gray-200'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-300'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Academic Years */}
        {/* <div>
          <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-3">Academic Years</h3>
          <ul className="space-y-1.5">
            {academicYears.map((yearItem) => {
              const isSelected = selectedYear === yearItem.name;
              return (
                <li key={yearItem.name}>
                  <button
                    className={`flex items-center p-2.5 rounded-xl w-full text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-[#6b3e4f] text-white shadow-md font-medium' 
                        : 'hover:bg-[#8a5b6c]/60 text-gray-200'
                    } ${yearItem.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => !yearItem.locked && setSelectedYear(yearItem.name)}
                    disabled={yearItem.locked}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full mr-3 ${isSelected ? 'bg-amber-300' : 'bg-gray-400'}`}></span>
                    <span>{yearItem.name}</span>
                    {yearItem.locked && <Lock className="w-4 h-4 ml-auto text-gray-400" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div> */}
    </aside>
  );
}
