import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import InfoPopup from "../components/InfoPopup";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone,
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaChevronLeft, 
  FaCheckCircle,
  FaShieldAlt,
  FaFingerprint,
  FaCaretDown,
  FaTimes
} from "react-icons/fa";

/* ─── Constants ────────────────────────────────────────────────────────── */

const COUNTRIES = [
  { name: "India", code: "+91", iso: "IN", flag: "🇮🇳", length: 10 },
  { name: "USA", code: "+1", iso: "US", flag: "🇺🇸", length: 10 },
  { name: "UK", code: "+44", iso: "GB", flag: "🇬🇧", length: 10 },
  { name: "UAE", code: "+971", iso: "AE", flag: "🇦🇪", length: 9 },
  { name: "Australia", code: "+61", iso: "AU", flag: "🇦🇺", length: 9 },
  { name: "Canada", code: "+1", iso: "CA", flag: "🇨🇦", length: 10 },
  { name: "Germany", code: "+49", iso: "DE", flag: "🇩🇪", length: 11 },
];

/* ─── Reusable Input Component ─────────────────────────────────────────── */

function InputField({ label, icon: Icon, type, value, onChange, placeholder, error, rightElement, name, required = true }) {
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
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
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

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    mobile: "" 
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const handleOpenInfo = () => {
    window.dispatchEvent(new CustomEvent("openInfoPopup"));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!form.name || form.name.length < 3) newErrors.name = "Full name must be at least 3 characters";
    if (!form.email || !emailRegex.test(form.email)) newErrors.email = "Please enter a valid email address";
    
    // Dynamic Mobile Validation
    const cleanMobile = form.mobile.replace(/\D/g, '');
    if (!form.mobile || cleanMobile.length !== selectedCountry.length) {
      newErrors.mobile = `Mobile number for ${selectedCountry.name} must be ${selectedCountry.length} digits`;
    }
    
    if (!form.password || form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!acceptedTerms) newErrors.terms = "You must accept the terms to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setAcceptedTerms(checked);
      if (errors.terms) setErrors(prev => ({ ...prev, terms: null }));
    } else {
      let finalValue = value;
      if (name === "mobile") {
        // Only allow digits
        finalValue = value.replace(/\D/g, '').slice(0, selectedCountry.length);
      }
      
      setForm({ ...form, [name]: finalValue });
      // Clear error for this field
      if (errors[name]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Pre-pend country code for international format
      const finalForm = {
        ...form,
        mobile: `${countryCode}${form.mobile.replace(/\D/g, '')}`
      };
      
      await API.post("/auth/register", finalForm);
      // Success - Redirect to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="relative z-10 w-full max-w-[480px]">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-brand-blue p-px shadow-2xl mb-4 group cursor-pointer transition-transform duration-500 hover:rotate-12">
            <div className="w-full h-full bg-[#0b1629] rounded-[23px] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20 transition-all" />
              <FaFingerprint className="text-white text-3xl group-hover:scale-110 transition-transform relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-poppins font-black text-white tracking-tight mb-2">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-blue">Elite</span>
          </h1>
          <p className="text-blue-200/40 text-sm font-medium">Create your property profile in seconds.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-10 shadow-2xl relative group/card shadow-[rgba(0,0,0,0.4)]">
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

          <form onSubmit={handleSubmit} className="animate-fadeIn">
            <InputField 
              label="Full Name"
              name="name"
              icon={FaUser}
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* International Mobile Input (Full Width) */}
            <div className="flex flex-col gap-1.5 mb-4 group relative">
              <label className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-200/50 ml-1">
                Mobile Number
              </label>
              
              {/* Unified Field Container */}
              <div className={`relative flex items-center bg-white/5 border rounded-2xl transition-all duration-300 backdrop-blur-md group-focus-within:border-brand-blue group-focus-within:ring-2 group-focus-within:ring-brand-blue/30 ${showCountryPicker ? 'z-50' : 'z-0'} ${errors.mobile ? 'border-red-500/50 ring-red-500/10' : 'border-white/10'}`}>
                
                {/* Country Selector Button */}
                <div className="w-[65px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="w-full h-[48px] px-2 flex items-center justify-center gap-1.5 border-r border-white/5 hover:bg-white/5 transition-all text-white"
                  >
                    <span className="text-sm font-bold tracking-tight">{selectedCountry.code}</span>
                    <FaCaretDown className={`text-[9px] text-blue-300/40 transition-transform mt-0.5 ${showCountryPicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Dropdown Menu (Positioned to full container) */}
                {showCountryPicker && (
                  <div className="absolute top-[54px] left-0 w-full bg-[#0b1629] border border-white/10 rounded-2xl shadow-2xl z-[999] backdrop-blur-xl overflow-hidden animate-fadeIn">
                    <div className="p-2.5 border-b border-white/5 bg-white/5">
                      <p className="text-[9px] font-black text-blue-300/30 uppercase tracking-widest pl-2">Select Country</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto no-scrollbar">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code + c.name}
                          type="button"
                          onClick={() => { setCountryCode(c.code); setShowCountryPicker(false); if(errors.mobile) setErrors(prev => ({...prev, mobile: null})); }}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-brand-blue/20 transition-all group border-b border-white/[0.02] last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 flex items-center justify-center bg-white/5 rounded-lg text-lg grayscale group-hover:grayscale-0 transition-all">{c.flag}</span>
                            <div className="flex flex-col items-start translate-y-[1px]">
                              <span className="text-[11px] font-black text-white leading-none mb-1">{c.name}</span>
                              <span className="text-[9px] font-bold text-blue-200/30 leading-none">{c.iso}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-lg">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Phone Number Field */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/40 group-focus-within:text-brand-blue transition-colors">
                    <FaPhone size={14} />
                  </div>
                  <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder={selectedCountry.length + " digits"}
                    className="w-full h-[48px] bg-transparent text-white pl-10 pr-4 text-sm font-medium placeholder-white/20 focus:outline-none transition-all duration-300 border-none ring-0"
                  />
                </div>
              </div>
              {errors.mobile && <p className="text-[10px] text-red-400 font-bold ml-1 animate-fadeIn">{errors.mobile}</p>}
            </div>

            <InputField 
              label="Email Address"
              name="email"
              icon={FaEnvelope}
              type="email"
              placeholder="yours@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField 
              label="Password"
              name="password"
              icon={FaLock}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              rightElement={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/20 hover:text-white transition-colors">
                  {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              }
            />

            <div className="flex flex-col gap-2 mb-8 px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative w-4 h-4">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={acceptedTerms}
                    onChange={handleChange}
                    className="peer hidden" 
                  />
                  <div className={`w-full h-full bg-white/5 border rounded peer-checked:bg-brand-blue peer-checked:border-brand-blue transition-all ${errors.terms ? 'border-red-500' : 'border-white/20'}`} />
                  <FaCheckCircle className="absolute inset-0 m-auto text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-all" />
                </div>
                <span className="text-xs font-bold text-blue-200/40 group-hover:text-blue-200/70 transition-colors">
                  I agree to the <button type="button" onClick={handleOpenInfo} className="text-brand-blue underline decoration-brand-blue/30">Terms</button> and <button type="button" onClick={handleOpenInfo} className="text-brand-blue underline decoration-brand-blue/30">Privacy</button>
                </span>
              </label>
              {errors.terms && <p className="text-[10px] text-red-400 font-bold ml-1 animate-fadeIn">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] bg-gradient-to-r from-emerald-500 to-brand-blue text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">{isLoading ? "Creating Profile..." : "Create Account"}</span>
              {!isLoading && <FaChevronLeft size={12} className="rotate-180 relative z-10 group-hover:translate-x-1 transition-transform" /> }
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs font-medium text-blue-200/30">
              Already a member?{" "}
              <Link to="/login" className="text-white hover:text-brand-blue font-black transition-colors underline underline-offset-4 decoration-brand-blue/30 hover:decoration-brand-blue">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="h-[1px] w-8 bg-white/10" />
          <div className="flex items-center gap-2 text-white/20 group cursor-default">
             <FaShieldAlt className="text-xs group-hover:text-emerald-400 transition-colors" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Platform Verified</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
        </div>
      </div>
      <InfoPopup />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modalFade {
          animation: modalFade 0.4s ease-out forwards;
        }
        .animate-modalSlide {
          animation: modalSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
