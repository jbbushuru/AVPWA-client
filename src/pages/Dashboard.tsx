import Greeting from "../components/Dashboard/Greeting";
import { Stats } from "../components/Dashboard/Stats";
import { AcademicCompass } from "../components/Dashboard/AcademicCompass";
import PerformanceGraph from "../components/Dashboard/PerformanceGraph";
import PerformanceCards from "../components/Dashboard/PerformanceCards";
import ProfileOverview from "../components/Dashboard/profileOverview";

export default function Dashboard() {

    return (
    <div className="flex flex-col gap-3 md:gap-6 max-md:pb-16">
        <div className="flex flex-row justify-between items-center">
            <Greeting/>
            <ProfileOverview/>    
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 ">
            <Stats />
            <AcademicCompass />
        </div>
        <PerformanceCards/>
        <PerformanceGraph />
        
    </div>
    )
}