const fs = require('fs');
const file = 'c:/Users/VISHAL/Desktop/utsav/rentingweb/house-rent-sell/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Desktop NavLinks Update
const desktopNavBefore = `          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NavLink to="/" icon={<FaSearch className="text-sm opacity-80" />}>Properties</NavLink>
            <NavLink to="/rooms" icon={<FaHotel className="text-sm opacity-80" />}>Hotels & Rooms</NavLink>
          </div>`;

const desktopNavAfter = `          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NavLink to="/" icon={<LuBuilding size={16} className="opacity-80" />}>Residences</NavLink>
            <NavLink to="/rooms" icon={<LuBed size={16} className="opacity-80" />}>Hotels & Stays</NavLink>
          </div>`;
content = content.replace(desktopNavBefore, desktopNavAfter);

// 2. Profile Dropdown Update
const profileBeforeStart = `{/* Dropdown Menu */}
                  {isProfileOpen && (`;
const profileBeforeEnd = `Sign Out Account
                        </button>
                      </div>
                    </div>
                  )}`;

// Safely extract the old profile dropdown block using substring
const startIndex = content.indexOf(profileBeforeStart);
const endIndex = content.indexOf(profileBeforeEnd) + profileBeforeEnd.length;
if (startIndex !== -1 && endIndex !== -1) {
    const oldBlock = content.substring(startIndex, endIndex);

    const newBlock = `{/* Dropdown Menu */}
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
                      <div className="p-3 bg-white space-y-1">
                        {userRole !== "admin" && (
                          <Link
                            to="/my-houses"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-brand-blue hover:bg-blue-50/50 rounded-2xl transition-colors font-semibold group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-100/50 group-hover:text-brand-blue flex items-center justify-center transition-colors">
                              <LuLayoutDashboard size={16} className="stroke-[2.5]" />
                            </div>
                            My Dashboard
                          </Link>
                        )}
                        {userRole === "admin" && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-brand-blue hover:bg-blue-50/50 rounded-2xl transition-colors font-semibold group"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-100/50 group-hover:text-brand-blue flex items-center justify-center transition-colors">
                              <FaCheckCircle size={16} />
                            </div>
                            Admin Portal
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          onMouseDown={(e) => e.preventDefault()} 
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-2xl transition-colors font-semibold group"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-50 text-red-400 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center transition-colors">
                            <LuLogOut size={16} className="stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                          </div>
                          Sign Out Account
                        </button>
                      </div>
                    </div>
                  )}`;
    content = content.replace(oldBlock, newBlock);
}

// 3. Mobile NavLinks Update
const mobileNavBefore1 = `<Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/') ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <FaSearch /> Properties
          </Link>`;

const mobileNavAfter1 = `<Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/') ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <LuBuilding size={18} /> Residences
          </Link>`;

content = content.replace(mobileNavBefore1, mobileNavAfter1);

const mobileNavBefore2 = `<Link
            to="/rooms"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/rooms') ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <FaHotel /> Hotels & Rooms
          </Link>`;

const mobileNavAfter2 = `<Link
            to="/rooms"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/rooms') ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <LuBed size={18} /> Hotels & Stays
          </Link>`;

content = content.replace(mobileNavBefore2, mobileNavAfter2);

// NOTE: Fixed the mobile hover color for rooms menu item from purple-50/purple-600 to brand-blue to match the brand.

fs.writeFileSync(file, content);
console.log('Script done');
