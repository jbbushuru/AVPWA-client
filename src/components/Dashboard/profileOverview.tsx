import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileOverview() {
  const { profile } = useAuth();
  return (
    <div className='hidden md:block'>
      {/* Main card */}
      <div className="flex flex-row gap-4 items-center  text-slate-800  px-4 border-l-4 border-primary">
        {/* User Information */}
        <div className="flex flex-col">
          <h4 className="font-bold text-sm text-slate-900 tracking-wide truncate">
            {profile?.firstName} {profile?.lastName}
          </h4>
          <p className="text-xs font-medium text-slate-500 tracking-wide mt-0.5">
            {profile?.course}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {profile?.email}
          </p>
        </div>
        {/* Profile Avatar with edit badge icon inside */}
        <div>
          <div className="w-12 h-12 rounded-full bg-[#d2c1ce] flex items-center justify-center relative">
            <User className="w-6 h-6 text-slate-700 stroke-[1.75]" />
          </div>
        </div>
      </div>
    </div>
  );
}
