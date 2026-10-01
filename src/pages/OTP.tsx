import React from "react";
import { useState, useRef, KeyboardEvent, ChangeEvent, ClipboardEvent } from "react";
import { Link } from "react-router-dom";
import {Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

const OTP_LENGTH = 6;

interface OtpVerificationProps {
  identifier: string; // email or phone the OTP was sent to
  onVerified?: (data: unknown) => void;
  onBack?: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  identifier,
  onVerified,
  onBack,
}) => {
  const inputClass =
    "block w-full py-3 text-sm bg-bg-card border border-border-main rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-text-main placeholder-text-muted/40";
  const labelClass =
    "text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    if (!value) {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    newOtp[index] = value[value.length - 1];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextIndex = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the full code.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.customMessage || data?.message || "Invalid or expired code. Please try again.");
        return;
      }

      onVerified?.(data);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.customMessage || data?.message || "Couldn't resend the code. Please try again.");
        return;
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch {
      setError("Something went wrong while resending. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16 min-h-screen overflow-y-auto">
      <div className="md:hidden flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <img src="/favicon.png" alt="AV Logo" className="w-5 h-5 object-contain" />
        </div>
        <h1 className="text-xl font-sister text-primary">Academic Vault</h1>
      </div>

      <div className="w-full max-w-[480px]">
        {/* Icon + Heading */}
        <div className="mb-7">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
            Verify your account
          </h2>
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
            Enter the {OTP_LENGTH}-digit code sent to{" "}
            <span className="font-semibold text-text-main">{identifier}</span>
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
            <label className={labelClass}>Verification code</label>
            <div className="flex gap-2 md:gap-3 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {(inputsRef.current[index] = el)}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`${inputClass} w-12 h-14 md:w-14 md:h-16 text-center text-xl font-semibold px-0`}
                />
              ))}
            </div>
          </div>

          {/* Action row */}
          <div className="flex gap-3 pt-1">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border-main text-text-muted text-sm font-medium hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:opacity-90 active:scale-[0.985] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border-main text-center text-xs text-text-muted">
          Didn't receive a code?{" "}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-primary font-bold hover:underline transition-all disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;