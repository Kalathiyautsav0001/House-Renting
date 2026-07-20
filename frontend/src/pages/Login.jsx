import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaChevronLeft, 
  FaCheckCircle,
  FaShieldAlt,
  FaFingerprint,
  FaGoogle
} from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

/* ─── Reusable Components ───────────────────────────────────────────────── */

function InputField({ label, icon: Icon, type, value, onChange, placeholder, error, rightElement }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 group">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-200/50 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/40 group-focus-within:text-brand-blue transition-colors">
          <Icon size={14} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-300 backdrop-blur-md ${
            error ? "border-red-500/50 ring-red-500/20" : ""
          }`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-red-400 font-bold ml-1 animate-fadeIn">{error}</p>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────────────────── */

export default function Login() {
  const navigate = useNavigate();

  // Auth States
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("login"); // login | forgot | otp | reset

  // Forgot Password Flow
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Visibility Toggles
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  /* ─── Handlers ────────────────────────────────────────────────────────── */

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storageUpdate"));
      
      // Redirect to 'All Houses' (Home) instead of 'My Houses' dashboard
      navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await API.post("/auth/forgot-password", { email: forgotEmail });
      setSuccess("OTP sent to your email!");
      setTimeout(() => { setSuccess(""); setStep("otp"); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "User not found.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/verify-otp", { email: forgotEmail, otp });
      setResetToken(res.data.resetToken);
      setSuccess("Identity verified!");
      setTimeout(() => { setSuccess(""); setStep("reset"); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await API.post("/auth/reset-password", { resetToken, password: newPassword });
      setSuccess("Password updated successfully!");
      setTimeout(() => { 
        setStep("login"); 
        setNewPassword(""); 
        setOtp(""); 
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");
      try {
        const res = await API.post("/auth/google-login", { accessToken: tokenResponse.access_token });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", res.data.user.role || "user");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("storageUpdate"));
        
        setSuccess("Successfully logged in with Google!");
        setTimeout(() => navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/"), 1000);
      } catch (err) {
        console.error("Google Auth Error:", err);
        setError("Google authentication failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google login failed")
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-inter selection:bg-brand-blue selection:text-white py-20 px-4 overflow-hidden">
      
      {/* ── Background Layer ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/assets/login-bg.png" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1629]/95 via-[#0f2748]/80 to-[#0b1629]/95" />
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* ── Auth Card ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-brand-blue p-px shadow-2xl mb-4 group cursor-pointer transition-transform duration-500 hover:rotate-12">
            <div className="w-full h-full bg-[#0b1629] rounded-[23px] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20 transition-all" />
              <FaFingerprint className="text-white text-3xl group-hover:scale-110 transition-transform relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-poppins font-black text-white tracking-tight mb-2 underline-offset-8">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-blue">Luxury</span>
          </h1>
          <p className="text-blue-200/40 text-sm font-medium">Elevating property renting, one search at a time.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden group/card shadow-[rgba(0,0,0,0.4)]">
          {/* subtle inside glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                <FaShieldAlt className="text-sm" />
              </div>
              <p className="text-xs font-bold text-red-200 leading-tight">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <FaCheckCircle className="text-sm" />
              </div>
              <p className="text-xs font-bold text-emerald-200 leading-tight">{success}</p>
            </div>
          )}

          {/* ════ Step-Based Render ════ */}
          
          {step === "login" && (
            <form onSubmit={handleLogin} className="animate-fadeIn">
              <InputField 
                label="Email Address"
                icon={FaEnvelope}
                type="email"
                placeholder="yours@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <InputField 
                label="Password"
                icon={FaLock}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                rightElement={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/20 hover:text-white transition-colors">
                    {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                }
              />

              <div className="flex items-center justify-between mt-2 mb-8 px-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative w-4 h-4">
                    <input type="checkbox" className="peer hidden" />
                    <div className="w-full h-full bg-white/5 border border-white/20 rounded peer-checked:bg-brand-blue peer-checked:border-brand-blue transition-all" />
                    <FaCheckCircle className="absolute inset-0 m-auto text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-all" />
                  </div>
                  <span className="text-xs font-bold text-blue-200/40 group-hover:text-blue-200/70 transition-colors">Remember Me</span>
                </label>
                <button type="button" onClick={() => setStep("forgot")} className="text-xs font-black text-brand-blue hover:text-emerald-400 transition-colors uppercase tracking-wider">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-brand-blue hover:from-brand-blue hover:to-emerald-500 text-white font-black py-4 rounded-[20px] transition-all duration-300 shadow-xl shadow-brand-blue/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <FaArrowRight /></>
                )}
              </button>

              <div className="relative my-10 group">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/5 group-hover:border-white/10 transition-colors"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                  <span className="bg-[#0b1629] px-6 text-white/10 group-hover:text-white/30 transition-colors">Or Continue With</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                 <button
                    type="button"
                    onClick={() => loginWithGoogle()}
                    disabled={isLoading}
                    className="group relative w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-blue/30 hover:bg-white/[0.08] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                 >
                    {/* Subtle Gradient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-brand-blue/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-brand-blue/10 group-hover:to-emerald-500/5 transition-all duration-500" />
                    
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    
                    <span className="relative text-sm font-bold text-blue-200/60 group-hover:text-white transition-colors">
                      Secure Sign in with Google
                    </span>
                 </button>
              </div>
            </form>
          )}

          {step === "forgot" && (
            <div className="animate-fadeIn">
              <button onClick={() => setStep("login")} className="flex items-center gap-2 text-blue-200/40 hover:text-white text-xs font-bold mb-6 transition-colors group">
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Login
              </button>
              <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
              <p className="text-blue-200/40 text-xs mb-8">Enter your email and we'll send you an OTP.</p>
              
              <form onSubmit={handleForgotPass}>
                <InputField 
                  label="Registered Email"
                  icon={FaEnvelope}
                  type="email"
                  placeholder="verify@identity.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading || !forgotEmail}
                  className="w-full bg-white text-gray-900 font-black py-4 rounded-[20px] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-6"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div className="animate-fadeIn">
              <button 
                 onClick={() => { setStep("forgot"); setError(""); setSuccess(""); setOtp(""); }} 
                 className="flex items-center gap-2 text-blue-200/40 hover:text-white text-xs font-bold mb-6 transition-colors group"
              >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Change Email
              </button>
              <h3 className="text-xl font-bold text-white mb-2">Verify Identity</h3>
              <p className="text-blue-200/40 text-xs mb-8">Enter the 6-digit code sent to <span className="text-white underline">{forgotEmail}</span></p>

              <form onSubmit={handleVerifyOtp}>
                <div className="relative mb-8">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/40">
                    <FaShieldAlt size={14} />
                  </div>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 text-white text-center tracking-[1em] py-5 rounded-2xl font-black text-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-brand-blue text-white font-black py-4 rounded-[20px] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            </div>
          )}

          {step === "reset" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-2 underline-offset-4 decoration-emerald-500">New Password</h3>
                <p className="text-blue-200/40 text-xs mb-8">Identity confirmed. Secure your account now.</p>

                <form onSubmit={handleResetPass}>
                  <InputField 
                    label="Create New Password"
                    icon={FaLock}
                    type={showNewPass ? "text" : "password"}
                    placeholder="Must be 6+ chars"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    rightElement={
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="text-white/20 hover:text-white transition-colors">
                        {showNewPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    }
                  />
                  <button
                    type="submit"
                    disabled={isLoading || newPassword.length < 6}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-black py-4 rounded-[20px] hover:from-emerald-600 hover:to-emerald-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-6 shadow-xl shadow-emerald-900/40"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
          )}

          {/* Footer Social / Register Link */}
          {step === "login" && (
            <div className="mt-10 text-center">
              <p className="text-xs font-medium text-blue-200/30">
                New to our community?{" "}
                <Link to="/register" className="text-white hover:text-brand-blue font-black transition-colors underline underline-offset-4 decoration-brand-blue/30 hover:decoration-brand-blue">
                  Create an account
                </Link>
              </p>
            </div>
          )}

        </div>

        {/* Floating Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="h-[1px] w-8 bg-white/10" />
          <div className="flex items-center gap-2 text-white/20 group">
             <FaShieldAlt className="text-xs group-hover:text-emerald-400 transition-colors" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Military Grade Security</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Prevent Chrome Autofill from breaking glassmorphism */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px #0b162920 !important;
        }
      `}</style>

    </div>
  );
}
