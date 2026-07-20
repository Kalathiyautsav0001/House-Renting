import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  FaHome, FaPlus, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaBuilding, FaSignInAlt, FaUserPlus, FaCheckCircle,
  FaUserCircle, FaEnvelope, FaPhone, FaChevronDown, FaHotel
} from "react-icons/fa";
import { LuUser, LuLogOut, LuLayoutDashboard, LuMail, LuPhone, LuBuilding, LuBed } from "react-icons/lu";
import MarketplaceToggle from "./MarketplaceToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isListingOpen, setIsListingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const listingRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUserRole(localStorage.getItem("userRole"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storageUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageUpdate', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Determine scroll state for glassmorphic effect
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Strict Body Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (listingRef.current && !listingRef.current.contains(event.target)) {
        setIsListingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    setToken(null);
    setUserRole(null);
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleNewListing = () => {
    if (token) {
      navigate("/add-house");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, children }) => (
    <Link
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={`flex items-center gap-2 px-5 py-2 text-[14px] font-[600] transition-all duration-300 rounded-full whitespace-nowrap 
        ${isActive(to) 
          ? "text-brand-blue bg-blue-50/80 shadow-sm border border-blue-100/50" 
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 font-inter ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200 py-3' : 'bg-white py-4 border-b border-gray-100/50'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 relative">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                window.dispatchEvent(new Event("openInfoPopup"));
                if (location.pathname !== "/") navigate("/");
              }} 
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className="flex items-center justify-center w-11 h-11 bg-brand-blue rounded-xl shadow-lg shadow-brand-blue/30 group-hover:scale-105 transition-transform duration-300">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-[22px] font-poppins font-black tracking-tight text-gray-900">
                EasyRentals<span className="text-brand-blue">.com</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Center Toggle */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
            <MarketplaceToggle />
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center justify-end flex-shrink-0 gap-5">
            {/* Premium New Listing Dropdown */}
            <div className="relative" ref={listingRef}>
              <button 
                onClick={() => setIsListingOpen(!isListingOpen)}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold text-[14px] whitespace-nowrap rounded-full transition-all duration-300 shadow-md shadow-brand-blue/20 transform hover:-translate-y-0.5 flex-shrink-0"
              >
                <FaPlus className={`text-[13px] transition-transform duration-300 ${isListingOpen ? 'rotate-45' : ''}`} /> 
                New Listing
                <FaChevronDown className={`text-[10px] ml-1 transition-transform duration-300 ${isListingOpen ? 'rotate-180' : ''}`} />
              </button>

              {isListingOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 z-[60]">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { navigate("/add-house?category=house"); setIsListingOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-brand-blue rounded-2xl transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white flex items-center justify-center transition-colors">
                        <FaHome size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">Residences</p>
                        <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Flat, Villa, Plot...</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { navigate("/add-house?category=hotel"); setIsListingOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-2xl transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <FaHotel size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">Hotels</p>
                        <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Rooms, Resorts, Stays...</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { navigate("/add-house?category=business"); setIsListingOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-2xl transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <FaBuilding size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">Business</p>
                        <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">Shops, Warehouse, Office...</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!token ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-[2px] rounded-full bg-gray-100 mx-1" />
                <Link to="/login" className="flex items-center gap-2 font-bold text-gray-600 hover:text-brand-blue transition-colors duration-200 px-4 py-2">
                  <FaSignInAlt /> Log In
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white hover:bg-blue-700 font-bold rounded-full transition-all duration-200 shadow-md shadow-brand-blue/20">
                  <FaUserPlus /> Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <div className="h-8 w-[2px] rounded-full bg-gray-100" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue border border-blue-100 group-hover:bg-brand-blue group-hover:text-white transition-colors overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaUserCircle className="text-2xl" />
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight tracking-tight">{user?.name || 'Account'}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{userRole}</p>
                    </div>
                    <FaChevronDown className={`text-[10px] text-gray-400 ml-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden animate-in fade-in zoom-in duration-200 z-[60]">
                      {/* Premium Header */}
                      <div className="bg-gradient-to-br from-brand-blue/10 via-brand-blue/5 to-transparent p-6 border-b border-gray-50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shadow-inner ring-2 ring-brand-blue/20">
                            <LuUser className="text-3xl" />
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-blue text-lg leading-tight truncate max-w-[180px]">{user?.name}</h4>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-lg">
                              {userRole}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center gap-3 text-gray-500 text-[13px] font-medium">
                            <LuMail className="text-brand-blue/50 stroke-[2.5]" size={15} />
                            <span className="truncate">{user?.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500 text-[13px] font-medium">
                            <LuPhone className="text-brand-blue/50 stroke-[2.5]" size={15} />
                            <span>{user?.mobile || 'No Phone Registered'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="p-2 bg-white space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-brand-blue hover:bg-blue-50/50 rounded-xl transition-colors font-medium text-[13px] group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100/50 group-hover:text-brand-blue flex items-center justify-center transition-colors">
                            <LuUser size={14} className="stroke-[2.5]" />
                          </div>
                          My Profile
                        </Link>
                        {userRole !== "admin" && (
                          <Link
                            to="/my-houses"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-brand-blue hover:bg-blue-50/50 rounded-xl transition-colors font-medium text-[13px] group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100/50 group-hover:text-brand-blue flex items-center justify-center transition-colors">
                              <LuLayoutDashboard size={14} className="stroke-[2.5]" />
                            </div>
                            My Dashboard
                          </Link>
                        )}
                        {userRole === "admin" && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-brand-blue hover:bg-blue-50/50 rounded-xl transition-colors font-medium text-[13px] group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100/50 group-hover:text-brand-blue flex items-center justify-center transition-colors">
                              <FaCheckCircle size={14} />
                            </div>
                            Admin Portal
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          onMouseDown={(e) => e.preventDefault()} 
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-colors font-medium text-[13px] group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50/50 text-red-400 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center transition-colors">
                            <LuLogOut size={14} className="stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                          </div>
                          Sign Out Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-gray-600 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Backdrop - Also locks scrolling at the overlay layer */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-500 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Mobile Sidebar Navigation */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-full z-50 bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
                    <FaHome className="text-sm" />
                </div>
                <span className="text-lg font-poppins font-black tracking-tight text-gray-900 leading-none">
                    EasyRentals<span className="text-brand-blue">.com</span>
                </span>
            </div>
            <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:shadow-md"
            >
                <FaTimes className="text-lg" />
            </button>
        </div>

        {/* Sidebar Scrollable Body */}
        <div className="px-5 py-8 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar overscroll-contain">
          
          {/* Mobile Marketplace Toggle */}
          <div className="mb-4">
             <MarketplaceToggle mobile={true} onSelect={() => setIsMenuOpen(false)} />
          </div>

          <div className="h-px bg-gray-100 w-full mb-2" />

          
          <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col gap-4">
            {/* Always visible Mobile New Listing Button */}
            <button 
              onClick={handleNewListing}
              className="w-full flex items-center justify-center gap-2 py-4 font-bold text-white bg-brand-blue rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/30 scale-100 active:scale-95"
            >
              <FaPlus /> New Listing
            </button>

            {!token ? (
              <div className="grid grid-cols-1 gap-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-gray-700 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <FaSignInAlt /> Log In
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-white bg-brand-blue rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/30">
                  <FaUserPlus /> Sign Up Free
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mobile User Profile Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/20">
                      <FaUserCircle className="text-3xl" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-poppins font-bold text-gray-900 leading-tight truncate">{user?.name}</h4>
                      <p className="inline-block mt-0.5 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-black uppercase tracking-widest rounded-md">{userRole}</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 border-t border-gray-100 pt-4 mt-1">
                    <div className="flex items-center gap-3 text-gray-500 text-[13px] font-medium">
                      <FaEnvelope className="text-brand-blue/40" size={14} />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-[13px] font-medium">
                      <FaPhone className="text-brand-blue/40" size={14} />
                      <span>{user?.mobile}</span>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-brand-blue/10 text-brand-blue rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                  >
                    <LuUser size={14} /> My Profile
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {userRole !== "admin" && (
                    <Link to="/my-houses" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                      <LuLayoutDashboard size={18} className="text-brand-blue" /> Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                      <FaCheckCircle className="text-brand-blue" /> Admin Portal
                    </Link>
                  )}

                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-red-500 bg-red-50/50 border border-red-100 rounded-2xl hover:bg-red-100 transition-colors">
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}