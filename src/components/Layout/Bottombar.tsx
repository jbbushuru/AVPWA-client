import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarClock, 
  ClipboardCheck, 
  User 
} from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Units', icon: BookOpen, href: '/units' },
    { label: 'Timetable', icon: CalendarClock, href: '/timetable' },
    { label: 'Tasks', icon: ClipboardCheck, href: '/tasks' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#eeede4] border-t border-[#D8CCD9] z-40 px-3 py-2 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center py-1 text-[#4A324C] hover:text-primary transition-colors"
          >
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}