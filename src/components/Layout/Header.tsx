import Logo from "./Logo";
import { useApp } from "../../contexts/AppContext";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, User } from "lucide-react";

export default function Header() {
    const { isCollapsed, setIsCollapsed } = useApp();
    const [isHoveringToggle, setIsHoveringToggle] = useState(false);
    const {profile} = useAuth();
    return (
        <div className="hidden md:flex items-center justify-between py-2 px-6 pl-3 gap-3 bg-white shadow-sm border-b border-slate-200">
          <div className="flex gap-3">
          <div
          className={`flex items-center ${!isCollapsed ? 'justify-between' : 'justify-center'} p-3 gap-3 font-bold text-xs uppercase tracking-wider cursor-pointer text-primary`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          onMouseEnter={() => setIsHoveringToggle(true)}
          onMouseLeave={() => setIsHoveringToggle(false)}
          >
          {/* Collapsed state: show logo by default, swap to expand SVG on hover */}
          {isCollapsed && (
            <svg data-component="Octicon-expand" aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" display="inline-block" overflow="visible" style={{verticalAlign: 'text-bottom'}}>
              <path d="M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z"></path>
              <path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z"></path>
            </svg>
          )}

          {/* Expanded state: show logo + label by default, swap toggle to collapse SVG on hover */}
          {!isCollapsed && (
            <svg data-component="Octicon-collapse" aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" display="inline-block" overflow="visible" style={{verticalAlign: 'text-bottom'}}>
                <path d="m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z"></path>
                <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z"></path>
            </svg>  
          )} 
          </div>          
          <Logo />  
          </div>
          
          <div className="flex flex-row items-center gap-3 ">
          <div className="">
            <Bell className="w-6 h-6 text-slate-700 stroke-[1.75]" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[#d2c1ce] flex items-center justify-center relative">
            <User className="w-5 h-5 text-slate-700 stroke-[1.75]" />
          </div>
          </div>
        </div>
    )
}
