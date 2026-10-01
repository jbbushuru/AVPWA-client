import React from "react";
import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {Lock,Eye,EyeOff,Loader2,AlertCircle,ArrowRight,CheckCircle2,KeyRound,ShieldAlert,} from "lucide-react";


export const  ChangePassword: React.FC = () => {
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

  const inputClass =
    "block w-full py-3 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-text-main placeholder-text-muted/40";
  const labelClass =
    "text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5";

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pwStrength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.customMessage || data?.message || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Missing/invalid token — show a blocking state instead of the form
  if (!token && !isSuccess) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 min-h-screen overflow-y-auto">
        <div className="md:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <img src="/favicon.png" alt="AV Logo" className="w-5 h-5 object-contain" />
          </div>
          <h1 className="text-xl font-sister text-primary">Academic Vault</h1>
        </div>

        <div className="w-full max-w-[480px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/40 flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
            Invalid or expired link
          </h2>
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
            This password reset link is missing or no longer valid. Please request a new one.
          </p>
          <Link
            to="/ForgotPassword"
            className="mt-6 inline-flex items-center gap-2 bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <span>Request new link</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 min-h-screen overflow-y-auto">
      <div className="md:hidden flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <img src="/favicon.png" alt="AV Logo" className="w-5 h-5 object-contain" />
        </div>
        <h1 className="text-xl font-sister text-primary">Academic Vault</h1>
      </div>

      <div className="w-full max-w-[480px]">
        {!isSuccess ? (
          <>
            {/* Icon + Heading */}
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
                Set a new password
              </h2>
              <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                Choose a strong password you haven't used before.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label className={labelClass}>New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-muted/60" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className={`${inputClass} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/60 hover:text-text-main transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                              i <= pwStrength.score ? pwStrength.color : "var(--border-main)",
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

              {/* Confirm password */}
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-muted/60" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className={`${inputClass} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted/60 hover:text-text-main transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs font-semibold text-red-500 mt-1.5">
                    Passwords don't match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset password</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border-main text-center text-xs text-text-muted">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                Log in
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
              Password updated
            </h2>
            <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex items-center gap-2 bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <span>Go to login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChangePassword;