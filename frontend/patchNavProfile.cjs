const fs = require('fs');
const file = 'c:/Users/VISHAL/Desktop/utsav/rentingweb/house-rent-sell/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Dashboard and Admin Portal from Desktop Nav Center
const desktopCenterBefore = `          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NavLink to="/" icon={<FaSearch className="text-sm opacity-80" />}>Properties</NavLink>
            <NavLink to="/rooms" icon={<FaHotel className="text-sm opacity-80" />}>Hotels & Rooms</NavLink>
            {token && userRole !== "admin" && <NavLink to="/my-houses" icon={<FaBuilding className="text-sm opacity-80" />}>Dashboard</NavLink>}
            {userRole === "admin" && <NavLink to="/admin-dashboard" icon={<FaCheckCircle className="text-sm opacity-80" />}>Admin Portal</NavLink>}
          </div>`;

const desktopCenterAfter = `          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <NavLink to="/" icon={<FaSearch className="text-sm opacity-80" />}>Properties</NavLink>
            <NavLink to="/rooms" icon={<FaHotel className="text-sm opacity-80" />}>Hotels & Rooms</NavLink>
          </div>`;

content = content.replace(desktopCenterBefore, desktopCenterAfter);

// 2. Add them to Profile Dropdown
const profileDropdownBefore = `                      <div className="px-3">
                        <button
                          onClick={handleLogout}
                          onMouseDown={(e) => e.preventDefault()} 
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold group"
                        >
                          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                          Sign Out Account
                        </button>
                      </div>`;

const profileDropdownAfter = `                      <div className="px-3 border-t border-gray-100 pt-3">
                        {userRole !== "admin" && (
                          <Link
                            to="/my-houses"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-colors font-bold mb-1"
                          >
                            <FaBuilding className="text-sm text-brand-blue/70" />
                            My Dashboard
                          </Link>
                        )}
                        {userRole === "admin" && (
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-colors font-bold mb-1"
                          >
                            <FaCheckCircle className="text-sm text-brand-blue/70" />
                            Admin Portal
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          onMouseDown={(e) => e.preventDefault()} 
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold group"
                        >
                          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                          Sign Out Account
                        </button>
                      </div>`;

content = content.replace(profileDropdownBefore, profileDropdownAfter);

// 3. Remove them from Mobile Main Menu
const mobileMainMenuToRemove = `          
          {token && userRole !== "admin" && (
             <Link
               to="/my-houses"
               onClick={() => setIsMenuOpen(false)}
               className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/my-houses') ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}\`}
             >
               <FaBuilding /> Dashboard
             </Link>
          )}

          {userRole === "admin" && (
             <Link
               to="/admin-dashboard"
               onClick={() => setIsMenuOpen(false)}
               className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors \${isActive('/admin-dashboard') ? 'bg-blue-50 text-brand-blue border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}\`}
             >
               <FaCheckCircle /> Admin Portal
             </Link>
          )}`;

content = content.replace(mobileMainMenuToRemove, '');

// 4. Add them to Mobile Profile Menu
const mobileProfileMenuBefore = `                <Link to="/add-house" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-white bg-brand-blue rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all shadow-md shadow-brand-blue/20">
                  <FaPlus /> New Listing
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
                  <FaSignOutAlt /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>`;

const mobileProfileMenuAfter = `      {/* Background Overlay - Disables Background Interactions */}
      <div 
        className={\`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-500 md:hidden \${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}
        onClick={() => setIsMenuOpen(false)}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Mobile Sidebar Navigation */}
      <div className={\`md:hidden fixed top-0 right-0 h-full w-full z-50 bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col
        \${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}\`}>
        
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
          
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all \${isActive('/') ? 'bg-blue-50 text-brand-blue border border-blue-100 shadow-sm shadow-brand-blue/5' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <LuBuilding size={18} /> <span>Residences</span>
          </Link>
          <Link
            to="/rooms"
            onClick={() => setIsMenuOpen(false)}
            className={\`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all \${isActive('/rooms') ? 'bg-blue-50 text-brand-blue border border-blue-100 shadow-sm shadow-brand-blue/5' : 'text-gray-600 hover:bg-gray-50'}\`}
          >
            <LuBed size={18} /> <span>Hotels & Stays</span>
          </Link>

          
          <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col gap-4">
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
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Link to="/add-house" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 font-bold text-white bg-brand-blue rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-brand-blue/30 scale-100 active:scale-95">
                    <FaPlus /> New Listing
                  </Link>

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
    </nav>\`;

content = content.replace(mobileProfileMenuBefore, mobileProfileMenuAfter);

fs.writeFileSync(file, content);
console.log('Done moving dashboard to profile');
