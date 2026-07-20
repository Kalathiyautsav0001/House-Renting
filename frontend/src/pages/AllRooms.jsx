import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaSearch, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt,
  FaChevronDown, FaSlidersH, FaTimes, FaBuilding,
  FaRupeeSign, FaWifi, FaTv, FaCar, FaSwimmingPool,
  FaDumbbell, FaConciergeBell, FaSnowflake, FaBed,
  FaBath, FaHotel, FaThLarge, FaMapMarkedAlt
} from "react-icons/fa";
import { LuBed, LuBath, LuMapPin, LuPhone, LuHeart } from "react-icons/lu";
import MarketplaceToggle from "../components/MarketplaceToggle";
import { MdOutlineBedroomParent } from "react-icons/md";
import HousesMapView from "../components/HousesMapView";
import BackToTop from "../components/BackToTop";

/* ── Amenity icon map ─────────────────────────────────────────────────────── */
const AMENITY_ICONS = {
  "AC":               <FaSnowflake className="text-blue-400" />,
  "WiFi":             <FaWifi className="text-blue-500" />,
  "TV":               <FaTv className="text-gray-600" />,
  "Parking":          <FaCar className="text-gray-500" />,
  "Pool":             <FaSwimmingPool className="text-cyan-500" />,
  "Gym":              <FaDumbbell className="text-orange-500" />,
  "Room Service":     <FaConciergeBell className="text-amber-500" />,
  "Restaurant":       <FaConciergeBell className="text-rose-500" />,
  "Geyser":           <FaSnowflake className="text-red-400" />,
  "Breakfast Included": <FaConciergeBell className="text-emerald-500" />,
};

/* ── Custom Dropdown ─────────────────────────────────────────────────────── */
const CustomDropdown = ({ value, onChange, options, label, icon: Icon, iconBg = "bg-blue-50", iconColor = "text-brand-blue" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const selected = options.find((o) => o.value === value) || options[0];
  const isDefault = selected.value === options[0].value;
  return (
    <div ref={ref} className={`relative ${isOpen ? "z-[100]" : "z-10"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex items-center gap-2.5 w-full text-left group focus:outline-none rounded-xl px-3 py-2.5 -mx-3 transition-colors duration-150 ${isOpen ? "bg-gray-50" : "hover:bg-gray-50/60"}`}
      >
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`text-xs ${iconColor}`} />
          </div>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5 font-poppins leading-none">{label}</span>
          <span className={`text-sm font-semibold truncate font-inter leading-tight ${isDefault ? "text-gray-500" : "text-gray-900"}`}>{selected.label}</span>
        </div>
        <FaChevronDown className={`text-[9px] text-gray-300 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-brand-blue" : "group-hover:text-gray-500"}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-[-12px] w-[calc(100%+24px)] bg-white rounded-2xl border border-gray-100 overflow-hidden z-50" style={{ boxShadow: "0 12px 40px rgba(0,0,0,.12)" }}>
          <div className={`px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 ${iconBg}`}>
            {Icon && <Icon className={`text-xs ${iconColor}`} />}
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 font-poppins">{label}</span>
          </div>
          <div className="py-1.5 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isActive = value === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-100 font-inter flex items-center justify-between gap-3 ${isActive ? `${iconBg} font-semibold border-l-[3px] ${iconColor}` : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent"}`}
                >
                  <span>{opt.label}</span>
                  {isActive && <svg className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ActiveFilter = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-100">
    {label}
    <FaTimes className="cursor-pointer hover:text-red-500 transition-colors text-[10px]" onClick={onClear} />
  </span>
);

/* ── Room type badge colors ──────────────────────────────────────────────── */
const ROOM_TYPE_COLORS = {
  single:    "bg-blue-100 text-blue-700",
  double:    "bg-purple-100 text-purple-700",
  suite:     "bg-amber-100 text-amber-700",
  deluxe:    "bg-rose-100 text-rose-700",
  dormitory: "bg-gray-100 text-gray-600",
  standard:  "bg-teal-100 text-teal-700",
  executive: "bg-indigo-100 text-indigo-700",
  family:    "bg-green-100 text-green-700",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function AllRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rooms.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                        r.hotelName.toLowerCase().includes(search.toLowerCase()) ||
                        r.location.toLowerCase().includes(search.toLowerCase());
    const matchType  = roomTypeFilter === "all" || r.roomType === roomTypeFilter;
    const matchPrice = maxPrice === "" || r.pricePerNight <= Number(maxPrice);
    const isPublic   = r.isPublic !== false && r.isPublic !== "false";
    return matchSearch && matchType && matchPrice && isPublic;
  });

  const hasFilters = roomTypeFilter !== "all" || maxPrice !== "" || search !== "";
  const clearAll = () => { setSearch(""); setRoomTypeFilter("all"); setMaxPrice(""); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-soft">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-400 font-medium font-inter">Loading hotel rooms...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-soft font-inter">

      {/* ═══ HERO ═══ */}
      <div className="relative bg-gradient-to-br from-[#1a0533] via-[#2d1052] to-[#1a0533] overflow-hidden">
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative pt-28 sm:pt-32 pb-24 sm:pb-28 px-4 text-center">
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: "50ms" }}>
            <MarketplaceToggle variant="hero" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
            Hotels & Rooms
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-black text-white tracking-tight mb-4 leading-tight animate-fadeIn">
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Room</span>
          </h1>
          <p className="text-purple-200/60 text-base sm:text-lg max-w-2xl mx-auto font-medium animate-fadeIn mb-8" style={{ animationDelay: "100ms" }}>
            Browse premium hotel rooms with transparent pricing — no hidden fees
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
              className="group flex items-center gap-3 px-8 py-4 bg-white text-purple-700 hover:bg-purple-600 hover:text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-1 active:scale-95"
            >
              <FaHotel className="group-hover:rotate-12 transition-transform" />
              List Your Room
            </button>
            <button 
              onClick={() => document.getElementById('marketplace-search').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/10"
            >
              <FaSearch className="text-xs" />
              Explore Rooms
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SEARCH BAR ═══ */}
      <div id="marketplace-search" className="relative z-40 px-4 -mt-12 sm:-mt-14 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-gray-100/60 p-4 sm:p-5 animate-fadeIn relative z-40" style={{ animationDelay: "200ms" }}>
            {/* Search input */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <FaSearch className="text-purple-500 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search by room name, hotel or location..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base sm:text-lg font-medium border-none outline-none p-0 focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><FaTimes /></button>}
            </div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 pt-3 relative z-50">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-0">
                <div className="sm:pr-2">
                  <CustomDropdown
                    label="Room Type" value={roomTypeFilter} onChange={setRoomTypeFilter}
                    icon={MdOutlineBedroomParent} iconBg="bg-purple-50" iconColor="text-purple-500"
                    options={[
                      { value: "all", label: "All Room Types" },
                      { value: "single", label: "🛏️ Single Room" },
                      { value: "double", label: "🛏️🛏️ Double Room" },
                      { value: "suite", label: "👑 Suite" },
                      { value: "deluxe", label: "✨ Deluxe" },
                      { value: "standard", label: "🏨 Standard" },
                      { value: "executive", label: "💼 Executive" },
                      { value: "family", label: "👨‍👩‍👧 Family" },
                      { value: "dormitory", label: "🏕️ Dormitory" },
                    ]}
                  />
                </div>
                <div className="sm:pl-2 sm:border-l sm:border-gray-100">
                  <CustomDropdown
                    label="Max Price / Night" value={maxPrice} onChange={setMaxPrice}
                    icon={FaRupeeSign} iconBg="bg-amber-50" iconColor="text-amber-500"
                    options={[
                      { value: "", label: "Any Price" },
                      { value: "500", label: "Up to ₹500" },
                      { value: "1000", label: "Up to ₹1,000" },
                      { value: "2000", label: "Up to ₹2,000" },
                      { value: "5000", label: "Up to ₹5,000" },
                      { value: "10000", label: "Up to ₹10,000" },
                      { value: "25000", label: "Up to ₹25,000" },
                    ]}
                  />
                </div>
              </div>
              <div className="sm:ml-3 sm:pl-3 sm:border-l sm:border-gray-100 flex-shrink-0">
                <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-poppins font-bold text-sm rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group">
                  <FaSearch className="text-xs group-hover:scale-110 transition-transform" />
                  Search
                </button>
              </div>
            </div>
            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-50 px-1 animate-fadeIn">
                <FaSlidersH className="text-gray-400 text-[10px]" />
                {search && <ActiveFilter label={`"${search}"`} onClear={() => setSearch("")} />}
                {roomTypeFilter !== "all" && <ActiveFilter label={roomTypeFilter} onClear={() => setRoomTypeFilter("all")} />}
                {maxPrice !== "" && <ActiveFilter label={`Up to ₹${Number(maxPrice).toLocaleString()}/night`} onClear={() => setMaxPrice("")} />}
                <button onClick={clearAll} className="text-[10px] text-gray-400 hover:text-red-500 font-bold ml-1 transition-colors underline underline-offset-2 uppercase tracking-tight">Clear all</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <div>
            <h2 className="text-2xl sm:text-3xl font-poppins text-text-dark font-extrabold tracking-tight flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaHotel className="text-purple-600 text-base" />
              </div>
              Available Rooms
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Showing <span className="text-purple-600 font-bold">{filtered.length}</span> room{filtered.length !== 1 && "s"}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaThLarge size={12} /> Grid View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                viewMode === "map"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaMapMarkedAlt size={12} /> Map View
            </button>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="animate-fadeIn">
            <HousesMapView rooms={filtered} show="rooms" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 sm:py-28 text-center bg-white rounded-2xl shadow-soft border border-gray-100 animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-5 bg-purple-50 rounded-2xl flex items-center justify-center">
              <FaHotel className="text-3xl text-purple-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-poppins text-text-dark mb-2 font-bold">No rooms found</h3>
            <p className="text-gray-400 text-base max-w-md mx-auto mb-6">Try adjusting your search filters.</p>
            <button onClick={clearAll} className="bg-purple-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-purple-700 transition-colors">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filtered.map((room, index) => {
              const displayMobile = room.mobileNumber || (room.owner && room.owner.mobile) || "";
              const displayWhatsApp = room.whatsAppNumber || displayMobile || "";
              const amenities = Array.isArray(room.amenities) ? room.amenities : [];
              return (
                <div
                  key={room._id}
                  className="bg-white rounded-[32px] overflow-hidden transition-all duration-500 shadow-soft hover:shadow-2xl hover:-translate-y-2 border border-gray-100/50 group animate-fadeIn flex flex-col"
                  style={{ animationDelay: `${300 + index * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {room.images && room.images.length > 1 ? (
                      <Slider dots={false} infinite speed={600} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={4000} pauseOnHover arrows={false} className="h-full w-full">
                        {room.images.map((img, i) => (
                          <div key={i} className={`aspect-video outline-none ${room.status === "available" ? "cursor-pointer" : "cursor-default"}`} onClick={() => room.status === "available" && navigate(`/room/${room._id}`)}>
                            <img src={`http://localhost:5000${img}`} className="object-cover w-full h-full" alt={`${room.title}-${i+1}`} />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className={`aspect-video ${room.status === "available" ? "cursor-pointer" : "cursor-default"}`} onClick={() => room.status === "available" && navigate(`/room/${room._id}`)}>
                        <img
                          src={room.images?.[0] ? `http://localhost:5000${room.images[0]}` : "https://via.placeholder.com/400x300?text=Hotel+Room"}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
                          alt={room.title}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-20">
                      <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md border border-white/20 bg-purple-600/90 text-white flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                        {room.roomType || "Room"}
                      </div>
                    </div>

                    {/* Status overlay */}
                    {room.status && room.status !== "available" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                        <div className="px-4 py-1.5 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-xl transform -rotate-12 shadow-2xl">
                          <span className="text-white text-base font-black uppercase tracking-wider drop-shadow-md">
                            {room.status === "booked" ? "ROOM BOOKED" : "ROOM CLOSED"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Heart */}
                    <button className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300">
                      <LuHeart className="text-sm" />
                    </button>

                    {/* Price */}
                    <div className="absolute bottom-3 right-3 pointer-events-none translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-baseline gap-1 border border-white/50">
                        <span className="font-poppins font-black text-lg text-purple-600">₹{room.pricePerNight?.toLocaleString()}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">/night</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                            <FaHotel className="text-[10px] text-purple-500" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                            {room.hotelName}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wide ${ROOM_TYPE_COLORS[room.roomType] || "bg-gray-100 text-gray-600"}`}>
                          {room.roomType}
                        </span>
                      </div>
                      <Link to={`/room/${room._id}`}>
                        <h3 className="text-lg font-poppins font-extrabold text-text-dark group-hover:text-purple-600 transition-colors line-clamp-1 leading-tight mb-1.5">
                          {room.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-gray-400 text-[12px] font-medium">
                        <LuMapPin className="mr-1.5 text-purple-500 text-[13px] flex-shrink-0" />
                        <span className="truncate">{room.location}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 bg-gray-50/50 rounded-xl p-2 mb-3 border border-gray-100/50">
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200">
                        <LuBed className="text-purple-500 text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">{room.bedrooms || 1} Max Bed</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200 border-x border-gray-100">
                        <LuBath className="text-purple-500 text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">{room.bathrooms || 1} Bath</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-1 rounded-lg hover:bg-white transition-colors duration-200">
                        <FaBuilding className="text-purple-500 text-sm mb-0.5" />
                        <span className="text-[10px] font-bold text-text-dark">Floor {room.floor ?? "G"}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {amenities.slice(0, 5).map((a) => (
                          <span key={a} className="flex items-center gap-1 text-[9px] font-bold bg-gray-50 border border-gray-100 rounded-lg px-2 py-0.5 text-gray-600">
                            {AMENITY_ICONS[a] || <FaConciergeBell className="text-gray-400" />}
                            {a}
                          </span>
                        ))}
                        {amenities.length > 5 && (
                          <span className="text-[9px] font-bold bg-purple-50 border border-purple-100 rounded-lg px-2 py-0.5 text-purple-600">
                            +{amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto flex gap-2">
                      <a
                        href={room.status === "available" ? `tel:${displayMobile}` : "#"}
                        onClick={(e) => room.status !== "available" && e.preventDefault()}
                        className={`flex items-center justify-center flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95 group/btn ${room.status === "available" ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"}`}
                      >
                        <LuPhone className="mr-2 text-xs group-hover/btn:rotate-12 transition-transform" />
                        {room.status === "available" ? "Call" : "Unavailable"}
                      </a>
                      <a
                        href={room.status === "available" ? `https://wa.me/${displayWhatsApp.replace(/\s+/g, "")}` : "#"}
                        onClick={(e) => room.status !== "available" && e.preventDefault()}
                        target={room.status === "available" ? "_blank" : undefined}
                        rel={room.status === "available" ? "noopener noreferrer" : undefined}
                        className={`flex items-center justify-center flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95 group/btn ${room.status === "available" ? "bg-[#25D366] text-white hover:bg-[#20ba59]" : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"}`}
                      >
                        <FaWhatsapp className="mr-2 text-sm group-hover/btn:scale-110 transition-transform" />
                        {room.status === "available" ? "WhatsApp" : "Booked"}
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
