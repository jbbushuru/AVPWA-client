import { useAuth } from "../../contexts/AuthContext";

function getGreeting(){
const hours = new Date().getHours();
if (hours < 12) {
    return "Good Morning";
} else if (hours < 18) {
    return "Good Afternoon";
} else {
    return "Good Evening";
}
}
function getFormattedDate() {
    return new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
export default function Greeting() {
  const {profile}=useAuth();
    return (
    <div className="bg-transparent flex flex-col">
      {/* Dynamic greeting: Good Morning/Afternoon/Evening, [First Name] */}
      <h1 className="text-xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
        {getGreeting()}, {profile?.firstName}
      </h1>
      
      {/* Date today in format: Day of the week, DD Month YYYY */}
      <div className="text-primary text-xs md:text-[14px] font-semibold tracking-wide">
        {getFormattedDate()}
      </div>
      
      {/* Subtitle */}
      <p className="text-slate-500 text-xs md:text-[14px] font-normal leading-relaxed">
        Here is what is happening with your academic journey today.
      </p>
    </div>
    )
}