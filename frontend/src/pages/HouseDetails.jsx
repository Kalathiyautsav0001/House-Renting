import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { 
  FaBed, FaBath, FaRulerCombined, FaWhatsapp, FaPhoneAlt, 
  FaMapMarkerAlt, FaCheckCircle, FaChevronLeft, FaChevronRight,
  FaHome, FaBuilding, FaTag, FaCouch, FaParking, FaImages, FaShieldAlt, FaExternalLinkAlt
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE_URL, getImageUrl } from "../utils/api";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const NextArrow = ({ onClick }) => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white hover:text-brand-blue hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronRight className="text-gray-600 group-hover:text-brand-blue" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white hover:text-brand-blue hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronLeft className="text-gray-600 group-hover:text-brand-blue" />
  </div>
);

export default function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarHouses, setSimilarHouses] = useState([]);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/houses/${id}`);
        setHouse(res.data);
        setLoading(false);
        fetchSimilar(res.data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  const fetchSimilar = async (currentHouse) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/houses`);
      const allHouses = res.data.filter(h => h.isPublic !== false && h.isPublic !== "false");
      
      // Filter out the current house
      let filtered = allHouses.filter(h => h._id !== currentHouse._id);
      
      // Try to match both listing type (rent/sale) AND property type
      let exactMatches = filtered.filter(
        h => h.type === currentHouse.type && h.houseType === currentHouse.houseType
      );
      
      // If we don't have enough exact matches, fallback to matching just listing type
      if (exactMatches.length < 3) {
        let fallbackMatches = filtered.filter(h => h.type === currentHouse.type && h.houseType !== currentHouse.houseType);
        exactMatches = [...exactMatches, ...fallbackMatches];
      }
      
      setSimilarHouses(exactMatches.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f4fb]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">Loading premium listing…</p>
      </div>
    </div>
  );

  if (!house) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4fb] px-4">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
        <FaHome className="text-4xl text-gray-300" />
      </div>
      <h2 className="text-3xl font-poppins font-black text-gray-900 mb-2">Property Not Found</h2>
      <p className="text-gray-500 font-medium mb-8">This listing may have been removed or is unavailable.</p>
      <Link to="/" className="btn-primary px-8 py-3">Back to Marketplace</Link>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    customPaging: i => (
      <div className="w-2.5 h-2.5 mt-4 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/80 shadow-sm" />
    )
  };

  const displayMobile = house.mobileNumber || (house.owner && house.owner.mobile) || "N/A";
  const displayWhatsApp = house.whatsAppNumber || (house.owner && house.owner.mobile) || "N/A";

  return (
    <div className="bg-[#f0f4fb] min-h-screen pb-20 font-inter">
      
      {/* ════════════════════════════════════════════════════════
          DARK HERO HEADER
      ════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] pt-12 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-300/70 hover:text-white text-sm font-bold mb-8 transition-colors duration-200 group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to previous
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-widest ${house.type === 'rent' ? 'bg-brand-blue/20 border-brand-blue/30 text-brand-blue' : ''}`}>
                   {house.type === 'rent' ? '🔑 For Rent' : '🏷️ For Sale'}
                </span>
                {house.status && house.status !== 'available' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full text-red-300 text-[10px] font-black uppercase tracking-widest animate-pulse">
                     🔥 {house.status === 'rented' ? 'ALREADY RENTED' : 'ALREADY SOLD'}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-[10px] font-black uppercase tracking-widest font-mono">
                  #{house._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-black text-white tracking-tight mb-3 leading-tight max-w-3xl">
                {house.title}
              </h1>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${house.latitude},${house.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200/80 text-base font-medium flex items-center gap-2 hover:text-white transition-colors duration-200 group/loc w-max"
              >
                <FaMapMarkerAlt className="text-brand-blue group-hover/loc:scale-110 transition-transform" /> 
                <span className="border-b border-blue-400/30 group-hover:border-white transition-colors">{house.location}</span>
                <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover/loc:opacity-100 transition-opacity" />
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 py-3 px-6 rounded-2xl flex items-center md:items-end flex-col gap-1 w-max">
                <span className="text-xs text-blue-200/60 font-black uppercase tracking-widest">
                  {house.type === 'rent' ? 'Monthly Rent' : 'Asking Price'}
                </span>
                <span className="text-3xl sm:text-4xl font-poppins font-black text-emerald-400">
                  ₹{house.price?.toLocaleString()}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT AREA (-mt-24 overlap)
      ════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Slider */}
            <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-[rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
               <div className="relative rounded-[24px] overflow-hidden bg-gray-100 group">
                 {house.images && house.images.length > 0 ? (
                   <Slider {...sliderSettings} className="w-full custom-slick-slider">
                     {house.images.map((img, index) => (
                       <div key={index} className="outline-none relative aspect-[16/10] sm:aspect-video">
                         <img 
                           src={getImageUrl(img)} 
                           alt={`${house.title} - ${index + 1}`} 
                           className="w-full h-full object-cover" 
                         />
                         {/* Subtle gradient so dots look good */}
                         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                       </div>
                     ))}
                   </Slider>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/50">
                     <FaImages className="text-5xl text-gray-300 mb-4" />
                     <p className="text-gray-400 font-bold font-poppins text-lg">No Images Available</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Property Overview Card */}
            <div className="bg-white p-7 sm:p-10 rounded-[32px] shadow-xl shadow-[rgba(0,0,0,0.03)] border border-gray-100">
                <h3 className="flex items-center gap-3 text-2xl font-poppins font-black text-gray-900 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                    <FaBuilding className="text-xl" />
                  </div>
                  Property Overview
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: FaBed, label: "Bedrooms", value: house.bedrooms },
                      { icon: FaBath, label: "Bathrooms", value: house.bathrooms },
                      { icon: FaRulerCombined, label: "Area Sq Ft", value: house.area || "N/A" },
                      { icon: FaCheckCircle, label: "Condition", value: house.condition ? house.condition.replace(/_/g, " ") : "Good", capitalize: true },
                      { icon: FaHome, label: "Property Type", value: house.houseType || "N/A", capitalize: true },
                      { icon: FaCouch, label: "Furnished", value: house.furnished ? "Yes" : "No" },
                      { icon: FaParking, label: "Parking Space", value: house.parking ? "Yes" : "No" },
                      { icon: FaShieldAlt, label: "Status", value: house.status || "Available", capitalize: true },
                    ].map((spec, i) => (
                      <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                           <spec.icon className="text-brand-blue text-sm" />
                           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <span className={`font-poppins font-black text-gray-900 text-lg leading-none ${spec.capitalize ? 'capitalize' : ''}`}>
                           {spec.value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="font-poppins font-bold text-gray-900 text-lg mb-4">Description</h3>
                  <div className="prose prose-blue max-w-none text-gray-600 font-medium leading-relaxed bg-blue-50/30 p-6 rounded-2xl border border-blue-50/50">
                     {house.description ? (
                        <p className="whitespace-pre-line">{house.description}</p>
                     ) : (
                        <p className="text-gray-400 italic">No detailed description provided by the owner.</p>
                     )}
                  </div>
                </div>
                
                {/* Location & Map Section */}
                {(house.latitude && house.longitude) && (
                  <div id="property-map-section" className="border-t border-gray-100 pt-8 mt-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2">
                        <FaMapMarkerAlt className="text-brand-blue" />
                        Location & Neighborhood
                      </h3>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${house.latitude},${house.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                      >
                        Open in Google Maps <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    </div>
                    
                    <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner z-0">
                      <MapContainer 
                        center={[house.latitude, house.longitude]} 
                        zoom={15} 
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[house.latitude, house.longitude]}>
                          <Popup className="property-popup-min">
                            <div className="p-2">
                               <p className="font-bold text-xs mb-1">{house.title}</p>
                               <p className="text-[10px] text-gray-500">{house.location}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    
                    <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Coordinates: {house.latitude.toFixed(4)}, {house.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            
            {/* Contact Card */}
            <div className="bg-white p-7 rounded-[32px] shadow-xl shadow-[rgba(0,0,0,0.05)] border border-gray-100">
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${house.status !== 'available' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'} border rounded-full text-[10px] font-black uppercase tracking-widest mb-3`}>
                    {house.status !== 'available' ? 'Action Required' : 'Contact Owner'}
                  </div>
                  <h2 className="text-xl font-poppins font-black text-gray-900">
                    {house.status !== 'available' ? 'This property is no longer available' : 'Interested in this property?'}
                  </h2>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100 group transition-colors hover:bg-white hover:border-gray-200 hover:shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-purple-500 text-white rounded-xl flex items-center justify-center font-poppins font-black text-xl shadow-md">
                      {house.owner?.name?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-poppins font-bold text-gray-900 truncate leading-tight group-hover:text-brand-blue transition-colors">
                          {house.owner?.name || "Premium User"}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
                          <FaCheckCircle className="text-emerald-500" /> Verified Lister
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <a 
                      href={house.status === 'available' ? `tel:${displayMobile}` : '#'} 
                      onClick={(e) => house.status !== 'available' && e.preventDefault()}
                      className={`w-full flex items-center justify-center gap-3 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                        house.status === 'available' 
                        ? "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                    >
                      <FaPhoneAlt className="text-sm" /> 
                      {house.status === 'available' ? 'Call Owner' : 'Booking Closed'}
                    </a>
                    
                    <a 
                      href={house.status === 'available' ? `https://wa.me/${displayWhatsApp.replace(/\s+/g, '')}?text=Hi, I'm interested in your property: ${house.title}` : '#'} 
                      onClick={(e) => house.status !== 'available' && e.preventDefault()}
                      target={house.status === 'available' ? "_blank" : undefined}
                      rel={house.status === 'available' ? "noopener noreferrer" : undefined}
                      className={`w-full flex items-center justify-center gap-3 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                        house.status === 'available' 
                        ? "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                    >
                      <FaWhatsapp className="text-[20px]" /> 
                      {house.status === 'available' ? 'Chat on WhatsApp' : 'Inquiries Closed'}
                    </a>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-start gap-3">
                  <FaShieldAlt className="text-gray-400 text-lg flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] uppercase font-bold text-gray-400 leading-relaxed tracking-wider">
                    Do not share banking details over chat. Conduct physical visits before advance payments.
                  </p>
                </div>
            </div>

            {/* Minor Specs Card */}
            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
               <div>
                  <h4 className="font-poppins font-bold text-gray-900 text-sm mb-1">Listed On</h4>
                  <p className="text-xs font-medium text-gray-500">Platform Verified</p>
               </div>
               <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <span className="text-emerald-500 font-black text-xl">✓</span>
               </div>
            </div>

          </div>

          {/* ════════════════════════════════════════════════════════
              SIMILAR PROPERTIES
          ════════════════════════════════════════════════════════ */}
          {similarHouses && similarHouses.length > 0 && (
            <div className="lg:col-span-3 mt-12 pt-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-poppins font-black text-gray-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-brand-blue rounded-full inline-block"></span> Similar Properties
                </h2>
                <Link to="/" className="text-sm font-bold text-brand-blue hover:text-blue-700 transition-colors hidden sm:block">View all listings &rarr;</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {similarHouses.map((simHouse) => (
                  <div key={simHouse._id} className="group bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col">
                    <Link to={`/house/${simHouse._id}`} className="block relative aspect-[4/3] overflow-hidden">
                      <img
                        src={simHouse.images?.[0] ? getImageUrl(simHouse.images[0]) : "https://via.placeholder.com/400x300"}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        alt={simHouse.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                         <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md border border-white/20 ${simHouse.type === 'rent' ? 'bg-brand-blue/90 text-white' : 'bg-white/90 text-gray-900'}`}>
                           For {simHouse.type}
                         </span>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-white/50 group-hover:-translate-y-1 transition-transform duration-300">
                         <span className="font-poppins font-black text-brand-green">
                           ₹{simHouse.price?.toLocaleString()}
                         </span>
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          {simHouse.houseType || 'House'}
                        </span>
                      </div>
                      
                      <Link to={`/house/${simHouse._id}`}>
                        <h3 className="mb-1 text-lg font-poppins font-black text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">{simHouse.title}</h3>
                      </Link>
                      
                      <div className="flex items-center text-gray-500 text-xs font-medium mb-4">
                        <FaMapMarkerAlt className="mr-1.5 text-brand-blue/70 flex-shrink-0" /> 
                        <span className="truncate">{simHouse.location}</span>
                      </div>
                      
                      {/* Professional specs bar */}
                      <div className="mt-auto grid grid-cols-3 gap-1 bg-gray-50 rounded-xl p-2 border border-gray-100">
                         <div className="flex flex-col items-center justify-center py-2 rounded-lg group/spec hover:bg-white transition-all duration-200">
                           <FaBed className="text-brand-blue text-lg mb-1.5 opacity-70 group-hover/spec:opacity-100 transition-opacity" />
                           <span className="text-[11px] font-black text-gray-800 tracking-tight">{simHouse.bedrooms || 1} Bed</span>
                         </div>
                         <div className="flex flex-col items-center justify-center py-2 rounded-lg group/spec hover:bg-white transition-all duration-200 border-x border-gray-200/50">
                           <FaBath className="text-brand-blue text-lg mb-1.5 opacity-70 group-hover/spec:opacity-100 transition-opacity" />
                           <span className="text-[11px] font-black text-gray-800 tracking-tight">{simHouse.bathrooms || 1} Bath</span>
                         </div>
                         <div className="flex flex-col items-center justify-center py-2 rounded-lg group/spec hover:bg-white transition-all duration-200">
                           <FaRulerCombined className="text-brand-blue text-lg mb-1.5 opacity-70 group-hover/spec:opacity-100 transition-opacity" />
                           <span className="text-[11px] font-black text-gray-800 tracking-tight">{simHouse.area || 1200} ft²</span>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Required for Slick overriding via global if we need it, but inline classes cover most */}
      <style>{`
        .custom-slick-slider .slick-dots { bottom: 20px; }
      `}</style>
    </div>
  );
}
