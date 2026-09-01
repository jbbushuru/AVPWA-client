import React from "react";
import { Mail, Lock,Loader2, Eye, EyeOff,AlertCircle,ArrowRight, } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useNavigate} from "react-router-dom";

export const Rightside: React.FC = () => {
    // Constants for the form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    // Submit handler
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
return(
    //Login Form Card
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
        );
}

export default Rightside;
