import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { 
  FaSearch, FaChevronDown, FaSlidersH, FaTimes, FaTag, FaBuilding, FaRupeeSign,
  FaThLarge, FaMapMarkedAlt, FaWhatsapp
} from "react-icons/fa";
import { 
  LuMaximize, LuMapPin, LuPhone, LuHeart, LuStore, LuWarehouse, LuFactory, LuBuilding, LuZap, LuActivity
} from "react-icons/lu";
import MarketplaceToggle from "../components/MarketplaceToggle";
import HousesMapView from "../components/HousesMapView";
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

      {isOpen && (
        <div
          className="absolute top-[calc(100%+6px)] left-[-12px] w-[calc(100%+24px)] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xl"
        >
          <div className="py-1.5 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isActive = value === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-all duration-100 font-inter flex items-center justify-between gap-3
                    ${isActive ? `${iconBg} font-semibold` : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span>{opt.label}</span>
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
  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-100">
    {label}
    <FaTimes className="cursor-pointer hover:text-red-500 transition-colors text-[10px]" onClick={onClear} />
  </span>
);

export default function AllCommercial() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [commercialTypeFilter, setCommercialTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/commercial");
      setListings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                          l.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || l.type === typeFilter;
    const matchesCommercialType = commercialTypeFilter === "all" || l.commercialType === commercialTypeFilter;
    const matchesPrice = maxPrice === "" || l.price <= Number(maxPrice);
    return matchesSearch && matchesType && matchesCommercialType && matchesPrice;
  });

  const hasActiveFilters = typeFilter !== "all" || commercialTypeFilter !== "all" || maxPrice !== "" || search !== "";
  const clearAll = () => { setSearch(""); setTypeFilter("all"); setCommercialTypeFilter("all"); setMaxPrice(""); };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcf9f5] font-inter">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1c1405] via-[#2d2109] to-[#1c1405] overflow-hidden">
        {/* Deco */}
        <div className="absolute -top-12 -left-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative pt-28 sm:pt-32 pb-24 sm:pb-28 px-4 text-center">
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: "50ms" }}>
            <MarketplaceToggle variant="hero" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest mb-6 uppercase animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            Business Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-black text-white tracking-tight mb-4 leading-tight animate-fadeIn">
            Elevate Your Business
          </h1>
          <p className="text-amber-200/60 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium animate-fadeIn mb-10" style={{ animationDelay: "100ms" }}>
            Premium warehouses, retail shops, and industrial spaces for global enterprise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn" style={{ animationDelay: "150ms" }}>
            <button 
              onClick={() => navigate("/add-house?category=business")}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-amber-600 hover:bg-amber-500 hover:text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-1 active:scale-95"
            >
              <FaBuilding className="group-hover:rotate-12 transition-transform" />
              Post Business Listing
            </button>
            <button 
              onClick={() => document.getElementById('commercial-search').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-poppins font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 backdrop-blur-md border border-white/10"
            >
              <FaSearch className="text-xs" />
              Explore Spaces
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div id="commercial-search" className="relative z-40 px-4 -mt-12 sm:-mt-14 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-amber-100/60 p-4 sm:p-5 animate-fadeIn relative z-40">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FaSearch className="text-amber-500 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search business assets or locations..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base sm:text-lg font-medium border-none outline-none p-0 focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <CustomDropdown
                label="Transaction"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[{value:"all", label:"All"}, {value:"rent", label:"For Rent"}, {value:"sale", label:"For Sale"}]}
                icon={FaTag} iconBg="bg-amber-50" iconColor="text-amber-600"
              />
              <CustomDropdown
                label="Asset Type"
                value={commercialTypeFilter}
                onChange={setCommercialTypeFilter}
                options={[
                  {value:"all", label:"All Types"},
                  {value:"shop", label:"🛒 Retail Shop / Showroom"},
                  {value:"office", label:"💼 Office Space"},
                  {value:"warehouse", label:"📦 Warehouse / Godown"},
                  {value:"factory", label:"🏭 Factory / Industrial"},
                  {value:"land", label:"🏗️ Commercial Land / Plot"},
                  {value:"other", label:"🏢 Other Business Asset"}
                ]}
                icon={FaBuilding} iconBg="bg-blue-50" iconColor="text-blue-600"
              />
              <CustomDropdown
                label="Budget"
                value={maxPrice}
                onChange={setMaxPrice}
                options={[
                  {value:"", label:"Any"},
                  {value:"50000", label:"Up to ₹50k"},
                  {value:"100000", label:"Up to ₹1L"},
                  {value:"500000", label:"Up to ₹5L"}
                ]}
                icon={FaRupeeSign} iconBg="bg-green-50" iconColor="text-green-600"
              />
              <button className="bg-amber-500 text-white font-poppins font-bold text-sm h-12 rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group">
                <FaSearch className="text-xs group-hover:scale-110 transition-transform" />
                Search
              </button>
            </div>

            {/* Active Filter Pills Integrated inside the box */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-50 px-1 animate-fadeIn">
                <FaSlidersH className="text-gray-400 text-[10px]" />
                {typeFilter !== "all" && <ActiveFilter label={`For ${typeFilter}`} onClear={() => setTypeFilter("all")} />}
                {commercialTypeFilter !== "all" && <ActiveFilter label={commercialTypeFilter} onClear={() => setCommercialTypeFilter("all")} />}
                {maxPrice !== "" && <ActiveFilter label={`Under ₹${Number(maxPrice).toLocaleString()}`} onClear={() => setMaxPrice("")} />}
                {search !== "" && <ActiveFilter label={`"${search}"`} onClear={() => setSearch("")} />}
                <button onClick={clearAll} className="text-[10px] text-gray-400 hover:text-red-500 font-bold ml-1 transition-colors underline underline-offset-2 uppercase tracking-tight">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6 animate-fadeIn">
          <div>
            <h2 className="text-2xl sm:text-3xl font-poppins text-gray-900 font-extrabold tracking-tight">
              Business Assets
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-400 text-sm font-medium">
                Found <span className="text-amber-600 font-bold">{filteredListings.length}</span> premium spaces
              </p>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200/50 self-start sm:self-end">
            <button 
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-amber-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FaThLarge className={viewMode === 'grid' ? 'text-amber-500' : ''} /> Grid
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-amber-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FaMapMarkedAlt className={viewMode === 'map' ? 'text-amber-500' : ''} /> Map
            </button>
          </div>
        </div>
        {viewMode === "map" ? (
          <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border border-amber-100 shadow-2xl animate-fadeIn">
             <HousesMapView show="commercial" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredListings.map((listing, index) => (
            <div 
              key={listing._id} 
              className="bg-white rounded-[32px] overflow-hidden transition-all duration-500 shadow-soft hover:shadow-2xl hover:-translate-y-2 border border-amber-100/30 group animate-fadeIn flex flex-col"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <Link 
                to={listing.status === 'available' ? `/commercial/${listing._id}` : '#'} 
                onClick={(e) => listing.status !== 'available' && e.preventDefault()}
                className={`block relative aspect-video overflow-hidden ${listing.status !== 'available' ? 'cursor-default' : ''}`}
              >
                <img 
                  src={`http://localhost:5000${listing.images[0]}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  alt={listing.title} 
                />
                
                {/* Condition badge */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none z-20">
                  {listing.condition && (
                    <div className="px-2 py-0.5 text-[9px] font-black text-white bg-black/60 backdrop-blur-md rounded-lg shadow-sm border border-white/20 flex items-center gap-1">
                      <span className="uppercase tracking-tighter">
                        {listing.condition.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider rounded-lg border border-white/20">
                  For {listing.type}
                </div>
                
                {/* Status Overlay */}
                {listing.status && listing.status !== 'available' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                    <div className="px-4 py-1.5 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-xl transform -rotate-12 shadow-2xl">
                      <span className="text-white text-base font-black uppercase tracking-wider drop-shadow-md">
                        {listing.status === 'rented' ? 'ASSET LEASED' : 'ASSET SOLD'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 pointer-events-none translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-baseline gap-1 border border-white/50">
                    <span className="font-poppins font-black text-lg text-amber-600">
                      ₹{listing.price.toLocaleString()}
                    </span>
                    {listing.type === "rent" && <span className="text-[9px] text-gray-400 font-bold uppercase">/mo</span>}
                  </div>
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 capitalize">
                    {listing.commercialType}
                  </span>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest ml-auto">
                    #{listing._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                
                <Link to={`/commercial/${listing._id}`}>
                  <h3 className="text-xl font-poppins font-black text-gray-900 group-hover:text-amber-500 transition-colors line-clamp-1 mb-2 leading-tight">
                    {listing.title}
                  </h3>
                </Link>
                
                <div className="flex items-center text-gray-400 text-[12px] font-medium mb-4">
                  <LuMapPin className="mr-1.5 text-amber-500 text-[13px]" />
                  <span className="truncate">{listing.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50/50 rounded-xl p-2 mb-6 border border-gray-100/50">
                  <div className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-white transition-colors duration-200">
                    <LuMaximize className="text-amber-500 text-sm mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-900">{listing.area} ft²</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-white transition-colors duration-200 border-l border-gray-100">
                    <FaBuilding className="text-amber-500 text-sm mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-900 capitalize">{listing.commercialType || "Business"}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <a 
                    href={listing.status === 'available' ? `tel:${listing.mobileNumber}` : '#'} 
                    onClick={(e) => listing.status !== 'available' && e.preventDefault()}
                    className={`flex-1 font-bold py-3 rounded-xl text-center text-xs transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      listing.status === 'available'
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <LuPhone size={12} /> {listing.status === 'available' ? 'Call' : 'Closed'}
                  </a>
                  <a 
                    href={listing.status === 'available' ? `https://wa.me/${listing.whatsAppNumber}` : '#'} 
                    onClick={(e) => listing.status !== 'available' && e.preventDefault()}
                    target={listing.status === 'available' ? "_blank" : undefined}
                    className={`flex-1 font-bold py-3 rounded-xl text-center text-xs transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      listing.status === 'available'
                        ? "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20ba59]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <FaWhatsapp size={14} /> {listing.status === 'available' ? 'WhatsApp' : 'Booked'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <BackToTop />
    </div>
  );
}
