import Greeting from "../components/Dashboard/Greeting";
import { Stats } from "../components/Dashboard/Stats";
import { AcademicCompass } from "../components/Dashboard/AcademicCompass";
import PerformanceGraph from "../components/Dashboard/PerformanceGraph";
import PerformanceCards from "../components/Dashboard/PerformanceCards";
import ProfileOverview from "../components/Dashboard/profileOverview";

export default function Dashboard() {

    return (
    <div className="flex flex-col gap-3 md:gap-6 ">
        <Greeting/>     
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 ">
            <Stats />
            <div>
            <PerformanceCards/>
            </div>
        </div>
        <PerformanceGraph /> 
    </div>
    )
}