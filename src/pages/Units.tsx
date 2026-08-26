import { Plus, Upload } from "lucide-react"
import ActionButton from "../components/Shared/Button"
import AcademicMilestones from "../components/Units/AcademicMilestones"
import GradeDistribution from "../components/Units/GradeDistribution"
import SkillCompetencyMapping from "../components/Units/SkillCompetencyMapping"
import StrengthEvolutionTimeline from "../components/Units/StrengthEvolutionTimeline"
import UnitsHeader from "../components/Units/UnitsHeader"
import { useState } from "react"
import AddUnitModal from "../components/Units/AddUnit"
import { useAuth } from "../contexts/AuthContext"

export default function Units() {
    const [addUnitModalOpen, setAddUnitModalOpen] = useState(false);
    const {profile} = useAuth();
    
    return (
        <div className="flex flex-col gap-6 max-md:pb-20">
            <div className="flex justify-between items-center ">
                <UnitsHeader />
                <div className="flex gap-2 max-md:hidden">
                <ActionButton 
                text="Upload Transcript"
                icon={Upload}
                bgColor='bg-white'
                iconColor="text-primary"
                textColor='text-primary'
                borderColor="border-primary"
                />    
                <ActionButton 
                text="Add Unit"
                icon={Plus}
                bgColor='bg-primary'
                iconColor="text-white"
                textColor='text-white'
                onClick={() => setAddUnitModalOpen(true)}
                />  
                </div>
                
            </div>
            <AddUnitModal 
                isOpen={addUnitModalOpen}
                onClose={() => setAddUnitModalOpen(false)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
              <GradeDistribution />  
              <AcademicMilestones />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
                <StrengthEvolutionTimeline />
                <SkillCompetencyMapping />
            </div>
            {/* Mobile Buttons */}
            <div className="fixed bottom-20 right-6 flex justify-between items-center md:hidden ">
                <div className="flex flex-col gap-2">
                <ActionButton 
                icon={Upload}
                bgColor='bg-primary hover:opacity-60'
                iconColor="text-white"
                className="rounded-full! w-12 h-12 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                />   
                <ActionButton
                icon={Plus}
                bgColor='bg-primary hover:opacity-60'
                iconColor="text-white"
                className="rounded-full! w-12 h-12 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                onClick={() => setAddUnitModalOpen(true)}
                /> 
                </div> 
            </div>
            
        </div>
    )
}