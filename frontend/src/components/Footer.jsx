import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import {
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTimes,
  FaShieldAlt,
  FaQuestionCircle,
  FaFileContract,
  FaLock,
  FaLightbulb,
  FaSearch,
  FaBuilding,
  FaHeart,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa";
import { MdApartment, MdSell, MdVerified } from "react-icons/md";

const contentMap = {
  FAQ: {
    icon: <FaQuestionCircle className="text-brand-blue text-3xl" />,
    content:
      "Have questions? Browse our frequently asked questions covering everything from listing properties and contacting owners to payment safety and account management. Our support team is also available 24/7.",
  },
  "Terms of Service": {
    icon: <FaFileContract className="text-status-yellow text-3xl" />,
    content:
      "By using EasyRentals, you agree to our terms of service. This includes responsible use of our platform, honest listing content, and respectful communication between owners and renters. Full terms are available on request.",
  },
  "Privacy Policy": {
    icon: <FaLock className="text-brand-blue text-3xl" />,
    content:
      "We take your privacy seriously. EasyRentals collects only necessary data, never sells your information to third parties, and uses industry-standard encryption to protect your personal details.",
  },
  "Safety Tips": {
    icon: <FaShieldAlt className="text-status-green text-3xl" />,
    content:
      "Always visit properties in person before making any payment. Never share OTPs or passwords. Use our verified listing badge to identify trusted properties. Report suspicious listings immediately.",
  },
};

export default function Footer() {
  const [openPopup, setOpenPopup] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: FaYoutube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
  ];

  const quickLinks = token ? [
    { label: "Home", to: "/", icon: <FaHome className="text-xs" /> },
    { label: "Browse Properties", to: "/", icon: <FaSearch className="text-xs" /> },
    { label: "My Properties", to: "/my-houses", icon: <FaBuilding className="text-xs" /> },
  ] : [
    { label: "Browse Properties", to: "/", icon: <FaSearch className="text-xs" /> },
    { label: "Login", to: "/login", icon: <MdVerified className="text-xs" /> },
    { label: "Register", to: "/register", icon: <FaHeart className="text-xs" /> },
  ];

  return (
    <>
      <footer className="bg-[#0a0f1e] text-white font-inter relative overflow-hidden">
        {/* Top gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-purple-500 to-pink-500" />

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-12 mb-14 md:grid-cols-2 lg:grid-cols-4">

            {/* ── Brand Section ── */}
            <div className="lg:col-span-1 flex flex-col">
              <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
                <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaHome className="text-white text-xl" />
                </div>
                <span className="text-2xl font-poppins font-bold tracking-tight">
                  EasyRentals<span className="text-brand-blue">.com</span>
                </span>
              </Link>

              <p className="text-gray-400 leading-relaxed text-sm mb-8 max-w-xs">
                Find your perfect home with EasyRentals. We offer verified listings, transparent pricing, and a premium renting experience across India.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { value: "10K+", label: "Listings" },
                  { value: "50K+", label: "Users" },
                  { value: "4.9★", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-2xl px-2 py-3 text-center border border-white/5">
                    <div className="text-brand-blue font-poppins font-black text-base">{s.value}</div>
                    <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-2.5 flex-wrap">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 border border-white/10 text-gray-400 hover:text-white ${color} hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h3 className="text-base font-poppins font-bold text-white mb-7 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-brand-blue rounded-full inline-block" />
                Quick Links
              </h3>
              <ul className="space-y-3.5">
                {quickLinks.map(({ label, to, icon }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/8 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                        {icon}
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                      <FaChevronRight className="text-[9px] text-gray-600 group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Support ── */}
            <div>
              <h3 className="text-base font-poppins font-bold text-white mb-7 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-purple-500 rounded-full inline-block" />
                Support
              </h3>
              <ul className="space-y-3.5">
                {Object.entries(contentMap).map(([key, { icon }]) => (
                  <li key={key}>
                    <button
                      onClick={() => setOpenPopup(key)}
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 w-full text-left"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/8 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all duration-300">
                        {React.cloneElement(icon, { className: "text-xs text-purple-400 group-hover:text-purple-300" })}
                      </span>
                      <span className="text-sm font-medium">{key}</span>
                      <FaArrowRight className="text-[9px] text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact Us ── */}
            <div>
              <h3 className="text-base font-poppins font-bold text-white mb-7 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-pink-500 rounded-full inline-block" />
                Contact Us
              </h3>
              <ul className="space-y-5">
                <li>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0 group-hover:bg-red-500/20 transition-all duration-300 mt-0.5">
                      <FaMapMarkerAlt className="text-red-400 text-sm" />
                    </span>
                    <span className="text-sm leading-relaxed">
                      123 Rental Street, Surat,<br />Gujarat – 395001, India
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919876543210"
                    className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex-shrink-0 group-hover:bg-green-500/20 transition-all duration-300">
                      <FaPhoneAlt className="text-green-400 text-sm" />
                    </span>
                    <div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Call Us</div>
                      <span className="text-sm font-medium">+91 98765 43210</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@easyrentals.com"
                    className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex-shrink-0 group-hover:bg-brand-blue/20 transition-all duration-300">
                      <FaEnvelope className="text-brand-blue text-sm" />
                    </span>
                    <div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Email Us</div>
                      <span className="text-sm font-medium">support@easyrentals.com</span>
                    </div>
                  </a>
                </li>
              </ul>

            </div>
          </div>
          
          {/* Full-Width Newsletter Row (Filling the Red Box area) */}
          <div className="mb-14">
            <div className="w-full p-8 rounded-3xl bg-white/4 border border-white/8 relative overflow-hidden group/sub">
              <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 flex items-center justify-center text-brand-blue text-2xl shadow-inner">
                    📬
                  </div>
                  <div>
                    <h4 className="text-lg font-poppins font-bold text-white mb-1">Stay Ahead of the Market</h4>
                    <p className="text-sm text-gray-500">Subscribe for instant alerts on new properties in your area</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-[2] max-w-3xl">
                  <div className="flex-[2] relative min-w-0">
                    <input
                      type="email"
                      name="subEmail"
                      placeholder="Enter your email address"
                      className="w-full bg-white/5 text-sm text-white placeholder-gray-500 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="flex-1 relative min-w-0">
                    <input
                      type="text"
                      name="subLocation"
                      placeholder="Area (e.g. Surat)"
                      className="w-full bg-white/5 text-sm text-white placeholder-gray-500 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue focus:bg-white/10 transition-all"
                    />
                  </div>
                  <button 
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      const container = btn.closest('.flex-col');
                      const emailInput = container.querySelector('[name="subEmail"]');
                      const locationInput = container.querySelector('[name="subLocation"]');
                      const email = emailInput.value;
                      const location = locationInput.value;
                      
                      if(!email || !location) return alert("Please fill both email and location");
                      
                      btn.disabled = true;
                      const originalText = btn.innerText;
                      btn.innerText = "Subscribing...";
                      
                      try {
                        const res = await fetch(`${API_BASE_URL}/api/auth/subscribe`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, location })
                        });
                        const data = await res.json();
                        if(res.ok) {
                          alert(data.message || "Subscribed successfully!");
                          emailInput.value = "";
                          locationInput.value = "";
                        } else {
                          alert(data.error || "Subscription failed");
                        }
                      } catch (err) {
                        alert("Connection error. Is the server running?");
                      } finally {
                        btn.disabled = false;
                        btn.innerText = originalText;
                      }
                    }}
                    className="bg-brand-blue hover:bg-blue-700 text-white text-sm font-bold px-10 py-4 rounded-2xl shadow-lg shadow-brand-blue/20 transition-all duration-300 active:scale-95 disabled:opacity-50 flex-shrink-0"
                  >
                    Get Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()}{" "}
              <span className="text-gray-400 font-medium">EasyRentals.com</span> — All rights reserved.
              Made with <FaHeart className="inline text-red-500 text-xs mx-1" /> in India.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Sitemap", "Cookies"].map((item) => (
                <button
                  key={item}
                  onClick={() => setOpenPopup(item === "Privacy" ? "Privacy Policy" : item === "Terms" ? "Terms of Service" : null)}
                  className="text-xs text-gray-600 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Support Popup Modal ── */}
      {openPopup && contentMap[openPopup] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpenPopup(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Colored top strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-purple-500 to-pink-500" />

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    {contentMap[openPopup].icon}
                  </div>
                  <h2 className="text-2xl font-poppins font-black text-gray-900">{openPopup}</h2>
                </div>
                <button
                  onClick={() => setOpenPopup(null)}
                  className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors"
                >
                  <FaTimes className="text-base" />
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm mb-8">
                {contentMap[openPopup].content}
              </p>

              <button
                onClick={() => setOpenPopup(null)}
                className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-brand-blue text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Got it, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}