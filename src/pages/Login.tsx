import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/"); // Redirect to dashboard/home after successful login
    } catch (err: any) {
      setError(
        err.customMessage ||
          err.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-bg-main text-text-main overflow-hidden font-sans">
      {/* Left Side: Brand Experience Panel (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] bg-gradient-to-br from-[#7B5E77] via-[#63485f] to-[#4e364a] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#020617] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background graphic elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Header Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <img
            src="/favicon.png"
            alt="AV Logo"
            className="w-10 h-10 rounded-full border border-white/20 shadow-md bg-[#eeede4] p-1.5"
          />
          <h1 className="text-3xl font-sister tracking-tight text-white">
            Academic Vault
          </h1>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div className="my-auto relative z-10 flex flex-col items-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
            {/* Mockup Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Gabriel Rhone</span>
                  <span className="text-[10px] text-white/60">
                    Computer Science
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/90">
                Year 2, Semester 1
              </span>
            </div>

            {/* Mockup Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-white/60">Current GPA</span>
                <span className="text-lg font-bold mt-0.5">3.88</span>
                <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5 font-medium">
                  ▲ +0.12 this term
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] text-white/60">Target GPA</span>
                <span className="text-lg font-bold mt-0.5">4.00</span>
                <span className="text-[9px] text-white/60 mt-1">
                  97% Completion
                </span>
              </div>
            </div>

            {/* Upcoming task info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium animate-pulse">
                    Design & Analysis of Algorithms
                  </span>
                  <span className="text-[10px] text-white/60">
                    Assignment due in 2 days
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="mt-8 text-center max-w-sm">
            <h2 className="text-xl font-semibold mb-2">
              Track Your Academic Path
            </h2>
            <p className="text-sm text-white/80 font-normal leading-relaxed">
              Organise your courses, map out your grade distribution, and follow
              your skills evolution.
            </p>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="text-xs text-white/50 relative z-10">
          &copy; {new Date().getFullYear()} Academic Vault. All rights reserved.
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center items-center p-6 md:p-12 min-h-screen">
        {/* Mobile Header Brand (Only shown on small screens) */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <img
            src="/favicon.png"
            alt="AV Logo"
            className="w-8 h-8 rounded-full border border-border-main shadow bg-white p-1"
          />
          <h1 className="text-2xl font-sister text-primary">Academic Vault</h1>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md bg-bg-card border border-border-main rounded-2xl shadow-xl shadow-primary/5 p-8 transition-all hover:shadow-2xl hover:shadow-primary/10">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-text-muted mt-2">
              Please enter your credentials to access your vault
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-muted/75" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main placeholder-text-muted/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-muted/75" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main placeholder-text-muted/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted/75 hover:text-text-main transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me option */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary/20 border-border-main rounded cursor-pointer accent-primary"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs font-medium text-text-muted cursor-pointer select-none"
              >
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 active:scale-[0.99] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log in</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer redirect link */}
          <div className="mt-8 pt-6 border-t border-border-main text-center text-xs text-text-muted">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-bold hover:underline transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
