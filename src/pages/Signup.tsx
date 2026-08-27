import Leftside from "../components/Signup/Left-side";
import Rightside from "../components/Signup/Right-side";

//  Component

export default function Signup() {

  return (
    <div className="min-h-screen w-full flex bg-bg-main text-text-main overflow-hidden font-sans">
      <Leftside/>  
      <Rightside/>
    </div>
  );
}
