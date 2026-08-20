function getFormattedDate() {
    return new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
export default function UnitsHeader() {
    return (
    <div className="bg-transparent flex flex-col">
      {/* Dynamic greeting: Good Morning/Afternoon/Evening, [First Name] */}
      <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
        Unit History & Competencies
      </h1>
      
      {/* Date today in format: Day of the week, DD Month YYYY */}
      <div className="text-primary text-[14px] font-semibold tracking-wide">
       {getFormattedDate()} 
      </div>
      
      {/* Subtitle */}
      <p className="text-slate-500 text-[14px] font-normal leading-relaxed">
        Monitor your completed units, unlocked skills and milestones
      </p>
    </div>
    )
}