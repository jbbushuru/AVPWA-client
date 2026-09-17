import { User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function Topbar(){
    const {profile} = useAuth();
    return(
        <div className="md:hidden flex items-center pl-2 py-3 justify-between bg-primary">
            {/* Circular AV Logo Badge */}
            <div className="flex flex-row items-center gap-2">
            <img src="./favicon.png" alt="AV Logo" className="w-8 h-8 rounded-full" />
            <div className="flex flex-col">
            <p className="text-white text-sm font-sister tracking-wide">AcademicVault</p>
            <p className="text-white text-[10px] font-sister tracking-wide">Welcome {profile?.firstName} !</p>
            </div>
            </div>
            
            {/* Profile Avatar with edit badge icon inside */}
            <div className="pr-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative">
                <User className="w-4 h-4 text-slate-200 stroke-[1.75]" />
              </div>
            </div>
        </div>
    )
}