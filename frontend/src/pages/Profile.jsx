import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, FaEnvelope, FaPhone, FaArrowLeft, 
  FaCheckCircle, FaExclamationCircle, FaSave, FaEdit 
} from "react-icons/fa";
import { LuUser, LuPhone, LuMail, LuShieldCheck, LuCamera, LuLayoutDashboard } from "react-icons/lu";
import API from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
  });

  const [isEditing, setIsEditing] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await API.put("/auth/profile", formData);
      const updatedUser = res.data.user;
      
      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Notify other components (like Navbar)
      window.dispatchEvent(new Event("storageUpdate"));
      
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter pb-20">
      {/* Cinematic Background Header */}
      <div className="relative h-[300px] bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
           <Link to="/" className="inline-flex items-center gap-2 text-blue-300/70 hover:text-white transition-colors mb-8 group">
             <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-sm font-bold uppercase tracking-widest">Back to Marketplace</span>
           </Link>
           
           <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-1 shadow-2xl relative overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                       <LuUser size={48} className="stroke-[1.5]" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-blue text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer border-2 border-white/10 hover:scale-110 transition-transform">
                   <LuCamera size={14} className="stroke-[2.5]" />
                </div>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-3xl sm:text-4xl font-poppins font-black text-white tracking-tight leading-none">
                     {user.name}
                   </h1>
                   <div className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                     Verified Account
                   </div>
                </div>
                <p className="text-blue-200/60 font-medium">{user.email}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Stats & Status */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl shadow-blue-900/5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Account Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Verification</span>
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                       <FaCheckCircle size={10} /> VERIFIED
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Account Type</span>
                    <span className="text-xs font-black text-brand-blue uppercase">{user.isOAuthUser ? "Google Auth" : "Standard"}</span>
                 </div>
                 <div className="h-px bg-gray-100" />
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">Member Since</span>
                    <span className="text-xs font-bold text-gray-900">April 2024</span>
                 </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-blue to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-brand-blue/20">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                     <LuShieldCheck className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold">Trust & Security</h3>
               </div>
               <p className="text-blue-100 text-[13px] leading-relaxed mb-4">
                 Your data is protected by industry-standard encryption and security protocols.
               </p>
               <button className="w-full py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                  View Security Settings
               </button>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-purple-500 to-emerald-500" />
              
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h2 className="text-xl font-poppins font-black text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-500 font-medium">Manage your contact details and identity</p>
                   </div>
                   {!isEditing && (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-brand-blue text-sm font-bold transition-all"
                     >
                       <FaEdit size={12} /> Edit Profile
                     </button>
                   )}
                </div>

                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-fadeIn">
                     <FaCheckCircle className="flex-shrink-0" />
                     <p className="text-[13px] font-bold">Profile updated successfully!</p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-fadeIn">
                     <FaExclamationCircle className="flex-shrink-0" />
                     <p className="text-[13px] font-bold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <LuUser size={12} className="text-brand-blue" /> Full Name
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="Enter your full name"
                      className={`w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[14px] font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue ${!isEditing ? "opacity-70 cursor-not-allowed" : "cursor-text"}`}
                    />
                  </div>

                  {/* Email field (Ready-only) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <LuMail size={12} className="text-brand-blue" /> Email Address
                    </label>
                    <div className="relative">
                      <input 
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[14px] font-semibold opacity-70 cursor-not-allowed"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" title="Email cannot be changed">
                        <LuShieldCheck size={18} />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium pl-1">Emails are locked to ensure account integrity.</p>
                  </div>

                  {/* Mobile field - Critical for the user's request */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <LuPhone size={12} className="text-brand-blue" /> Mobile Number
                    </label>
                    {!formData.mobile && !isEditing && (
                      <div onClick={() => setIsEditing(true)} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                           <FaExclamationCircle size={20} />
                        </div>
                        <div>
                           <p className="text-[13px] font-black text-amber-800 leading-tight">Phone number missing</p>
                           <p className="text-[11px] font-bold text-amber-600">Click to add. Required for listings.</p>
                        </div>
                        <div className="ml-auto text-amber-400 group-hover:translate-x-1 transition-transform">
                           <FaArrowLeft className="rotate-180" />
                        </div>
                      </div>
                    )}
                    {(formData.mobile || isEditing) && (
                      <input 
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[14px] font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue ${!isEditing ? "opacity-70 cursor-not-allowed" : "cursor-text"}`}
                      />
                    )}
                  </div>

                  {isEditing && (
                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-brand-blue text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FaSave size={14} />
                        )}
                        {loading ? "Updating..." : "Save Profile Changes"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ name: user.name, mobile: user.mobile || "" });
                        }}
                        className="flex-1 py-4 bg-gray-50 text-gray-500 hover:text-gray-700 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border border-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Premium Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
               <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
                    <LuLayoutDashboard size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">My Dashboard</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">Manage your active listings and room bookings.</p>
                  <Link to="/my-houses" className="text-xs font-black text-brand-blue uppercase tracking-widest hover:underline">Go to Dashboard →</Link>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <LuUser size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Identity Check</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">Your identity is verified via Google authentication.</p>
                  <div className="text-[10px] font-black text-purple-600 px-2 py-1 bg-purple-50 rounded-lg inline-block uppercase tracking-widest">G-Verified</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
