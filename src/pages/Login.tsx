import Leftside from "../components/LogIn/Left-side";
import Rightside from "../components/LogIn/Right-side";

export default function Login() {

  return (
    <div className="min-h-screen w-full flex bg-bg-main text-text-main overflow-hidden font-sans">
      {/* Left Side: Brand Experience Panel (Hidden on mobile) */}
      <Leftside/>
      {/* Right Side: Authentication Form */}
      <Rightside/>
    </div>
  )
}
