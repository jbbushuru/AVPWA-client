import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {Mail,Loader2,AlertCircle,ArrowRight,CheckCircle2,KeyRound} from "lucide-react";

export const ForgotPassword: React.FC = () => {
  const inputClass =
    "block w-full py-3 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-text-main placeholder-text-muted/40";
  const labelClass =
    "text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.customMessage || data?.message || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[480px]">
        {!isSubmitted ? (
          <>
            {/* Icon + Heading */}
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
                Forgot your password?
              </h2>
              <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                Enter the email associated with your account and we'll send you a link to reset your password.
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
                    autoComplete="email"
                    className={`${inputClass} pl-10 pr-4`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset link</span>
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
              Check your email
            </h2>
            <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
              If an account exists for{" "}
              <span className="font-semibold text-text-main">{email}</span>, we've sent a password
              reset link. It may take a few minutes to arrive.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-sm text-primary font-bold hover:underline transition-all"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;