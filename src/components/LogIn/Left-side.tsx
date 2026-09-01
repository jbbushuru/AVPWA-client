import React from 'react';
import {
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export const Leftside: React.FC = () => {
return(
    <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-gradient-to-br from-[#7B5E77] via-[#63485f] to-[#4e364a] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617] text-white p-12 flex-col justify-between relative overflow-hidden">
            {/* Background graphic elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            {/* Header Brand */}
            <div className="flex items-center gap-3 relative z-10">
            <img src="/favicon.png"  alt="AV Logo" className="w-10 h-10 rounded-full border border-white/20 shadow-md bg-[#eeede4] p-1.5"/>
            <h1 className="text-3xl font-sister tracking-tight text-white">Academic Vault</h1>
            </div>

            {/* Dashboard Mockup Showcase */}
            <div className="my-auto relative z-10 flex flex-col items-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
                {/* Mockup Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="flex flex-col">
                    <span className="text-xs font-semibold">Gabriel Rhone</span>
                    <span className="text-[10px] text-white/60">Computer Science</span>
                    </div>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/90">Year 2, Semester 1</span>
                </div>

                {/* Mockup Stats */}
                <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-white/60">Current GPA</span>
                    <span className="text-lg font-bold mt-0.5">3.88</span>
                    <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5 font-medium"> +0.12 this term
                    </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-white/60">Target GPA</span>
                    <span className="text-lg font-bold mt-0.5">4.00</span>
                    <span className="text-[9px] text-white/60 mt-1">97% Completion</span>
                </div>
                </div>

                {/* Upcoming task info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-xs font-medium animate-pulse">Design & Analysis of Algorithms</span>
                    <span className="text-[10px] text-white/60">Assignment due in 2 days</span>
                    </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
            </div>

            <div className="mt-8 text-center max-w-sm">
                <h2 className="text-xl font-semibold mb-2">Track Your Academic Path</h2>
                <p className="text-sm text-white/80 font-normal leading-relaxed">Organise your courses, map out your grade distribution, and follow your skills evolution.</p>
            </div>
            </div>

            {/* Footer copyright */}
            <div className="text-xs text-white/50 relative z-10">
            &copy; {new Date().getFullYear()} Academic Vault. All rights reserved.
            </div>
        </div>
    );
};

export default Leftside;
