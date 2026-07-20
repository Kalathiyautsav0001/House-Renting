const fs = require('fs');
const file = 'c:/Users/VISHAL/Desktop/utsav/rentingweb/house-rent-sell/frontend/src/pages/MyHouses.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add activeTab check for the Houses empty state
content = content.replace(
  '{!isLoading && houses.length === 0 && (',
  '{!isLoading && activeTab === "houses" && houses.length === 0 && ('
);

// 2. Add activeTab check for the Houses card grid
content = content.replace(
  '{!isLoading && houses.length > 0 && (',
  '{!isLoading && activeTab === "houses" && houses.length > 0 && ('
);

// 3. Inject the Hotels Grid UI
const hotelsGrid = `
        {/* Empty state - Hotels */}
        {!isLoading && activeTab === "hotels" && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-gray-100 mt-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-8 shadow-inner">
              <FaBuilding className="text-purple-600 text-5xl" />
            </div>
            <h2 className="text-3xl font-poppins font-black text-gray-900 mb-3">No hotel rooms yet</h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm">
              You haven't listed any hotel rooms. Try adding one!
            </p>
          </div>
        )}

        {/* Cards grid - Hotels */}
        {!isLoading && activeTab === "hotels" && rooms.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {rooms.map((r, idx) => (
              <div
                key={r._id}
                className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: \`\${idx * 60}ms\` }}
              >
                {/*  Image/Carousel  */}
                <div className="relative flex-shrink-0">
                  {r.images && r.images.length > 0 ? (
                    <div className="h-52 overflow-hidden">
                      <Slider {...carouselSettings}>
                        {r.images.map((img, i) => (
                          <div key={i} className="h-52">
                            <img
                              src={\`http://localhost:5000\${img}\`}
                              alt={r.title}
                              className="w-full h-52 object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2">
                      <FaBuilding className="text-slate-300 text-5xl" />
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Photo</span>
                    </div>
                  )}

                  {/* Price badge  top left */}
                  <div className="absolute top-3 left-3 bg-brand-blue/95 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                    ₹{Number(r.pricePerNight).toLocaleString()}
                    <span className="opacity-60 font-normal text-[10px]">/night</span>
                  </div>

                  {/* Live / Hidden badge  top right */}
                  <div
                    className={\`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl shadow-lg \${
                      r.isPublic !== false
                        ? "bg-emerald-500/95 text-white"
                        : "bg-slate-700/90 text-white"
                    }\`}
                  >
                    {r.isPublic !== false ? (
                      <><FaEye className="text-[9px]" /> Live</>
                    ) : (
                      <><FaEyeSlash className="text-[9px]" /> Hidden</>
                    )}
                  </div>

                  {/* Room Status pill  bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={\`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-sm \${
                        r.status === "available"
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700"
                      }\`}
                    >
                      {r.status || "Available"}
                    </span>
                  </div>
                </div>

                {/*  Card Body  */}
                <div className="flex flex-col flex-grow p-6">

                  {/* Room type chip + ID */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg">
                      <FaBuilding className="text-[9px]" /> {r.roomType || "Room"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold ml-auto">
                      #{r._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-poppins font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-purple-600 transition-colors duration-200">
                    {r.title}
                  </h3>
                  
                  {/* Hotel Name */}
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1 font-bold">
                    <span className="truncate">{r.hotelName}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                    <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{r.location}</span>
                  </div>

                  {/* Specs row */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: <FaBed />,           val: r.bedrooms  || 1,   label: "Beds"  },
                      { icon: <FaBath />,          val: r.bathrooms || 1,   label: "Baths" },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col items-center py-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-300 transition-colors duration-200"
                      >
                        <span className="text-purple-500 text-sm mb-1">{spec.icon}</span>
                        <span className="text-[12px] font-black text-gray-800">{spec.val}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {r.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{r.description}</p>
                  )}

                  {/*  Action Buttons  */}
                  <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                    {r.adminHidden ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-red-50 text-red-600 border border-red-200 text-center px-4 cursor-not-allowed">
                        <FaExclamationTriangle className="text-lg flex-shrink-0" />
                        <span>Hidden by Super Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleRoomVisibility(r._id, r.isPublic !== false)}
                          className={\`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl transition-all duration-300 active:scale-95 \${
                            r.isPublic !== false
                              ? "bg-slate-50 text-slate-500 hover:bg-slate-700 hover:text-white border border-slate-200"
                              : "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white border border-purple-200"
                          }\`}
                        >
                          {r.isPublic !== false ? (
                            <><FaEyeSlash className="text-sm" /> Hide from Marketplace</>
                          ) : (
                            <><FaEye className="text-sm" /> Bring Back to Market</>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Delete only for Rooms since editing is not explicitly supported right now */}
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => deleteRoom(r._id)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-2xl transition-all duration-300 active:scale-95"
                      >
                        <FaTrash className="text-sm" /> Delete Room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`;

content = content.replace(/(\s*)\)\}(\s*<\/div>\s*<\/div>\s*\);\s*\})/, '$1' + ')}\n' + hotelsGrid);

fs.writeFileSync(file, content);
console.log('Patched Grid successfully.');
