import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  FaBed, FaBath, FaRulerCombined, FaSearch, 
  FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaHome, FaChevronDown,
  FaSlidersH, FaTimes, FaTag, FaBuilding, FaRupeeSign,
  FaThLarge, FaMapMarkedAlt
} from "react-icons/fa";
import HousesMapView from "../components/HousesMapView";
import { 
  LuBed, LuBath, LuMaximize, LuMapPin, LuPhone, LuHeart
} from "react-icons/lu";
import MarketplaceToggle from "../components/MarketplaceToggle";
import BackToTop from "../components/BackToTop";

/* ─── Custom Dropdown ─── */
const CustomDropdown = ({ value, onChange, options, label, icon: Icon, iconBg = "bg-blue-50", iconColor = "text-brand-blue" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];
  const isDefault = selected.value === options[0].value;

  return (
    <div ref={ref} className={`relative ${isOpen ? 'z-[100]' : 'z-10'}`}>
      {/* trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center gap-2.5 w-full text-left group focus:outline-none rounded-xl px-3 py-2.5 -mx-3 transition-colors duration-150 ${
          isOpen ? 'bg-gray-50' : 'hover:bg-gray-50/60'
        }`}
      >
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`text-xs ${iconColor}`} />
          </div>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5 font-poppins leading-none">
            {label}
          </span>
          <span className={`text-sm font-semibold truncate font-inter leading-tight ${
            isDefault ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {selected.label}
          </span>
        </div>
        <FaChevronDown
          className={`text-[9px] text-gray-300 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-brand-blue' : 'group-hover:text-gray-500'
          }`}
        />
      </button>

      {/* panel */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+6px)] left-[-12px] w-[calc(100%+24px)] bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.05)' }}
        >
          {/* Panel header */}
          <div className={`px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 ${iconBg}`}>
            {Icon && <Icon className={`text-xs ${iconColor}`} />}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 font-poppins">{label}</span>
          </div>
          {/* Options */}
          <div className="py-1.5 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {options.map((opt) => {
              const isActive = value === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-100 font-inter flex items-center justify-between gap-3
                    ${isActive
                      ? `${iconBg} font-semibold border-l-[3px]`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent'
                    }`}
                  style={isActive ? { borderLeftColor: 'currentColor' } : {}}
                >
                  <span className={isActive ? iconColor.replace('text-', 'text-') : ''}>{opt.label}</span>
                  {isActive && (
                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Active filter pill ─── */
const ActiveFilter = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
    {label}
    <FaTimes className="cursor-pointer hover:text-red-500 transition-colors text-[10px]" onClick={onClear} />
  </span>
);

/* ─── Main ─── */
export default function AllHouses() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [houseTypeFilter, setHouseTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  useEffect(() => { fetchHouses(); }, []);

  const fetchHouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/houses");
      setHouses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredHouses = houses.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) ||
                          h.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || h.type === typeFilter;
    const matchesHouseType = houseTypeFilter === "all" || h.houseType === houseTypeFilter;
    const matchesPrice = maxPrice === "" || h.price <= Number(maxPrice);
    const isPubliclyAvailable = h.isPublic !== false && h.isPublic !== "false";
    return matchesSearch && matchesType && matchesHouseType && matchesPrice && isPubliclyAvailable;
  });

  const hasActiveFilters = typeFilter !== "all" || houseTypeFilter !== "all" || maxPrice !== "" || search !== "";
  const clearAll = () => { setSearch(""); setTypeFilter("all"); setHouseTypeFilter("all"); setMaxPrice(""); };

  /* loading */
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-soft">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>
        <span className="text-sm text-gray-400 font-medium font-inter">Loading properties...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-soft font-inter">

      {/* ═══ HERO ═══ */}
      <div className="relative bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] overflow-hidden">
        {/* deco */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative pt-28 sm:pt-32 pb-24 sm:pb-28 px-4 text-center">
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: "50ms" }}>
            <MarketplaceToggle variant="hero" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-black text-white tracking-tight mb-4 leading-tight animate-fadeIn">
            Find Your Dream Home
          </h1>
          <p className="text-blue-200/60 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium animate-fadeIn mb-10" style={{ animationDelay: "100ms" }}>
            Explore thousands of premium properties for rent and sale
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: "150ms" }}>
            <button 
              onClick={() => {
                if (localStorage.getItem("token")) {
                  navigate("/add-house");
                } else {
                  navigate("/login");
                }
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-brand-blue hover:bg-brand-blue hover:text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 active:scale-95"
            >
              <FaHome className="group-hover:rotate-12 transition-transform" />
              Post New Listing
            </button>
            <button 
              onClick={() => document.getElementById('marketplace-search').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/10"
            >
              <FaSearch className="text-xs" />
              Explore Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SEARCH BAR — outside hero, overlapping via negative margin ═══ */}
      <div id="marketplace-search" className="relative z-40 px-4 -mt-12 sm:-mt-14 mb-8">
        <div className="max-w-5xl mx-auto">
          <div 
            className="bg-white rounded-2xl sm:rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-gray-100/60 p-4 sm:p-5 animate-fadeIn relative z-40"
            style={{ animationDelay: "200ms" }}
          >
            {/* Row 1: Search input */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FaSearch className="text-brand-blue text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base sm:text-lg font-medium border-none outline-none p-0 focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Row 2: Filters + Search Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 pt-3 relative z-50">
              
              {/* Filters grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0">
                <div className="sm:pr-2">
                  <CustomDropdown
                    label="Status"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    icon={FaTag}
                    iconBg="bg-blue-50"
                    iconColor="text-brand-blue"
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "rent", label: "For Rent" },
                      { value: "sale", label: "For Sale" },
                    ]}
                  />
                </div>
                <div className="sm:px-2 sm:border-l sm:border-gray-100">
                  <CustomDropdown
                    label="Property"
                    value={houseTypeFilter}
                    onChange={setHouseTypeFilter}
                    icon={FaBuilding}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-500"
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "apartment", label: "Apartment" },
                      { value: "villa", label: "Villa" },
                      { value: "bungalow", label: "Bungalow" },
                      { value: "duplex", label: "Duplex" },
                      { value: "studio", label: "Studio" },
                      { value: "penthouse", label: "Penthouse" },
                      { value: "cottage", label: "Cottage" },
                      { value: "townhouse", label: "Townhouse" },
                      { value: "house", label: "House" },
                    ]}
                  />
                </div>
                <div className="sm:pl-2 sm:border-l sm:border-gray-100">
                  <CustomDropdown
                    label="Max Price"
                    value={maxPrice}
                    onChange={setMaxPrice}
                    icon={FaRupeeSign}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-500"
                    options={[
                      { value: "", label: "Any Price" },
                      { value: "2000", label: "Up to ₹2,000" },
                      { value: "5000", label: "Up to ₹5,000" },
                      { value: "15000", label: "Up to ₹15,000" },
                      { value: "50000", label: "Up to ₹50,000" },
                      { value: "100000", label: "Up to ₹1 Lakh" },
                      { value: "500000", label: "Up to ₹5 Lakh" },
                      { value: "1500000", label: "Up to ₹15 Lakh" },
                      { value: "5000000", label: "Up to ₹50 Lakh" },
                    ]}
                  />
                </div>
              </div>

              {/* Search CTA */}
              <div className="sm:ml-3 sm:pl-3 sm:border-l sm:border-gray-100 flex-shrink-0">
                <button
                  className="w-full sm:w-auto bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-poppins font-bold text-sm rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  onClick={() => {}}
                >
                  <FaSearch className="text-xs group-hover:scale-110 transition-transform" />
                  Search
                </button>
              </div>
            </div>

            {/* Active filters — Inside the white box for stable stacking */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-50 px-1 animate-fadeIn relative z-0">
                <FaSlidersH className="text-gray-400 text-[10px]" />
                {search && <ActiveFilter label={`"${search}"`} onClear={() => setSearch("")} />}
                {typeFilter !== "all" && <ActiveFilter label={typeFilter === "rent" ? "For Rent" : "For Sale"} onClear={() => setTypeFilter("all")} />}
                {houseTypeFilter !== "all" && <ActiveFilter label={houseTypeFilter} onClear={() => setHouseTypeFilter("all")} />}
                {maxPrice !== "" && <ActiveFilter label={`Up to ₹${Number(maxPrice).toLocaleString()}`} onClear={() => setMaxPrice("")} />}
                <button onClick={clearAll} className="text-[10px] text-gray-400 hover:text-red-500 font-bold ml-1 transition-colors underline underline-offset-2 uppercase tracking-tight">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pb-16">

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-poppins text-text-dark font-extrabold tracking-tight">
              Available Properties
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Showing <span className="text-brand-blue font-bold">{filteredHouses.length}</span> result{filteredHouses.length !== 1 && "s"}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaThLarge size={12} /> Grid View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                viewMode === "map"
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaMapMarkedAlt size={12} /> Map View
            </button>
          </div>
        </div>

        {/* content toggle between grid and map */}
        {viewMode === "map" ? (
          <div className="animate-fadeIn">
            <HousesMapView houses={filteredHouses} show="houses" />
          </div>
        ) : filteredHouses.length === 0 ? (
          <div className="py-20 sm:py-28 text-center bg-white rounded-2xl shadow-soft border border-gray-100 animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-5 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FaHome className="text-3xl text-brand-blue opacity-50" />
            </div>
            <h3 className="text-2xl font-poppins text-text-dark mb-2 font-bold">No properties found</h3>
            <p className="text-gray-400 text-base max-w-md mx-auto mb-6">
              Try adjusting your search filters to find what you're looking for.
            </p>
            <button onClick={clearAll} className="bg-brand-blue text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredHouses.map((house, index) => {
              const displayMobile = house.mobileNumber || (house.owner && house.owner.mobile) || "N/A";
              const displayWhatsApp = house.whatsAppNumber || (house.owner && house.owner.mobile) || "N/A";
              return (
                <div
                  key={house._id}
                  className="bg-white rounded-[32px] overflow-hidden transition-all duration-500 shadow-soft hover:shadow-2xl hover:-translate-y-2 border border-gray-100/50 group animate-fadeIn flex flex-col"
                  style={{ animationDelay: `${300 + index * 80}ms` }}
                >
                  {/* image container */}
                  <div className="relative aspect-video overflow-hidden">
                    {house.images && house.images.length > 1 ? (
                      <Slider
                        dots infinite speed={600} slidesToShow={1} slidesToScroll={1}
                        autoplay autoplaySpeed={4000} pauseOnHover arrows={false}
                        className="h-full w-full"
                      >
                        {house.images.map((img, i) => (
                          <div key={i} className={`aspect-video outline-none ${house.status === 'available' ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => house.status === 'available' && navigate(`/house/${house._id}`)}>
                            <img src={`http://localhost:5000${img}`} className="object-cover w-full h-full" alt={`${house.title} - ${i + 1}`} />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className={`aspect-video ${house.status === 'available' ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => house.status === 'available' && navigate(`/house/${house._id}`)}>
                        <img
                          src={house.images?.[0] ? `http://localhost:5000${house.images[0]}` : "https://via.placeholder.com/400x300"}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
                          alt={house.title}
                        />
                      </div>
                    )}

                    {/* soft gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Availability Overlay & Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-20">
                        <div className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md border border-white/20 flex items-center gap-1.5 ${
                          house.type === "rent"
                            ? "bg-brand-blue/90 text-white"
                            : "bg-amber-400/90 text-gray-900"
                        }`}>
                          <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                          For {house.type}
                        </div>
                      </div>

                      {/* Condition badge — top right */}
                      <div className="absolute top-3 right-14 flex flex-col gap-1.5 pointer-events-none z-20">
                        {house.condition && (
                          <div className="px-2 py-0.5 text-[9px] font-black text-white bg-black/60 backdrop-blur-md rounded-lg shadow-sm border border-white/20 flex items-center gap-1">
                            <span>
                              {house.condition === "brand_new" && "💎"}
                              {house.condition === "newly_renovated" && "✨"}
                              {house.condition === "well_maintained" && "✅"}
                              {house.condition === "good" && "👍"}
                              {house.condition === "fair" && "⚠️"}
                              {house.condition === "needs_repair" && "🛠️"}
                            </span>
                            <span className="uppercase tracking-tighter">
                              {house.condition.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {house.status && house.status !== 'available' && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                           <div className="px-4 py-1.5 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-xl transform -rotate-12 shadow-2xl">
                              <span className="text-white text-base font-black uppercase tracking-wider drop-shadow-md">
                                {house.status === 'rented' ? 'HOUSE RENTED' : 'HOUSE SOLD'}
                              </span>
                           </div>
                        </div>
                      )}

                    {/* floating heart / favorite */}
                    <button className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-brand-blue transition-all duration-300">
                      <LuHeart className="text-sm" />
                    </button>

                    {/* price glass pill */}
                    <div className="absolute bottom-3 right-3 pointer-events-none translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-baseline gap-1 border border-white/50">
                        <span className="font-poppins font-black text-lg text-brand-green">
                          ₹{house.price?.toLocaleString()}
                        </span>
                        {house.type === "rent" && (
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">/mo</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* content wrapper */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                            <FaBuilding className="text-[10px] text-brand-blue" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                            {house.houseType || 'Modern House'}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                          #{house._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      
                      <Link to={`/house/${house._id}`}>
                        <h3 className="text-lg font-poppins font-extrabold text-text-dark group-hover:text-brand-blue transition-colors line-clamp-1 leading-tight mb-1.5">
                          {house.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center text-gray-400 text-[12px] font-medium">
                        <LuMapPin className="mr-1.5 text-brand-blue text-[13px] flex-shrink-0" />
                        <span className="truncate">{house.location}</span>
                      </div>
                    </div>

                    {/* professional specs bar */}
                    <div className="grid grid-cols-3 gap-1 bg-gray-50/50 rounded-xl p-2 mb-4 border border-gray-100/50">
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200">
                        <LuBed className="text-brand-blue text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">{house.bedrooms || 1} Bed</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200 border-x border-gray-100">
                        <LuBath className="text-brand-blue text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">{house.bathrooms || 1} Bath</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200">
                        <LuMaximize className="text-brand-blue text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">{house.area || house.squareFeet || 1200} ft²</span>
                      </div>
                    </div>

                    {/* CTA row */}
                    <div className="mt-auto flex gap-2">
                      <a
                        href={house.status === 'available' ? `tel:${displayMobile}` : '#'}
                        onClick={(e) => house.status !== 'available' && e.preventDefault()}
                        className={`flex items-center justify-center flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95 group/btn ${
                          house.status === 'available' 
                          ? "bg-brand-blue text-white hover:bg-blue-700" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                        }`}
                      >
                        <LuPhone className="mr-2 text-xs group-hover/btn:rotate-12 transition-transform" /> 
                        {house.status === 'available' ? 'Call' : 'Closed'}
                      </a>
                      <a
                        href={house.status === 'available' ? `https://wa.me/${displayWhatsApp.replace(/\s+/g, "")}` : '#'}
                        onClick={(e) => house.status !== 'available' && e.preventDefault()}
                        target={house.status === 'available' ? "_blank" : undefined}
                        rel={house.status === 'available' ? "noopener noreferrer" : undefined}
                        className={`flex items-center justify-center flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95 group/btn ${
                          house.status === 'available' 
                          ? "bg-[#25D366] text-white hover:bg-[#20ba59]" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                        }`}
                      >
                        <FaWhatsapp className="mr-2 text-sm group-hover/btn:scale-110 transition-transform" /> 
                        {house.status === 'available' ? 'WhatsApp' : 'Taken'}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BackToTop />
    </div>
  );
}
