import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { 
  FaBed, FaBath, FaWhatsapp, FaPhoneAlt, 
  FaMapMarkerAlt, FaCheckCircle, FaChevronLeft, FaChevronRight,
  FaHotel, FaBuilding, FaTag, FaImages, FaShieldAlt,
  FaWifi, FaTv, FaCar, FaSwimmingPool, FaDumbbell, 
  FaConciergeBell, FaSnowflake, FaExternalLinkAlt
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE_URL, getImageUrl } from "../utils/api";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const hotelIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #9333ea; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const AMENITY_ICONS = {
  "AC":               <FaSnowflake />,
  "WiFi":             <FaWifi />,
  "TV":               <FaTv />,
  "Parking":          <FaCar />,
  "Pool":             <FaSwimmingPool />,
  "Gym":              <FaDumbbell />,
  "Room Service":     <FaConciergeBell />,
  "Restaurant":       <FaConciergeBell />,
  "Geyser":           <FaSnowflake />,
  "Breakfast Included": <FaConciergeBell />,
};

const NextArrow = ({ onClick }) => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronRight className="text-gray-600 group-hover:text-purple-600" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 group" onClick={onClick}>
    <FaChevronLeft className="text-gray-600 group-hover:text-purple-600" />
  </div>
);

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarRooms, setSimilarRooms] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/rooms/${id}`);
        setRoom(res.data);
        setLoading(false);
        fetchSimilar(res.data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const fetchSimilar = async (currentRoom) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/rooms`);
      const filtered = res.data.filter(r => r._id !== currentRoom._id && (r.isPublic !== false));
      setSimilarRooms(filtered.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">Loading hotel room details…</p>
      </div>
    </div>
  );

  if (!room) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6 text-gray-200">
        <FaHotel className="text-4xl" />
      </div>
      <h2 className="text-3xl font-poppins font-black text-gray-900 mb-2">Room Not Found</h2>
      <p className="text-gray-500 font-medium mb-8">This room listing may have been removed or is fully booked.</p>
      <Link to="/rooms" className="px-8 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all">Back to Hotel Marketplace</Link>
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
      <div className="w-2.5 h-2.5 mt-4 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/80" />
    )
  };

  const displayMobile = room.mobileNumber || (room.owner && room.owner.mobile) || "N/A";
  const displayWhatsApp = room.whatsAppNumber || displayMobile;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-inter">
      
      {/* ─── DARK HERO HEADER ─── */}
      <div className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2d1254] to-[#1a0b2e] pt-12 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-purple-300/70 hover:text-white text-sm font-bold mb-8 transition-colors duration-200 group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Marketplace
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-[10px] font-black uppercase tracking-widest">
                   🏨 {room.roomType || 'Standard'} Room
                </span>
                {room.status && room.status !== 'available' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-400/30 rounded-full text-red-300 text-[10px] font-black uppercase tracking-widest animate-pulse">
                     🔥 BOOKED
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-[10px] font-black uppercase tracking-widest font-mono">
                  #{room._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-black text-white tracking-tight mb-2 leading-tight max-w-3xl">
                {room.title}
              </h1>
               <div className="flex flex-col gap-1.5">
                  <p className="text-purple-300 text-lg font-bold flex items-center gap-2">
                    <FaHotel className="text-purple-400" /> {room.hotelName}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${room.latitude},${room.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 text-base font-medium flex items-center gap-2 hover:text-white transition-colors w-max group/loc"
                  >
                    <FaMapMarkerAlt className="text-purple-400 group-hover/loc:scale-110 transition-transform" />
                    <span className="border-b border-purple-400/30 group-hover:border-white transition-colors">{room.location}</span>
                    <FaExternalLinkAlt className="text-[10px] opacity-0 group-hover/loc:opacity-100 transition-opacity" />
                  </a>
               </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 py-3 px-6 rounded-2xl flex items-center md:items-end flex-col gap-1 w-max">
                <span className="text-xs text-purple-200/60 font-black uppercase tracking-widest">Price / Night</span>
                <span className="text-3xl sm:text-4xl font-poppins font-black text-pink-400">
                  ₹{room.pricePerNight?.toLocaleString()}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Image Slider */}
            <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-[rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
               <div className="relative rounded-[24px] overflow-hidden bg-gray-100 group">
                 {room.images && room.images.length > 0 ? (
                   <Slider {...sliderSettings} className="w-full custom-slick-slider">
                     {room.images.map((img, index) => (
                       <div key={index} className="outline-none relative aspect-[16/10] sm:aspect-video">
                         <img 
                           src={getImageUrl(img)} 
                           alt={`${room.title} - ${index + 1}`} 
                           className="w-full h-full object-cover" 
                         />
                         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                       </div>
                     ))}
                   </Slider>
                 ) : (
                   <div className="w-full h-full aspect-video flex flex-col items-center justify-center bg-gray-100/50">
                     <FaImages className="text-5xl text-gray-300 mb-4" />
                     <p className="text-gray-400 font-bold font-poppins text-lg">No Images Available</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Room Overview Card */}
            <div className="bg-white p-7 sm:p-10 rounded-[32px] shadow-xl border border-gray-100">
                <h3 className="flex items-center gap-3 text-2xl font-poppins font-black text-gray-900 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <FaHotel className="text-xl" />
                  </div>
                  Room Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: FaBed, label: "Max Beds", value: room.bedrooms || 1 },
                      { icon: FaBuilding, label: "Floor", value: room.floor ?? "Ground" },
                      { icon: FaShieldAlt, label: "Availability", value: room.status || "Available", capitalize: true },
                    ].map((spec, i) => (
                      <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                           <spec.icon className="text-purple-600 text-sm" />
                           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <span className={`font-poppins font-black text-gray-900 text-lg leading-none ${spec.capitalize ? 'capitalize' : ''}`}>
                           {spec.value}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Amenities Section */}
                <div className="border-t border-gray-100 pt-8 mb-8">
                   <h3 className="font-poppins font-bold text-gray-900 text-lg mb-4">Included Amenities</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100/50">
                             <div className="text-purple-600">
                                {AMENITY_ICONS[amenity] || <FaCheckCircle />}
                             </div>
                             <span className="text-xs font-bold text-gray-700">{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic text-sm">No special amenities listed.</p>
                      )}
                   </div>
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="font-poppins font-bold text-gray-900 text-lg mb-4">Description</h3>
                  <div className="prose prose-purple max-w-none text-gray-600 font-medium leading-relaxed bg-purple-50/30 p-6 rounded-2xl border border-purple-100/30">
                     {room.description ? (
                        <p className="whitespace-pre-line">{room.description}</p>
                     ) : (
                        <p className="text-gray-400 italic">No additional description provided for this room.</p>
                     )}
                  </div>
                </div>
                
                {/* Location & Map Section */}
                {(room.latitude && room.longitude) && (
                  <div id="room-map-section" className="border-t border-gray-100 pt-8 mt-8 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-poppins font-bold text-gray-900 text-lg flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-600" />
                        Location & Neighborhood
                      </h3>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${room.latitude},${room.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                      >
                        Open in Google Maps <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    </div>
                    
                    <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner z-0">
                      <MapContainer 
                        center={[room.latitude, room.longitude]} 
                        zoom={15} 
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[room.latitude, room.longitude]} icon={hotelIcon}>
                          <Popup>
                            <div className="p-1">
                               <p className="font-bold text-xs mb-1 text-purple-700">{room.hotelName}</p>
                               <p className="text-[10px] font-medium text-gray-600">{room.title}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    
                    <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      Coordinates: {room.latitude.toFixed(4)}, {room.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            {/* Contact Card */}
            <div className="bg-white p-7 rounded-[32px] shadow-xl border border-gray-100">
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${room.status !== 'available' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-purple-500/10 border-purple-500/20 text-purple-600'} border rounded-full text-[10px] font-black uppercase tracking-widest mb-3`}>
                    {room.status !== 'available' ? 'Not Available' : 'Book Room'}
                  </div>
                  <h2 className="text-xl font-poppins font-black text-gray-900">
                    {room.status !== 'available' ? 'This room is currently booked' : 'Contact for Reservations'}
                  </h2>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6 border border-gray-100 group transition-colors hover:bg-white hover:border-gray-200">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-xl flex items-center justify-center font-poppins font-black text-xl shadow-md">
                      {room.owner?.name?.charAt(0) || "H"}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-poppins font-bold text-gray-900 truncate leading-tight group-hover:text-purple-600 transition-colors">
                          {room.hotelName === room.owner?.name ? room.hotelName : room.owner?.name || "Hotel Support"}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
                          <FaCheckCircle className="text-emerald-500" /> Managed Property
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <a 
                      href={room.status === 'available' ? `tel:${displayMobile}` : '#'} 
                      onClick={(e) => room.status !== 'available' && e.preventDefault()}
                      className={`w-full flex items-center justify-center gap-3 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                        room.status === 'available' 
                        ? "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                    >
                      <FaPhoneAlt className="text-sm" /> 
                      {room.status === 'available' ? 'Call Now' : 'Booking Closed'}
                    </a>
                    
                    <a 
                      href={room.status === 'available' ? `https://wa.me/${displayWhatsApp?.replace(/\s+/g, '')}?text=Hi, I'm interested in booking the room: ${room.title} at ${room.hotelName}` : '#'} 
                      onClick={(e) => room.status !== 'available' && e.preventDefault()}
                      target={room.status === 'available' ? "_blank" : undefined}
                      rel={room.status === 'available' ? "noopener noreferrer" : undefined}
                      className={`w-full flex items-center justify-center gap-3 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                        room.status === 'available' 
                        ? "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/20" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none shadow-none"
                      }`}
                    >
                      <FaWhatsapp className="text-[20px]" /> 
                      {room.status === 'available' ? 'Inquire on WhatsApp' : 'Fully Booked'}
                    </a>
                </div>
            </div>
          </div>
        </div>

        {/* Similar Rooms */}
        {similarRooms.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-8">Other Rooms You Might Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {similarRooms.map(r => (
                   <Link key={r._id} to={`/room/${r._id}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                         <img src={getImageUrl(r.images[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={r.title} />
                         <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                            ₹{r.pricePerNight?.toLocaleString()}/n
                         </div>
                      </div>
                      <div className="p-5">
                         <h4 className="font-poppins font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors truncate">{r.title}</h4>
                         <p className="text-xs text-gray-500 flex items-center gap-1.5"><FaMapMarkerAlt className="text-purple-500" /> {r.location}</p>
                      </div>
                   </Link>
                 ))}
              </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-slick-slider .slick-dots { bottom: 20px; }
      `}</style>
    </div>
  );
}
