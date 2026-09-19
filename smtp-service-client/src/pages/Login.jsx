import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Navigate, Link } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { motion } from "motion/react";
import { Mail, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

const Login = () => {
  const { user, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const {
    background,
    foreground,
    primary,
    primaryForeground,
    card,
    border,
    input,
    mutedForeground,
  } = useThemeStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Password must contain at least one special character";
    return null;
  };

  if (user) return <Navigate to={redirectPath} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);

    const result = await handleLogin(email, password);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen w-full flex transition-colors duration-500"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-8 relative z-10 w-full pt-20 lg:pt-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-base font-medium" style={{ color: mutedForeground.color }}>
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <AlertCircle size={18} />
                {error}
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
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${border.color}`,
                }}
                onFocus={(e) => (e.target.style.borderColor = primary.color)}
                onBlur={(e) => (e.target.style.borderColor = border.color)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold" style={{ color: foreground.color }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: primary.color }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${border.color}`,
                }}
                onFocus={(e) => (e.target.style.borderColor = primary.color)}
                onBlur={(e) => (e.target.style.borderColor = border.color)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <p className="text-center text-sm mt-6 font-medium" style={{ color: mutedForeground.color }}>
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-bold hover:underline transition-all duration-300"
                style={{ color: primary.color }}
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Pane - Ambient Graphics (Hidden on Mobile) */}
      <div 
        className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden"
        style={{ backgroundColor: `${primary.color}10` }} // Slight tint
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
            <Sparkles size={40} />
          </div>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight" style={{ color: foreground.color }}>
            Build powerful email workflows in minutes.
          </h2>
          <p className="text-lg font-medium leading-relaxed" style={{ color: mutedForeground.color }}>
            Join thousands of developers prioritizing deliverability, speed, and modern architectural standards.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
