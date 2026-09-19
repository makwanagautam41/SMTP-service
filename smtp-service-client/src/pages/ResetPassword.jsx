import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { Lock, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    background,
    foreground,
    primary,
    primaryForeground,
    card,
    border,
    mutedForeground,
  } = useThemeStyles();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const { verifyResetToken } = await import("../services/authServices.js");
      const result = await verifyResetToken(token);
      setTokenValid(result.success);
      setCheckingToken(false);
      if (!result.success) {
        setMessage(result.message);
      }
    };
    verifyToken();
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Password must contain at least one special character";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const pwdError = validatePassword(password);
    if (pwdError) {
      setMessage(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    const { resetPassword } = await import("../services/authServices.js");
    const result = await resetPassword(token, password);

    if (result.success) {
      setMessage("Password has been reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  if (checkingToken) {
    return (
      <div
        className="min-h-screen w-full flex transition-colors duration-500"
        style={{ backgroundColor: background.color, color: foreground.color }}
      >
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24" style={{ color: primary.color }}>
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
            <p className="text-base font-medium" style={{ color: mutedForeground.color }}>
              Verifying reset link...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
            className="w-full max-w-sm sm:max-w-md text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-md border border-white/10"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
              <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">
              Invalid or expired link
            </h1>
            <p className="text-base font-medium mb-8" style={{ color: mutedForeground.color }}>
              {message || "This password reset link is invalid or has expired. Please request a new one."}
            </p>
            <Link
              to="/forgot-password"
              className="w-full flex justify-center items-center gap-2 font-bold rounded-xl py-4 transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
                boxShadow: `0 8px 25px ${primary.color}40`,
              }}
            >
              Request new link
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const passwordError = password ? validatePassword(password) : null;
  const matchError = confirmPassword && password !== confirmPassword;

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
              Create new password
            </h1>
            <p className="text-base font-medium" style={{ color: mutedForeground.color }}>
              Your new password must be different from previously used passwords.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-4 rounded-xl text-sm font-medium leading-relaxed"
                style={{
                  backgroundColor: message.includes("successfully")
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  color: message.includes("successfully") ? "#22c55e" : "#ef4444",
                  border: message.includes("successfully")
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {message.includes("successfully") ? (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                )}
                <span>{message}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1" style={{ color: foreground.color }}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2 pr-12"
                  style={{
                    backgroundColor: card.color,
                    color: foreground.color,
                    border: `1px solid ${passwordError ? "#ef4444" : border.color}`,
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = passwordError ? "#ef4444" : primary.color)}
                  onBlur={(e) => (e.target.style.borderColor = passwordError ? "#ef4444" : border.color)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: mutedForeground.color }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs font-medium ml-1" style={{ color: "#ef4444" }}>
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold ml-1" style={{ color: foreground.color }}>
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${matchError ? "#ef4444" : border.color}`,
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = matchError ? "#ef4444" : primary.color)}
                onBlur={(e) => (e.target.style.borderColor = matchError ? "#ef4444" : border.color)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {matchError && (
                <p className="text-xs font-medium ml-1" style={{ color: "#ef4444" }}>
                  Passwords do not match
                </p>
              )}
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
                  Resetting...
                </>
              ) : (
                <>
                  Reset password
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
            <Lock size={40} />
          </div>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight" style={{ color: foreground.color }}>
            Secure password reset
          </h2>
          <p className="text-lg font-medium leading-relaxed" style={{ color: mutedForeground.color }}>
            Set a strong, unique password to protect your account. Use a mix of characters for maximum security.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm" style={{ color: mutedForeground.color }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Min 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Upper & lowercase</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Numbers & symbols</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;