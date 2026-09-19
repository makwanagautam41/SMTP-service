import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { Mail, Sparkles, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {

  const {
    background,
    foreground,
    primary,
    primaryForeground,
    card,
    border,
    mutedForeground,
  } = useThemeStyles();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("request");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { forgotPassword } = await import("../services/authServices.js");
    const result = await forgotPassword(email);

    if (result.success) {
      setMessage(result.data.message || "If an account exists, a password reset email will be sent.");
      setStep("success");
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex transition-colors duration-500"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 lg:px-8 relative z-10 w-full pt-8 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="mb-10 text-center sm:text-left">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors" style={{ color: mutedForeground.color }}>
              <RotateCcw size={18} />
              Back to login
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              {step === "request" ? "Forgot password?" : "Check your email"}
            </h1>
            <p className="text-base font-medium" style={{ color: mutedForeground.color }}>
              {step === "request"
                ? "Enter your email and we'll send you a link to reset your password."
                : "We've sent password reset instructions to your email address."}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 p-4 rounded-xl text-sm font-medium leading-relaxed"
                  style={{
                    backgroundColor: message.includes("sent") || message.includes("exists")
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                    color: message.includes("sent") || message.includes("exists") ? "#22c55e" : "#ef4444",
                    border: message.includes("sent") || message.includes("exists")
                      ? "1px solid rgba(34,197,94,0.2)"
                      : "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  {message.includes("sent") || message.includes("exists") ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  )}
                  <span>{message}</span>
                </motion.div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold ml-1" style={{ color: foreground.color }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                  style={{
                    backgroundColor: card.color,
                    color: foreground.color,
                    border: `1px solid ${border.color}`,
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = primary.color)}
                  onBlur={(e) => (e.target.style.borderColor = border.color)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 font-bold rounded-xl py-4 mt-2 transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: `0 8px 25px ${primary.color}40`,
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-sm mt-6 font-medium" style={{ color: mutedForeground.color }}>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-bold hover:underline transition-all duration-300"
                  style={{ color: primary.color }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/10"
                style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                <CheckCircle2 size={40} />
              </div>
              <div className="max-w-xs">
                <p className="text-base font-medium leading-relaxed" style={{ color: foreground.color }}>
                  {message}
                </p>
                <p className="mt-4 text-sm" style={{ color: mutedForeground.color }}>
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setStep("request")}
                    className="font-bold hover:underline transition-colors"
                    style={{ color: primary.color }}
                  >
                    try again
                  </button>
                </p>
              </div>
              <Link
                to="/login"
                className="w-full flex justify-center items-center gap-2 font-bold rounded-xl py-4 mt-2 transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                  boxShadow: `0 8px 25px ${primary.color}40`,
                }}
              >
                Back to login
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden"
        style={{ backgroundColor: `${primary.color}10` }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primary.color} 0%, transparent 60%)`,
          }}
        />

        <div
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full mix-blend-screen blur-[120px]"
          style={{ backgroundColor: primary.color, opacity: 0.15 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 px-12 text-center max-w-lg"
        >
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-8 shadow-2xl backdrop-blur-md border border-white/10"
            style={{ backgroundColor: primary.color, color: primaryForeground.color }}
          >
            <Mail size={40} />
          </div>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight" style={{ color: foreground.color }}>
            Secure password recovery
          </h2>
          <p className="text-lg font-medium leading-relaxed" style={{ color: mutedForeground.color }}>
            We'll send a secure, time-limited link to reset your password. Your account security is our priority.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm" style={{ color: mutedForeground.color }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Encrypted tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>1-hour expiry</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Single use</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;