import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import Slider from "react-slick";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaHome,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaParking,
  FaChair,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";

// ─── ADD-HOUSE form logic preserved below as reference (not used on this page) ─
// This page is READ-ONLY for managing existing listings.
// To ADD a new property → navigate to /add-house
// To EDIT a property   → navigate to /edit-house/:id
//
// const handleChange = (e) => { ... };
// const handleSubmit = async (e) => { ... };
// const resetForm = () => { ... };
// const [showForm, setShowForm] = useState(false);
// const [form, setForm] = useState({ ... });
// ───────────────────────
export default function MyHouses() {
  const navigate = useNavigate();
  const [houses, setHouses]     = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [activeTab, setActiveTab] = useState("houses"); // "houses" | "hotels" | "business"
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch user's data ──────────────────────────────────────────────────────
  useEffect(() => { 
    fetchHouses(); 
    fetchRooms();
    fetchCommercials();
  }, []);

  const fetchHouses = async () => {
    try {
      if (activeTab === "houses") setIsLoading(true);
      const res = await API.get("/houses/my-houses");
      setHouses(res.data);
    } catch (err) {
      console.error("Error fetching houses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      if (activeTab === "hotels") setIsLoading(true);
      const res = await API.get("/rooms/my-rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommercials = async () => {
    try {
      if (activeTab === "business") setIsLoading(true);
      const res = await API.get("/commercial/my-commercial");
      setCommercials(res.data);
    } catch (err) {
      console.error("Error fetching commercial listings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchHouses();
    fetchRooms();
    fetchCommercials();
  };

  // ── DELETE logic ───────────────────────────────────────────────────────────
  const deleteHouse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await API.delete(`/houses/${id}`);
      setHouses((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property");
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel room?")) return;
    try {
      await API.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Failed to delete room");
    }
  };

  const deleteCommercial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business listing?")) return;
    try {
      await API.delete(`/commercial/${id}`);
      setCommercials((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting commercial listing:", err);
      alert("Failed to delete listing");
    }
  };

  const editHouse = (house) => {
    navigate(`/edit-house/${house._id}`);
  };

  const editRoom = (room) => {
    navigate(`/edit-room/${room._id}`);
  };

  const editCommercial = (listing) => {
    navigate(`/edit-commercial/${listing._id}`);
  };

  // ── Visibility Toggle ──────────────────────────────────────────────────────
  const toggleHouseVisibility = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("isPublic", !currentStatus ? "true" : "false");
      const res = await API.put(`/houses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHouses((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error("Error toggling house visibility:", err);
    }
  };

  const toggleRoomVisibility = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("isPublic", !currentStatus ? "true" : "false");
      const res = await API.put(`/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRooms((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error("Error toggling room visibility:", err);
    }
  };

  const toggleCommercialVisibility = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("isPublic", !currentStatus ? "true" : "false");
      const res = await API.put(`/commercial/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCommercials((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error("Error toggling commercial visibility:", err);
    }
  };

  // ── Status Updates (Sold/Rented for House, etc) ──────────────────────────
  const updateHouseStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(`/houses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHouses((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error("Error updating house status:", err);
    }
  };

  const updateRoomStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(`/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRooms((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error("Error updating room status:", err);
    }
  };

  const updateCommercialStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(`/commercial/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCommercials((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (err) {
      console.error("Error updating commercial status:", err);
    }
  };

  // ── Carousel settings ──────────────────────────────────────────────────────
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  // ── Computed stats (Houses) ────────────────────────────────────────────────
  const houseStats = {
    total: houses.length,
    active: houses.filter(h => h.isPublic !== false).length,
    hidden: houses.filter(h => h.isPublic === false).length,
  };

  // ── Computed stats (Rooms) ─────────────────────────────────────────────────
  const roomStats = {
    total: rooms.length,
    active: rooms.filter(r => r.isPublic !== false).length,
    hidden: rooms.filter(r => r.isPublic === false).length,
  };

  // ── Computed stats (Commercial) ───────────────────────────────────────────
  const commercialStats = {
    total: commercials.length,
    active: commercials.filter(c => c.isPublic !== false).length,
    hidden: commercials.filter(c => c.isPublic === false).length,
  };

  const totalActive = activeTab === 'houses' ? houseStats.active : activeTab === 'hotels' ? roomStats.active : commercialStats.active;
  const totalHidden = activeTab === 'houses' ? houseStats.hidden : activeTab === 'hotels' ? roomStats.hidden : commercialStats.hidden;
  const totalRent = activeTab === 'houses' ? houses.filter(h => h.type === 'rent').length : activeTab === 'hotels' ? rooms.filter(r => r.status === 'available').length : commercials.filter(c => c.type === 'rent').length;
  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter">

      {/* ════════════════════════════════════════════════════════
          DARK HERO HEADER
      ════════════════════════════════════════════════════════ */}
      <div
        className="relative bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* decorative blobs */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          {/* Title row */}
          {/* Refined Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Management Dashboard
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-black text-white tracking-tight mb-3">
                My Properties
              </h1>
              <p className="text-blue-200/60 font-medium text-base sm:text-lg max-w-xl">
                Comprehensive overview of your listings. Manage, monitor, and optimize your portfolio performance.
              </p>
            </div>

            {/* ── Compact Premium Control Center ────────────────────────── */}
            <div className="w-full lg:w-[320px] lg:mt-0 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl relative group overflow-hidden">
                {/* 1. Compact Property Type Segmented Toggle */}
                <div className="relative z-10 bg-black/20 p-1 rounded-xl flex mb-4 border border-white/5">
                  <div 
                    className={`absolute inset-y-1 left-1 w-[calc(33.33%-4.5px)] bg-brand-blue rounded-lg shadow-lg shadow-brand-blue/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      activeTab === 'hotels' ? 'translate-x-[calc(100%+4.5px)]' : 
                      activeTab === 'business' ? 'translate-x-[calc(200%+4.5px)]' : 
                      'translate-x-0'
                    }`}
                  />
                  <button 
                    onClick={() => setActiveTab('houses')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'houses' ? 'text-white' : 'text-blue-200/50 hover:text-white'}`}
                  >
                    Residences
                  </button>
                  <button 
                    onClick={() => setActiveTab('hotels')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'hotels' ? 'text-white' : 'text-blue-200/50 hover:text-white'}`}
                  >
                    Hotels
                  </button>
                  <button 
                    onClick={() => setActiveTab('business')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'business' ? 'text-white' : 'text-blue-200/50 hover:text-white'}`}
                  >
                    Business
                  </button>
                </div>

                {/* 2. Compact Actions */}
                <div className="relative z-10 flex gap-3">
                  <button
                    onClick={refreshData}
                    className="w-11 h-11 flex-shrink-0 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 group/sync"
                  >
                    <FaSync className={`text-sm transition-transform duration-500 ${isLoading ? "animate-spin" : "group-hover/sync:rotate-180"}`} />
                  </button>
                  
                  <Link
                    to="/add-house"
                    className="flex-1 bg-brand-blue text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-0.5 active:scale-95 transition-all group/add"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover/add:scale-110 transition-transform">
                      <FaPlus className="text-[10px] sm:text-xs" />
                    </div>
                    <span>New Listing</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total",   value: activeTab === 'houses' ? houseStats.total : roomStats.total, color: "from-blue-500 to-blue-700",     icon: <FaBuilding /> },
              { label: "Active",  value: totalActive,   color: "from-emerald-500 to-green-600", icon: <FaEye /> },
              { label: "Hidden",  value: totalHidden,   color: "from-slate-500 to-slate-600",   icon: <FaEyeSlash /> },
              { label: activeTab === 'houses' ? "For Rent" : "Available", value: totalRent,     color: "from-violet-500 to-purple-600", icon: <FaHome /> },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-lg`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-poppins font-black text-white leading-none">{s.value}</div>
                  <div className="text-[11px] text-blue-200/50 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          PROPERTIES GRID  (pulls up 2rem into the dark header)
      ════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 pb-24">

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && activeTab === "houses" && houses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-gray-100 mt-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-8 shadow-inner">
              <FaHome className="text-brand-blue text-5xl" />
            </div>
            <h2 className="text-3xl font-poppins font-black text-gray-900 mb-3">No listings yet</h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm">
              You haven't added any properties. Start by listing your first one!
            </p>
            <a
              href="/add-house"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FaPlus /> Add Your First Property
            </a>
          </div>
        )}

        {/* Cards grid */}
        {!isLoading && activeTab === "houses" && houses.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {houses.map((h, idx) => (
              <div
                key={h._id}
                className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* ── Image/Carousel ── */}
                <div className="relative flex-shrink-0">
                  {h.images && h.images.length > 0 ? (
                    <div className="h-52 overflow-hidden">
                      <Slider {...carouselSettings}>
                        {h.images.map((img, i) => (
                          <div key={i} className="h-52">
                            <img
                              src={`http://localhost:5000${img}`}
                              alt={h.title}
                              className="w-full h-52 object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2">
                      <FaHome className="text-slate-300 text-5xl" />
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Photo</span>
                    </div>
                  )}

                  {/* Price badge — top left */}
                  <div className="absolute top-3 left-3 bg-brand-blue/95 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                    ₹{Number(h.price).toLocaleString()}
                    {h.type === "rent" && (
                      <span className="opacity-60 font-normal text-[10px]">/mo</span>
                    )}
                  </div>

                  {/* Live / Hidden badge — top right */}
                  <div
                    className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl shadow-lg ${
                      h.isPublic !== false
                        ? "bg-emerald-500/95 text-white"
                        : "bg-slate-700/90 text-white"
                    }`}
                  >
                    {h.isPublic !== false ? (
                      <><FaEye className="text-[9px]" /> Live</>
                    ) : (
                      <><FaEyeSlash className="text-[9px]" /> Hidden</>
                    )}
                  </div>

                  {/* Rent / Sale pill — bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                        h.type === "rent"
                          ? "bg-blue-100/90 text-blue-700"
                          : "bg-green-100/90 text-green-700"
                      }`}
                    >
                      For {h.type}
                    </span>
                  </div>
                </div>

                {/* ── Card Body ── */}
                <div className="flex flex-col flex-grow p-6">

                  {/* House type chip + ID */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-blue bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                      <FaBuilding className="text-[9px]" /> {h.houseType}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold ml-auto">
                      #{h._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-poppins font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-brand-blue transition-colors duration-200">
                    {h.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
                    <svg className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate font-medium">{h.location}</span>
                  </div>

                  {/* Specs row */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { icon: <FaBed />,           val: h.bedrooms  || 1,   label: "Beds"  },
                      { icon: <FaBath />,          val: h.bathrooms || 1,   label: "Baths" },
                      { icon: <FaRulerCombined />, val: h.area || "—",      label: "Sq ft" },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col items-center py-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-blue transition-colors duration-200"
                      >
                        <span className="text-brand-blue text-sm mb-1">{spec.icon}</span>
                        <span className="text-[12px] font-black text-gray-800">{spec.val}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenity tags */}
                  {(h.furnished || h.parking) && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {h.furnished && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg">
                          <FaChair className="text-[9px]" /> Furnished
                        </span>
                      )}
                      {h.parking && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg">
                          <FaParking className="text-[9px]" /> Parking
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {h.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{h.description}</p>
                  )}

                  {/* ── Action Buttons ────────────────────── */}
                  <div className="mt-auto pt-5 border-t border-gray-100 space-y-3">

                    {/* Visibility toggle or Admin Warning */}
                    {h.adminHidden ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-red-50 text-red-600 border border-red-200 text-center px-4 cursor-not-allowed">
                        <FaExclamationTriangle className="text-lg flex-shrink-0" />
                        <span>Hidden by Super Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Status Selection (Available / Rented / Sold) */}
                        <div className="grid grid-cols-3 gap-2">
                           {[
                             { id: 'available', label: 'Available', icon: <FaCheckCircle/>, activeClass: 'bg-emerald-500 text-white border-emerald-500', inactiveClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
                             { id: 'rented', label: 'Rented', icon: <FaHome/>, activeClass: 'bg-orange-500 text-white border-orange-500', inactiveClass: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' },
                             { id: 'sold', label: 'Sold', icon: <FaTag/>, activeClass: 'bg-red-500 text-white border-red-500', inactiveClass: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' },
                           ].map((status) => (
                             <button
                               key={status.id}
                               onClick={() => updateHouseStatus(h._id, status.id)}
                               className={`flex flex-col items-center justify-center py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-200 ${h.status === status.id ? status.activeClass : status.inactiveClass}`}
                             >
                               <span className="text-xs mb-1">{status.icon}</span>
                               {status.label}
                             </button>
                           ))}
                        </div>

                        <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.isPublic !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              {h.isPublic !== false ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                              {h.isPublic !== false ? "Visible" : "Hidden"}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleHouseVisibility(h._id, h.isPublic !== false)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                              h.isPublic !== false ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                h.isPublic !== false ? "translate-x-6" : "translate-x-1"
                              } shadow-sm`}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit + Delete side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => editHouse(h)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white border border-amber-100 rounded-2xl transition-all duration-300 active:scale-95"
                      >
                        <FaEdit className="text-sm" /> Edit
                      </button>
                      <button
                        onClick={() => deleteHouse(h._id)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-2xl transition-all duration-300 active:scale-95"
                      >
                        <FaTrash className="text-sm" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/*  Image/Carousel  */}
                <div className="relative flex-shrink-0">
                  {r.images && r.images.length > 0 ? (
                    <div className="h-52 overflow-hidden">
                      <Slider {...carouselSettings}>
                        {r.images.map((img, i) => (
                          <div key={i} className="h-52">
                            <img
                              src={`http://localhost:5000${img}`}
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
                    className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl shadow-lg ${
                      r.isPublic !== false
                        ? "bg-emerald-500/95 text-white"
                        : "bg-slate-700/90 text-white"
                    }`}
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
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                        r.status === "available"
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700"
                      }`}
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
                      { icon: <FaBed />,           val: r.bedrooms  || 1,   label: "Max Beds"  },
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
                        {/* Status Selection (Available / Booked / Closed) */}
                        <div className="grid grid-cols-3 gap-2">
                           {[
                             { id: 'available', label: 'Available', icon: <FaCheckCircle/>, activeClass: 'bg-emerald-500 text-white border-emerald-500', inactiveClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
                             { id: 'booked', label: 'Booked', icon: <FaHome/>, activeClass: 'bg-orange-500 text-white border-orange-500', inactiveClass: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' },
                             { id: 'closed', label: 'Closed', icon: <FaTag/>, activeClass: 'bg-red-500 text-white border-red-500', inactiveClass: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' },
                           ].map((status) => (
                             <button
                               key={status.id}
                               onClick={() => updateRoomStatus(r._id, status.id)}
                               className={`flex flex-col items-center justify-center py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-200 ${r.status === status.id ? status.activeClass : status.inactiveClass}`}
                             >
                               <span className="text-xs mb-1">{status.icon}</span>
                               {status.label}
                             </button>
                           ))}
                        </div>

                        <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.isPublic !== false ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                              {r.isPublic !== false ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                              {r.isPublic !== false ? "Visible" : "Hidden"}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleRoomVisibility(r._id, r.isPublic !== false)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                              r.isPublic !== false ? "bg-purple-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                r.isPublic !== false ? "translate-x-6" : "translate-x-1"
                              } shadow-sm`}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit + Delete side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => editRoom(r)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white border border-purple-100 rounded-2xl transition-all duration-300 active:scale-95"
                      >
                        <FaEdit className="text-sm" /> Edit
                      </button>
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

        {/* Empty state - Business */}
        {!isLoading && activeTab === "business" && commercials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-gray-100 mt-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center mb-8 shadow-inner">
              <FaBuilding className="text-amber-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-poppins font-black text-gray-900 mb-3">No business listings yet</h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm">
              You haven't added any commercial or industrial properties.
            </p>
            <a
              href="/add-house?category=business"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FaPlus /> Add Business Listing
            </a>
          </div>
        )}


        {/* Cards grid - Business */}
        {!isLoading && activeTab === "business" && commercials.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {commercials.map((c, idx) => (
              <div
                key={c._id}
                className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Image */}
                <div className="relative flex-shrink-0">
                  {c.images && c.images.length > 0 ? (
                    <div className="h-52 overflow-hidden">
                      <Slider {...carouselSettings}>
                        {c.images.map((img, i) => (
                          <div key={i} className="h-52">
                            <img src={`http://localhost:5000${img}`} alt={c.title} className="w-full h-52 object-cover" />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center gap-2">
                      <FaBuilding className="text-amber-300 text-5xl" />
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">No Photo</span>
                    </div>
                  )}
                  {/* Price badge */}
                  <div className="absolute top-3 left-3 bg-amber-600/95 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                    ₹{Number(c.price).toLocaleString()}
                    {c.type === "rent" && <span className="opacity-60 font-normal text-[10px]">/mo</span>}
                  </div>
                  {/* Live/Hidden badge */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide px-2.5 py-1.5 rounded-xl shadow-lg ${c.isPublic !== false ? "bg-emerald-500/95 text-white" : "bg-slate-700/90 text-white"}`}>
                    {c.isPublic !== false ? <><FaEye className="text-[9px]" /> Live</> : <><FaEyeSlash className="text-[9px]" /> Hidden</>}
                  </div>
                  {/* Status pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-sm ${c.status === "rented" ? "bg-blue-100/90 text-blue-700" : c.status === "sold" ? "bg-rose-100/90 text-rose-700" : "bg-emerald-100/90 text-emerald-700"}`}>
                      {c.status || "Available"}
                    </span>
                  </div>
                  {/* Asset type pill */}
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg backdrop-blur-sm bg-amber-100/90 text-amber-700 capitalize">
                      {c.commercialType || "Commercial"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg capitalize">
                      <FaBuilding className="text-[9px]" /> {c.commercialType || "Business"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold ml-auto">#{c._id.slice(-6).toUpperCase()}</span>
                  </div>

                  <h3 className="text-lg font-poppins font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-amber-600 transition-colors duration-200">{c.title}</h3>

                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                    <FaBuilding className="text-amber-500 w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col items-center py-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                      <FaRulerCombined className="text-amber-500 text-sm mb-1" />
                      <span className="text-[12px] font-black text-gray-800">{c.area || "—"} ft²</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Area</span>
                    </div>
                    <div className="flex flex-col items-center py-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                      <FaTag className="text-amber-500 text-sm mb-1" />
                      <span className="text-[12px] font-black text-gray-800 capitalize">{c.type === "rent" ? "Lease" : "Sale"}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Mode</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                    {c.adminHidden ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-red-50 text-red-600 border border-red-200 px-4 cursor-not-allowed">
                        <FaExclamationTriangle className="flex-shrink-0" /><span>Hidden by Super Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "available", label: "Available", icon: <FaCheckCircle />, activeClass: "bg-emerald-500 text-white border-emerald-500", inactiveClass: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" },
                            { id: "rented",    label: "Rented",    icon: <FaHome />,        activeClass: "bg-blue-500 text-white border-blue-500",    inactiveClass: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100" },
                            { id: "sold",      label: "Sold",      icon: <FaTag />,         activeClass: "bg-rose-500 text-white border-rose-500",    inactiveClass: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" },
                          ].map((status) => (
                            <button key={status.id} onClick={() => updateCommercialStatus(c._id, status.id)}
                              className={`flex flex-col items-center justify-center py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-200 ${c.status === status.id ? status.activeClass : status.inactiveClass}`}>
                              <span className="text-xs mb-1">{status.icon}</span>
                              {status.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.isPublic !== false ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                              {c.isPublic !== false ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">{c.isPublic !== false ? "Visible" : "Hidden"}</span>
                          </div>
                          <button onClick={() => toggleCommercialVisibility(c._id, c.isPublic !== false)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${c.isPublic !== false ? "bg-amber-500" : "bg-slate-300"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${c.isPublic !== false ? "translate-x-6" : "translate-x-1"} shadow-sm`} />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => editCommercial(c)} className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white border border-amber-100 rounded-2xl transition-all duration-300 active:scale-95"><FaEdit /> Edit</button>
                      <button onClick={() => deleteCommercial(c._id)} className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 rounded-2xl transition-all duration-300 active:scale-95"><FaTrash /> Delete</button>
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
}