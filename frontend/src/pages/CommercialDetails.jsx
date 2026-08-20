import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { 
   FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaTag, FaBuilding, FaWhatsapp, 
   FaPhoneAlt, FaCheckCircle, FaRulerCombined, FaPaperPlane, FaCar, FaImages, FaExternalLinkAlt
} from "react-icons/fa";
import { LuMaximize, LuMapPin, LuUser, LuZap, LuLayers, LuBox, LuActivity } from "react-icons/lu";
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
  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-amber-600 hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronRight className="text-gray-600 group-hover:text-amber-600" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-amber-600 hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronLeft className="text-gray-600 group-hover:text-amber-600" />
  </div>
);

export default function CommercialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarListings, setSimilarListings] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/commercial/${id}`);
        setListing(res.data);
        setLoading(false);
        fetchSimilar(res.data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const fetchSimilar = async (current) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/commercial`);
      const filtered = res.data.filter(l => l._id !== current._id && l.type === current.type).slice(0, 3);
      setSimilarListings(filtered);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcf9f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">Loading enterprise asset…</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcf9f5] px-4">
      <h2 className="text-3xl font-poppins font-black text-gray-900 mb-2">Asset Not Found</h2>
      <Link to="/commercial" className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold">Back to Marketplace</Link>
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
  };

  return (
    <div className="bg-[#fcf9f5] min-h-screen pb-20 font-inter">
      
      {/* ═══ DARK HERO HEADER ═══ */}
      <div className="relative bg-gradient-to-br from-[#1c1405] via-[#2d2109] to-[#1c1405] pt-12 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-amber-300/70 hover:text-white text-sm font-bold mb-8 transition-colors group">
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to previous
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-[10px] font-black uppercase tracking-widest">
                   {listing.type === 'rent' ? '🔑 For Lease' : '🏷️ For Sale'}
                </span>
                {listing.status && listing.status !== 'available' && (
                  <span className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                     🔥 {listing.status === 'rented' ? 'LEASED' : 'SOLD'}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-[10px] font-black uppercase tracking-widest font-mono">
                  #{listing._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-black text-white tracking-tight mb-3 leading-tight max-w-3xl">
                {listing.title}
              </h1>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200/80 text-base font-medium flex items-center gap-2 hover:text-white transition-colors w-max group"
              >
                <FaMapMarkerAlt className="text-amber-500 group-hover:scale-110 transition-transform" /> 
                <span className="hover:underline">{listing.location}</span>
                <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 py-3 px-6 rounded-2xl flex items-center md:items-end flex-col gap-1 w-max">
                <span className="text-xs text-amber-200/60 font-black uppercase tracking-widest">
                  {listing.type === 'rent' ? 'Monthly Lease' : 'Investment Price'}
                </span>
                <span className="text-3xl sm:text-4xl font-poppins font-black text-amber-400">
                  ₹{listing.price?.toLocaleString()}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Slider */}
            <div className="bg-white rounded-[32px] p-2 shadow-2xl border border-gray-100 overflow-hidden">
               <div className="relative rounded-[24px] overflow-hidden bg-gray-100">
                 {listing.images && listing.images.length > 0 ? (
                   <Slider {...sliderSettings}>
                     {listing.images.map((img, index) => (
                       <div key={index} className="outline-none relative aspect-[16/10] sm:aspect-video">
                         <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                       </div>
                     ))}
                   </Slider>
                 ) : (
                   <div className="w-full h-96 flex flex-col items-center justify-center"><FaImages className="text-5xl text-gray-300" /></div>
                 )}
               </div>
            </div>

            {/* Spec Card */}
            <div className="bg-white p-7 sm:p-10 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-3 text-2xl font-poppins font-black text-gray-900 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <FaBuilding />
                  </div>
                  Asset Details
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                    {[
                      { icon: LuMaximize, label: "Total Area", value: `${listing.area} Sq Ft` },
                      { icon: FaBuilding, label: "Asset Type", value: listing.commercialType || "Commercial", capitalize: true },
                      { icon: FaTag,      label: "Listing Type", value: listing.type === 'rent' ? 'For Lease' : 'For Sale', capitalize: true },
                      { icon: LuActivity, label: "Asset Status", value: listing.status || "Available", capitalize: true },
                      { icon: LuZap,      label: "Electricity", value: listing.electricityCapacity || "Standard", capitalize: true },
                      { icon: FaCar,      label: "Parking", value: listing.parkingSpots > 0 ? `${listing.parkingSpots} Spots` : "On-Street" },
                      { icon: LuLayers,   label: "Total Floors", value: `${listing.floorCount || 1} Floors` },
                      { icon: LuBox,      label: "Zoning", value: listing.zoning || "Commercial", capitalize: true },
                    ].map((spec, i) => (
                      <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
                        <div className="flex items-center gap-2 mb-1">
                           <spec.icon className="text-amber-500 text-sm group-hover:scale-110 transition-transform" />
                           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <span className={`font-poppins font-black text-gray-900 text-base sm:text-lg leading-none ${spec.capitalize ? 'capitalize' : ''}`}>{spec.value}</span>
                      </div>
                    ))}
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="font-poppins font-bold text-gray-900 text-lg mb-4">Market Overview & Analysis</h3>
                  <p className="text-gray-600 font-medium leading-relaxed bg-amber-50/30 p-6 rounded-2xl border border-amber-50/50 whitespace-pre-line">
                     {listing.description || "No detailed description provided for this business listing."}
                  </p>
                </div>

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <div className="border-t border-gray-100 pt-8 mt-8">
                    <h3 className="font-poppins font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                       <LuBox className="text-amber-500" /> Essential Business Features
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                       {listing.amenities.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-amber-100 rounded-2xl shadow-sm">
                           <FaCheckCircle className="text-amber-500 text-xs" />
                           <span className="text-sm font-bold text-gray-700">{item}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
                
                {/* Map */}
                {listing.latitude && listing.longitude && (
                  <div className="border-t border-gray-100 pt-8 mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2"><FaMapMarkerAlt className="text-amber-500" /> Strategic Location</h3>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 transition-all"
                      >
                        Open in Google Maps <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    </div>
                    <div className="h-[350px] rounded-2xl overflow-hidden border border-gray-100 shadow-inner z-0">
                      <MapContainer center={[listing.latitude, listing.longitude]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        <Marker position={[listing.latitude, listing.longitude]}>
                          <Popup><b>{listing.title}</b><br/>{listing.location}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 sticky top-24">
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${listing.status !== 'available' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'} border rounded-full text-[10px] font-black uppercase tracking-widest mb-3`}>
                    {listing.status !== 'available' ? (listing.status === 'rented' ? 'Leased Content' : 'Asset Sold') : 'Business Inquiry'}
                  </div>
                  <h4 className="text-xl font-poppins font-black text-gray-900 leading-tight">
                    {listing.status !== 'available' ? 'Listing No Longer Available' : 'Direct Support'}
                  </h4>
                </div>

                <div className="space-y-4">
                   <a 
                      href={listing.status === 'available' ? `tel:${listing.mobileNumber}` : '#'} 
                      onClick={(e) => listing.status !== 'available' && e.preventDefault()}
                      className={`flex items-center justify-center gap-3 w-full py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 ${
                        listing.status === 'available' 
                        ? "bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                   >
                      <FaPhoneAlt /> {listing.status === 'available' ? 'Call Representative' : 'Not Available'}
                   </a>
                   <a 
                      href={listing.status === 'available' ? `https://wa.me/${listing.whatsAppNumber}` : '#'} 
                      onClick={(e) => listing.status !== 'available' && e.preventDefault()}
                      target={listing.status === 'available' ? "_blank" : undefined}
                      className={`flex items-center justify-center gap-3 w-full py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 ${
                        listing.status === 'available' 
                        ? "bg-[#25D366] text-white shadow-green-500/20 hover:bg-[#20ba59]" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                   >
                      <FaWhatsapp /> {listing.status === 'available' ? 'WhatsApp Proposal' : 'Asset Booked'}
                   </a>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold text-xl">{listing.owner?.name?.[0] || 'V'}</div>
                      <div>
                         <p className="font-black text-gray-900 text-sm">{listing.owner?.name || "Verified Listing"}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enterprise Seller</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
