import React from "react";
import { Sparkles,BookOpen, CheckCircle2,Shield,TrendingUp,Calendar,} from "lucide-react";


export const Leftside:React.FC = () => {
    //Features
    const features = [
    {
        icon: TrendingUp,
        title: "Live GPA Tracking",
        desc: "Real-time grade calculations across every unit.",
        color: "#a78bfa",
    },
    {
        icon: Calendar,
        title: "Smart Timetable",
        desc: "Never miss a lecture, deadline, or exam again.",
        color: "#34d399",
    },
    {
        icon: Sparkles,
        title: "Skill Insights",
        desc: "Discover strengths and areas to grow with AI-backed insights.",
        color: "#fb923c",
    },
    ];

    return (
        //Left Side: Brand Experience Panel (Hidden on mobile)
        <div className="hidden md:flex md:w-[45%] lg:w-[42%] bg-gradient-to-br from-[#6b4f68] via-[#7B5E77] to-[#4e364a] text-white p-10 lg:p-12 flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <img
              src="/favicon.png"
              alt="AV Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <h1 className="text-2xl font-sister tracking-tight">
            Academic Vault
          </h1>
        </div>

        {/* Centre content */}
        <div className="my-auto relative z-10 space-y-8">
          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-4">
              <Sparkles className="w-3 h-3" />
              Free forever
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold leading-snug mb-3">
              Your academic journey,{" "}
              <span className="text-[#ddd6fe]">organised.</span>
            </h2>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              Join thousands of students who manage their grades, timetables,
              and academic goals in one beautifully simple place.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <p className="text-xs font-semibold">Gabriel Rhone</p>
                <p className="text-[10px] text-white/55">
                  Computer Science · Year 2
                </p>
              </div>
              <span className="text-[9px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/25 px-2 py-0.5 rounded-full font-semibold">
                On track ✓
              </span>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "GPA",
                  value: "3.88",
                  sub: "▲ +0.12",
                  color: "#34d399",
                },
                {
                  label: "Target",
                  value: "4.00",
                  sub: "97%",
                  color: "#a78bfa",
                },
                { label: "Units", value: "6", sub: "Active", color: "#fb923c" },
              ].map(({ label, value, sub, color }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col"
                >
                  <span className="text-[9px] text-white/50 font-medium">
                    {label}
                  </span>
                  <span className="text-base font-bold mt-0.5">{value}</span>
                  <span
                    className="text-[9px] mt-0.5 font-semibold"
                    style={{ color }}
                  >
                    {sub}
                  </span>
                </div>
              ))}
            </div>
            {/* Upcoming */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#a78bfa]/20 border border-[#a78bfa]/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-[#c4b5fd]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold truncate">
                  Algorithms Assignment
                </p>
                <p className="text-[9px] text-white/50">Due in 2 days</p>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: `${color}22` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="text-[10px] text-white/55 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-white/35 relative z-10 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          &copy; {new Date().getFullYear()} Academic Vault · Secured &amp;
          Private
        </div>
      </div>

    );  
    
};
export default Leftside;