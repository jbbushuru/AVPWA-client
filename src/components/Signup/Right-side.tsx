import React from "react";
import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { profileService, CreateProfileDTO } from "../../services/profileService.ts";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  User,
  GraduationCap,
  Hash,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

export const Rightside:React.FC = () => {

    function getPasswordStrength(pw: string): {
        score: number;
        label: string;
        color: string;
        } {
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
        if (score === 2) return { score, label: "Fair", color: "#f59e0b" };
        if (score === 3) return { score, label: "Good", color: "#3b82f6" };
        return { score, label: "Strong", color: "#10b981" };
        }

    // Shared input styles
    const inputClass =
        "block w-full py-3 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-text-main placeholder-text-muted/40";
    const labelClass =
        "text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5";
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Step 1: User Registration
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loadingStep1, setLoadingStep1] = useState(false);

    // Step 2: Profile Creation
    const [profileData, setProfileData] = useState<CreateProfileDTO>({
        firstName: "",
        lastName: "",
        course: "",
        courseDuration: 1,
        academicSystem: "Semester",
        year: 1,
        term: 1,
    });
    const [loadingStep2, setLoadingStep2] = useState(false);
    const [error, setError] = useState("");
    const { register, fetchProfile } = useAuth();
    const pwStrength = useMemo(() => getPasswordStrength(password), [password]);

    //  Handlers
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoadingStep1(true);
            try {
            await register({ email, password });
            setStep(2); // Proceed to profile creation step
            } catch (err: any) {
            setError(err.customMessage || err.message || "Registration failed");
            } finally {
            setLoadingStep1(false);
            }
        };

        const handleProfileSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");
            try {
            await profileService.createProfile(profileData);
            await fetchProfile(); // Hydrate the auth context with the new profile
            navigate("/"); // Redirect to dashboard/home after successful setup
            } catch (err: any) {
            setError(err.customMessage || err.message || "Profile creation failed");
            } finally {
            setLoadingStep2(false);
            }
        };
return(
<div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 min-h-screen overflow-y-auto">
    <div className="md:hidden flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <img
                src="/favicon.png"
                alt="AV Logo"
                className="w-5 h-5 object-contain"
                />
        </div>
            <h1 className="text-xl font-sister text-primary">Academic Vault</h1>
        </div>
        {/* Card */}
        <div className="w-full max-w-[480px]">
        {/* Step pill indicator */}
            <div className="flex items-center gap-2 mb-7">
            {[1, 2].map((s) => (
                <div
                    key={s}
                    className="flex items-center gap-2 flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                        s < step
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : s === step
                            ? "bg-primary text-white ring-4 ring-primary/20 shadow-md shadow-primary/30"
                            : "bg-border-main text-text-muted"
                    }`}
                    >
                    {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    <span
                    className={`text-xs font-semibold transition-colors hidden sm:block ${
                        s === step ? "text-text-main" : "text-text-muted"
                    }`}
                    >
                    {s === 1 ? "Account" : "Profile"}
                    </span>
                    {s < 2 && (
                    <div
                        className={`flex-1 h-px mx-1 transition-all duration-500 ${
                        step > 1 ? "bg-primary" : "bg-border-main"
                        }`}
                    />
                    )}
                </div>
                ))}
            </div>

            {/* Heading */}
            <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
                {step === 1 ? "Create your account" : "Set up your profile"}
                </h2>
                <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                "Tell us about your academic programme to personalise your vault"
                </p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-5 bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
                </div>
            )}

            {/* STEP 1: Account  */}
            {step === 1 && (
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-text-muted/60" />
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={`${inputClass} pl-10 pr-4`}
                    />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-text-muted/60" />
                    </div>
                    <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={`${inputClass} pl-10 pr-11`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/60 hover:text-text-main transition-colors"
                        aria-label={
                        showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                        ) : (
                        <Eye className="h-4 w-4" />
                        )}
                    </button>
                    </div>

                    {/* Password strength meter */}
                    {password.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                        <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor:
                                i <= pwStrength.score
                                    ? pwStrength.color
                                    : "var(--border-main)",
                            }}
                            />
                        ))}
                        </div>
                        <p
                        className="text-xs font-semibold transition-all duration-200"
                        style={{ color: pwStrength.color }}
                        >
                        {pwStrength.label} password
                        </p>
                    </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    id="signup-step1-submit"
                    type="submit"
                    disabled={loadingStep1}
                    className="w-full bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                    {loadingStep1 ? (
                    <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Creating account...</span>
                    </>
                    ) : (
                    <>
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                    </>
                    )}
                </button>
                </form>
            )}

            {/*  STEP 2: Profile */}
            {step === 2 && (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className={labelClass}>First Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-text-muted/60" />
                        </div>
                        <input
                        type="text"
                        placeholder="First Name"
                        value={profileData.firstName}
                        onChange={(e) =>
                            setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                            })
                        }
                        required
                        autoComplete="given-name"
                        className={`${inputClass} pl-10 pr-3`}
                        />
                    </div>
                    </div>
                    <div>
                    <label className={labelClass}>Last Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-text-muted/60" />
                        </div>
                        <input
                        id="signup-lastname"
                        type="text"
                        placeholder="Last Name"
                        value={profileData.lastName}
                        onChange={(e) =>
                            setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                            })
                        }
                        required
                        autoComplete="family-name"
                        className={`${inputClass} pl-10 pr-3`}
                        />
                    </div>
                    </div>
                </div>
                {/* Course */}
                <div>
                    <label className={labelClass}>Course / Programme</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <GraduationCap className="h-4 w-4 text-text-muted/60" />
                    </div>
                    <input
                        id="signup-course"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={profileData.course}
                        onChange={(e) =>
                        setProfileData({ ...profileData, course: e.target.value })
                        }
                        required
                        className={`${inputClass} pl-10 pr-4`}
                    />
                    </div>
                </div>

                {/* Duration + Academic System */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className={labelClass}>Duration (Years)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Hash className="h-4 w-4 text-text-muted/60" />
                        </div>
                        <input
                        id="signup-duration"
                        type="number"
                        min="1"
                        value={profileData.courseDuration}
                        onChange={(e) =>
                            setProfileData({
                            ...profileData,
                            courseDuration: parseInt(e.target.value),
                            })
                        }
                        required
                        className={`${inputClass} pl-10 pr-3`}
                        />
                    </div>
                    </div>
                    <div>
                    <label className={labelClass}>Academic System</label>
                    <select
                        value={profileData.academicSystem}
                        onChange={(e) =>
                        setProfileData({
                            ...profileData,
                            academicSystem: e.target.value as
                            | "Semester"
                            | "Trimester",
                        })
                        }
                        required
                        className={`${inputClass} px-3`}
                    >
                        <option value="Semester">Semester</option>
                        <option value="Trimester">Trimester</option>
                    </select>
                    </div>
                </div>

                {/* Year + Term */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className={labelClass}>Current Year</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Hash className="h-4 w-4 text-text-muted/60" />
                        </div>
                        <input
                        type="number"
                        min="1"
                        value={profileData.year}
                        onChange={(e) =>
                            setProfileData({
                            ...profileData,
                            year: parseInt(e.target.value),
                            })
                        }
                        required
                        className={`${inputClass} pl-10 pr-3`}
                        />
                    </div>
                    </div>
                    <div>
                    <label className={labelClass}>
                        Current{" "}
                        {profileData.academicSystem === "Trimester"
                        ? "Trimester"
                        : "Semester"}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Hash className="h-4 w-4 text-text-muted/60" />
                        </div>
                        <input
                        type="number"
                        min="1"
                        value={profileData.term}
                        onChange={(e) =>
                            setProfileData({
                            ...profileData,
                            term: parseInt(e.target.value),
                            })
                        }
                        required
                        className={`${inputClass} pl-10 pr-3`}
                        />
                    </div>
                    </div>
                </div>

                {/* Action row */}
                <div className="flex gap-3 pt-1">
                    <button
                    id="signup-back"
                    type="button"
                    onClick={() => {
                        setStep(1);
                        setError("");
                    }}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border-main text-text-muted text-sm font-medium hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer shrink-0"
                    >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                    </button>
                    <button
                    type="submit"
                    className="flex-1 bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    >
                    Complete Setup
                    </button>
                </div>
                </form>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border-main text-center text-xs text-text-muted">
                Already have an account?{" "}
                <Link
                to="/login"
                className="text-primary font-bold hover:underline transition-all"
                >
                Log in
                </Link>
            </div>
        </div>
    </div>   
    );
};
export default Rightside;