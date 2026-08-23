import { User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Topbar(){
    const {profile} = useAuth();
    return(
        <div className="md:hidden flex items-center pl-2 py-3 justify-between bg-[#eeede4] border-b border-[#D8CCD9]">
            {/* Circular AV Logo Badge */}
            <div className="flex flex-row items-center gap-1">
            <img src="./public/favicon.png" alt="AV Logo" className="w-6 h-6 rounded-full" />
            <p className="text-primary text-[12px] font-sister tracking-wide">AcademicVault</p>
            </div>
            
            {/* Text Container */}
                  <div className="flex flex-row gap-2 items-center text-slate-800  px-2 border-l-2 border-primary">
                    {/* User Information */}
                    <div className="flex flex-col ">
                      <h4 className="font-bold text-[9px] text-slate-900 tracking-widest truncate">
                        {profile?.firstName || 'Joan'} {profile?.lastName || 'Bushuru'}
                      </h4>
                      <p className="text-[7px] font-medium text-slate-500 tracking-wider -mt-0.5">
                        {profile?.course || 'Software Engineering'}
                      </p>
                      <p className="text-[7px] text-slate-500 truncate tracking-wider -mt-0.5">
                        {profile?.email||'user@email.com'}
                      </p>
                    </div>
                    {/* Profile Avatar with edit badge icon inside */}
                    <div>
                      <div className="w-7 h-7 rounded-full bg-[#d2c1ce] flex items-center justify-center relative">
                        <User className="w-4 h-4 text-slate-700 stroke-[1.75]" />
                      </div>
                    </div>
                  </div>
        </div>
    )
}