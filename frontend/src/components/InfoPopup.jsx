import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaSearch,
  FaHome,
  FaMobileAlt,
  FaUserCog,
  FaExclamationTriangle,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaEye,
  FaTimes,
  FaHandshake,
  FaComments,
  FaClipboardList,
  FaLocationArrow,
  FaUserTie,
  FaUserFriends,
  FaArrowRight,
  FaSignInAlt,
  FaUserPlus,
  FaHotel,
  FaBed,
  FaSuitcase
} from "react-icons/fa";

export default function InfoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenPopup = () => setIsOpen(true);
    window.addEventListener("openInfoPopup", handleOpenPopup);
    return () => window.removeEventListener("openInfoPopup", handleOpenPopup);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn font-inter">
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden bg-[#f0f4fb] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl animate-slideUp flex flex-col max-h-[90vh]">
        
        {/* ════════════════════════════════════════════════════════
            CINEMATIC HEADER
        ════════════════════════════════════════════════════════ */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] overflow-hidden flex-shrink-0">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-lg">
                <FaHome className="text-white text-3xl drop-shadow-md" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                  Marketplace Ecosystem
                </div>
                <h2 className="text-2xl sm:text-3xl font-poppins font-black text-white tracking-tight drop-shadow-sm leading-none m-0">
                  Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-brand-blue">Home</span> or <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">Stay</span>
                </h2>
                <p className="text-blue-200/70 text-xs sm:text-sm font-medium mt-1.5">
                  The smartest way to rent or book, completely direct and hassle-free.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-md"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            SCROLLABLE BODY
        ════════════════════════════════════════════════════════ */}
        <div className="px-4 py-8 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-10">
          
          {/* 1. AUDIENCE SPLIT (Owners vs Tenants) */}
          <section>
            <h3 className="text-center font-poppins font-black text-gray-900 text-xl md:text-2xl mb-6">Who is this platform for?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* For Tenants & Travelers */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                    <FaUserFriends className="text-brand-blue text-xl" />
                  </div>
                  <h4 className="font-poppins font-bold text-gray-900 text-lg mb-2">Tenants & Travelers</h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Discover residential homes for long-term living or premium hotel rooms for your next stay. Connect directly with providers via one-click WhatsApp/Call integrations with zero commission.
                  </p>
                </div>
              </div>

              {/* For Owners & Hoteliers */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                    <FaUserTie className="text-purple-600 text-xl" />
                  </div>
                  <h4 className="font-poppins font-bold text-gray-900 text-lg mb-2">Owners & Hoteliers</h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    List your properties or hotel rooms for free. Manage your inventory on a unified dashboard, toggle visibility instantly, and receive direct inquiries from thousands of potential users.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* NEW SECTION: MARKETPLACE SPLIT */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 sm:p-8 rounded-[32px] border border-blue-100/50">
            <h3 className="text-center font-poppins font-black text-gray-900 text-xl mb-6">Dual Marketplace Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg mb-4">
                     <FaHome className="text-2xl" />
                  </div>
                  <h5 className="font-poppins font-black text-blue-600 uppercase tracking-widest text-sm mb-2">Home Explorer</h5>
                  <p className="text-xs font-medium text-gray-500 leading-relaxed italic">"For those looking for a place to call home."</p>
                  <ul className="text-[11px] text-gray-600 font-bold mt-4 space-y-2">
                    <li className="flex items-center gap-2">✓ Long-term Residencies</li>
                    <li className="flex items-center gap-2">✓ Full Property Details</li>
                    <li className="flex items-center gap-2">✓ Direct Owner Access</li>
                  </ul>
               </div>

               <div className="flex flex-col items-center text-center p-4 border-l border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg mb-4">
                     <FaHotel className="text-2xl" />
                  </div>
                  <h5 className="font-poppins font-black text-purple-600 uppercase tracking-widest text-sm mb-2">Stay Explorer</h5>
                  <p className="text-xs font-medium text-gray-500 leading-relaxed italic">"For those seeking a premium temporary stay."</p>
                  <ul className="text-[11px] text-gray-600 font-bold mt-4 space-y-2">
                    <li className="flex items-center gap-2">✓ Hotel Rooms & Stays</li>
                    <li className="flex items-center gap-2">✓ Unified Amenity Lists</li>
                    <li className="flex items-center gap-2">✓ Professional Management</li>
                  </ul>
               </div>
            </div>
          </section>

          {/* 2. HOW IT WORKS */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <h3 className="font-poppins font-black text-gray-400 uppercase tracking-widest text-sm">How it works</h3>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n: 1, title: "Create Identity", text: "Register securely for personalized access.", icon: FaCheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                { n: 2, title: "Pick Your Path", text: "Explore Homes or premium Stays.", icon: FaLocationArrow, color: "text-brand-blue", bg: "bg-blue-50" },
                { n: 3, title: "Direct Contact", text: "Call or WhatsApp with one click.", icon: FaMobileAlt, color: "text-purple-500", bg: "bg-purple-50" },
                { n: 4, title: "Enjoy Your Stay", text: "Finalize offline and move in or check in.", icon: FaHandshake, color: "text-amber-500", bg: "bg-amber-50" },
              ].map((step, i) => (
                <div key={step.n} className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center flex flex-col items-center group hover:shadow-md transition-shadow">
                  {/* Connector Line (desktop) */}
                  {i < 3 && <FaArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-200 z-10" />}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${step.bg} group-hover:scale-110 transition-transform`}>
                    <step.icon className={`${step.color} text-xl`} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Step {step.n}</span>
                  <h4 className="font-poppins font-bold text-gray-900 mb-1 leading-tight">{step.title}</h4>
                  <p className="text-xs font-medium text-gray-500 px-2">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. PLATFORM FEATURES GRID */}
          <section>
            <h3 className="font-poppins font-black text-gray-900 text-xl mb-4 pl-2">Key Platform Features</h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaShieldAlt className="text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Secure Architecture</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Encrypted data processing and authenticated API routes ensuring safety.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaComments className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Zero Middlemen</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">We provide one-click integrations to WhatsApp directly to property owners.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaLocationArrow className="text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Dynamic Filtering</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Search properties by type, budget, and location dynamically without reloads.</p>
                  </div>
                </div>

              </div>
              <div className="hidden sm:block w-full h-px bg-gray-100" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaSuitcase className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Traveler Focused</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Dedicated sections for short-term stays with standardized amenities.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaBed className="text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Unified Dashboards</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">A central portal to manage both Residential listings and Room inventory.</p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 border-b-2 flex items-center justify-center flex-shrink-0 align-top">
                    <FaSearch className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Cinematic Search</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">A premium, responsive view across both marketplaces with high-res imagery.</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 4. IMPORTANT NOTICES (Alerts grouped together at the bottom) */}
          <section className="bg-white border text-left border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-poppins font-black text-gray-900 text-lg border-b border-gray-100 pb-2">Important Guidelines</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Registration notice */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-amber-900 mb-2 text-sm">
                  <FaUserCog className="text-amber-500" /> Identity verification via Registration
                </h4>
                <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                  When you <Link to="/register" onClick={() => setIsOpen(false)} className="font-bold text-brand-blue hover:underline">register</Link>, 
                  provide your exact <strong className="text-amber-900">Email, Name, and Mobile Number</strong>. 
                  These automatically establish your <span className="bg-amber-100 px-1 rounded">Owner Contact info</span> when you list a property. Tenants rely on this info to call you.
                </p>
              </div>

              {/* Password notice */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-4">
                <h4 className="flex items-center gap-2 font-bold text-rose-900 mb-2 text-sm">
                  <FaLock className="text-rose-500" /> Password Safety Best Practices
                </h4>
                <ul className="text-xs text-rose-800/80 leading-relaxed font-medium space-y-1.5 list-disc list-inside">
                  {/* <li><strong>Dev Mode:</strong> The "Forgot Password" feature is disabled.</li> */}
                  <li>Use a reliable password manager or store passwords safely offline.</li>
                  <li>Incorporate 8+ characters, uppercase, and numbers.</li>
                </ul>
              </div>
            </div>

            {/* General Disclaimer */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="mt-1 flex-shrink-0"><FaExclamationTriangle className="text-gray-400 text-xl" /></div>
              <div>
                <h4 className="font-bold text-gray-700 text-sm mb-1">Platform Disclaimer & Role</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  EasyRentals serves strictly as an informational posting platform linking property owners and interested tenants. We DO NOT handle escrows, digital payments, background verifications, or dispute resolutions. Users must perform their own due diligence before signing leases or exchanging funds.
                </p>
              </div>
            </div>

            {/* Admin Moderation Notice */}
            <div className="bg-gradient-to-r from-[#2d0b16] to-[#0b1629] text-white rounded-2xl p-6 relative overflow-hidden group shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] border border-red-900/30">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-all duration-500 group-hover:rotate-12">
                  <FaShieldAlt className="text-6xl text-red-500" />
               </div>
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-[10px] font-black uppercase tracking-widest mb-3">
                    <FaUserCog className="text-xs" /> Official Policy
                  </div>
                  <h4 className="font-poppins font-black text-white text-lg mb-2 tracking-tight">
                    Admin Moderation Rights
                  </h4>
                  <p className="text-xs text-red-100/70 leading-relaxed font-semibold">
                    Properties that do not fulfill platform quality standards, contain invalid photos, or provide incorrect contact details can be <strong className="text-white">hidden from search</strong> or <strong className="text-white">permanently deleted</strong> by the Super Admin at any time to maintain platform integrity.
                  </p>
               </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              FOOTER ACTIONS (now inside scrollable area)
          ════════════════════════════════════════════════════════ */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
             <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                <div className="hidden md:block">
                   <p className="text-sm font-bold text-gray-800 tracking-tight">Ready to start finding or listing?</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap w-full md:w-auto items-center gap-3">
                   <Link
                     to="/"
                     onClick={() => setIsOpen(false)}
                     className="group flex-1 sm:flex-none flex items-center gap-2 justify-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-all duration-300 border border-gray-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                   >
                     <FaSearch className="text-xs group-hover:rotate-12 transition-transform" />
                     <span>Explore First</span>
                   </Link>
                   <Link
                     to="/login"
                     onClick={() => setIsOpen(false)}
                     className="group flex-1 sm:flex-none flex items-center gap-2 justify-center px-6 py-3 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white font-bold text-sm rounded-xl transition-all duration-300 hover:shadow-lg shadow-brand-blue/10 hover:scale-[1.02] active:scale-[0.98]"
                   >
                     <FaSignInAlt className="text-xs group-hover:translate-x-0.5 transition-transform" />
                     <span>Sign In</span>
                   </Link>
                   <Link
                     to="/register"
                     onClick={() => setIsOpen(false)}
                     className="group flex-[2] sm:flex-none flex items-center gap-2 justify-center px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-xl shadow-brand-blue/25 hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-[0.98]"
                   >
                     <FaUserPlus className="text-sm group-hover:scale-110 transition-transform" />
                     <span>Create Account</span>
                     <FaArrowRight className="text-xs hidden sm:block opacity-70 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}