import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  FaWhatsapp, FaPhoneAlt, FaBed, FaBath, FaRulerCombined,
  FaExternalLinkAlt, FaMapMarkerAlt, FaChevronLeft, FaChevronRight,
  FaTimes, FaHotel, FaBuilding
} from "react-icons/fa";
import { Link } from "react-router-dom";
import L from "leaflet";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DEFAULT_CENTER = [21.1702, 72.8311];

/* ─── Slider Arrows ─────────────────────────────────────────────────────── */
const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-6 h-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all text-[10px]">
    <FaChevronRight />
  </button>
);
const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-6 h-6 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all text-[10px]">
    <FaChevronLeft />
  </button>
);

/* ─── Price Formatters ───────────────────────────────────────────────────── */
const formatPrice = (price) =>
  price >= 10000000
    ? `₹${(price / 10000000).toFixed(1)}Cr`
    : price >= 100000
    ? `₹${(price / 100000).toFixed(1)}L`
    : `₹${(price / 1000).toFixed(0)}k`;

/* ─── Map Pin Icons ──────────────────────────────────────────────────────── */
const createHousePriceIcon = (price, status) => {
  const isAvailable = status === "available" || !status;
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="padding:4px 10px;border-radius:999px;border:2px solid ${isAvailable ? "white" : "#aaa"};
        background:${isAvailable ? "#1e5fff" : "#6b7280"};color:white;font-size:10px;font-weight:900;
        white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2)">
        🏠 ${formatPrice(price)}
      </div>
      <div style="width:2px;height:6px;background:${isAvailable ? "#1e5fff" : "#6b7280"};margin-top:-1px"></div>
    </div>`,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
    popupAnchor: [0, -36],
  });
};

const createHotelPriceIcon = (price, status) => {
  const isAvailable = status === "available" || !status;
  const fp = price >= 10000 ? `₹${(price / 1000).toFixed(0)}k` : `₹${price}`;
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="padding:4px 10px;border-radius:999px;border:2px solid ${isAvailable ? "#e9d5ff" : "#aaa"};
        background:${isAvailable ? "#7c3aed" : "#6b7280"};color:white;font-size:10px;font-weight:900;
        white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2)">
        🏨 ${fp}/n
      </div>
      <div style="width:2px;height:6px;background:${isAvailable ? "#7c3aed" : "#6b7280"};margin-top:-1px"></div>
    </div>`,
    iconSize: [90, 32],
    iconAnchor: [45, 32],
    popupAnchor: [0, -36],
  });
};

const createCommercialPriceIcon = (price, status) => {
  const isAvailable = status === "available" || !status;
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="padding:4px 10px;border-radius:999px;border:2px solid ${isAvailable ? "#fef3c7" : "#aaa"};
        background:${isAvailable ? "#d97706" : "#6b7280"};color:white;font-size:10px;font-weight:900;
        white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2)">
        💼 ${formatPrice(price)}
      </div>
      <div style="width:2px;height:6px;background:${isAvailable ? "#d97706" : "#6b7280"};margin-top:-1px"></div>
    </div>`,
    iconSize: [90, 32],
    iconAnchor: [45, 32],
    popupAnchor: [0, -36],
  });
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const HousesMapView = ({ houses, rooms: externalRooms, show = "both" }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [fetchedHouses, setFetchedHouses] = useState([]);
  const [fetchedRooms, setFetchedRooms] = useState([]);
  const [fetchedCommercial, setFetchedCommercial] = useState([]);

  useEffect(() => {
    if (!houses && (show === "houses" || show === "both")) {
      axios.get("http://localhost:5000/api/houses").then(r => setFetchedHouses(r.data)).catch(() => {});
    }
    if (!externalRooms && (show === "rooms" || show === "both")) {
      axios.get("http://localhost:5000/api/rooms").then(r => setFetchedRooms(r.data)).catch(() => {});
    }
    if (show === "commercial") {
      axios.get("http://localhost:5000/api/commercial").then(r => setFetchedCommercial(r.data)).catch(() => {});
    }
  }, [show]);

  const activeHouses    = houses || fetchedHouses;
  const activeRooms     = externalRooms || fetchedRooms;
  const activeCommercial = fetchedCommercial;

  // Spread overlapping pins by giving each a tiny unique offset
  const applyJitter = (items, latKey = "latitude", lngKey = "longitude") => {
    const seen = {};
    return items.map(item => {
      const key = `${item[latKey]?.toFixed(5)},${item[lngKey]?.toFixed(5)}`;
      seen[key] = (seen[key] || 0) + 1;
      const count = seen[key];
      if (count === 1) return item;
      // Spiral outward for 2nd, 3rd, 4th duplicates (~60m offset per step)
      const angle = (count - 1) * 137.5 * (Math.PI / 180); // golden angle
      const radius = 0.0005 * Math.floor((count - 1) / 8 + 1);
      return {
        ...item,
        [latKey]: item[latKey] + radius * Math.cos(angle),
        [lngKey]: item[lngKey] + radius * Math.sin(angle),
      };
    });
  };

  const housesWithCoords = useMemo(() => {
    if (show === "rooms" || show === "commercial") return [];
    const filtered = activeHouses.filter(h => h.latitude && h.longitude);
    return applyJitter(filtered);
  }, [activeHouses, show]);

  const roomsWithCoords = useMemo(() => {
    if (show === "houses" || show === "commercial") return [];
    const filtered = activeRooms.filter(r => r.latitude && r.longitude && r.isPublic !== false);
    return applyJitter(filtered);
  }, [activeRooms, show]);

  const commercialWithCoords = useMemo(() => {
    if (show !== "commercial") return [];
    const filtered = activeCommercial.filter(c => c.latitude && c.longitude && c.isPublic !== false);
    return applyJitter(filtered);
  }, [activeCommercial, show]);

  const totalCount = housesWithCoords.length + roomsWithCoords.length + commercialWithCoords.length;

  // Theme per category
  const themeColor = show === "rooms" ? "#7c3aed" : show === "commercial" ? "#d97706" : "#1e5fff";
  const themeLabel = show === "rooms" ? "Hotel Explorer" : show === "commercial" ? "Business Explorer" : "Property Explorer";
  const themeIcon  = show === "rooms" ? <FaHotel size={18} /> : show === "commercial" ? <FaBuilding size={18} /> : <FaMapMarkerAlt size={18} />;

  const sliderSettings = {
    dots: false, infinite: true, speed: 500,
    slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 3000,
    nextArrow: <NextArrow />, prevArrow: <PrevArrow />, fade: true,
  };

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 px-1">
        {(show === "houses" || show === "both") && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <div className="w-4 h-4 rounded-full bg-[#1e5fff] border-2 border-white shadow" />
            <span>Properties ({housesWithCoords.length})</span>
          </div>
        )}
        {(show === "rooms" || show === "both") && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <div className="w-4 h-4 rounded-full bg-[#7c3aed] border-2 border-white shadow" />
            <span>Hotel Rooms ({roomsWithCoords.length})</span>
          </div>
        )}
        {show === "commercial" && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <div className="w-4 h-4 rounded-full bg-[#d97706] border-2 border-white shadow" />
            <span>Business Assets ({commercialWithCoords.length})</span>
          </div>
        )}
      </div>

      <div className="h-[650px] w-full rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl z-0">
        <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* 🔵 House Markers */}
          {(show === "houses" || show === "both") && housesWithCoords.map((h) => (
            <Marker
              key={`house-${h._id}`}
              position={[h.latitude, h.longitude]}
              icon={createHousePriceIcon(h.price, h.status)}
              eventHandlers={{ click: () => setActivePopup({ ...h, _listingType: "house" }) }}
            />
          ))}

          {/* 🟣 Hotel Room Markers */}
          {(show === "rooms" || show === "both") && roomsWithCoords.map((r) => (
            <Marker
              key={`room-${r._id}`}
              position={[r.latitude, r.longitude]}
              icon={createHotelPriceIcon(r.pricePerNight, r.status)}
              eventHandlers={{
                click: () => setActivePopup({
                  ...r, _listingType: "hotel",
                  price: r.pricePerNight,
                  bedrooms: r.bedrooms,
                  bathrooms: r.bathrooms,
                  area: r.floor !== undefined ? `F-${r.floor}` : "—",
                }),
              }}
            />
          ))}

          {/* 🟠 Commercial Markers */}
          {show === "commercial" && commercialWithCoords.map((c) => (
            <Marker
              key={`commercial-${c._id}`}
              position={[c.latitude, c.longitude]}
              icon={createCommercialPriceIcon(c.price, c.status)}
              eventHandlers={{
                click: () => setActivePopup({
                  ...c, _listingType: "commercial",
                  bedrooms: c.commercialType || "—",
                  bathrooms: c.type === "rent" ? "Rent" : "Sale",
                  area: c.area,
                }),
              }}
            />
          ))}

          {/* Popup */}
          {activePopup && (
            <Popup
              position={[activePopup.latitude, activePopup.longitude]}
              onClose={() => setActivePopup(null)}
              className="property-popup-premium"
              closeButton={false}
            >
              <div className="w-[280px] bg-white/95 backdrop-blur-2xl overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 font-inter">
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-gray-900 group/slider">
                  <button
                    onClick={() => setActivePopup(null)}
                    className="absolute top-3 right-3 z-[100] w-8 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 !text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-xl"
                  >
                    <FaTimes size={14} />
                  </button>

                  {activePopup.images?.length > 0 ? (
                    <Slider {...sliderSettings} className="h-full w-full">
                      {activePopup.images.map((img, i) => (
                        <div key={i} className="h-40 w-full">
                          <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <FaBuilding className="text-5xl text-gray-300" />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className={`px-2.5 py-1.5 !text-white text-[9px] font-black uppercase rounded-lg shadow-2xl tracking-widest backdrop-blur-md border border-white/20 ${
                      activePopup._listingType === "hotel" ? "bg-purple-600/90"
                      : activePopup._listingType === "commercial" ? "bg-amber-600/90"
                      : "bg-blue-600/90"
                    }`}>
                      {activePopup._listingType === "hotel"
                        ? `🏨 ${activePopup.roomType || "Room"}`
                        : activePopup._listingType === "commercial"
                        ? `💼 ${activePopup.commercialType || "Business"}`
                        : `🏠 For ${activePopup.type}`}
                    </span>
                  </div>

                  {/* Status Overlay */}
                  {activePopup.status && activePopup.status !== "available" && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                      <div className="px-5 py-2 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-2xl transform -rotate-12 shadow-2xl">
                        <span className="text-white text-sm font-black uppercase tracking-widest drop-shadow-md">
                          {activePopup._listingType === "hotel" ? "FULLY BOOKED" : 
                            (activePopup.status === 'rented' ? (activePopup._listingType === 'commercial' ? 'ASSET LEASED' : 'HOUSE RENTED') : 'PROPERTY SOLD')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none z-10" />

                  {/* Price */}
                  <div className="absolute bottom-2.5 right-2.5 z-20">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-2">
                      <span className="text-[7px] font-black !text-white/60 border-r border-white/10 pr-2 uppercase tracking-widest">
                        {activePopup._listingType === "hotel" ? "/night"
                        : activePopup._listingType === "commercial" && activePopup.type === "rent" ? "/mo"
                        : "Price"}
                      </span>
                      <span className="text-sm font-black !text-white">₹{activePopup.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-white">
                  <div className="mb-3">
                    <h3 className="text-base font-black text-gray-900 line-clamp-1 font-poppins leading-tight mb-1">{activePopup.title}</h3>
                    {activePopup._listingType === "hotel" && activePopup.hotelName && (
                      <p className="text-[10px] font-black text-purple-600 mb-1 flex items-center gap-1">
                        <FaHotel size={8} /> {activePopup.hotelName}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5">
                      <FaMapMarkerAlt size={10} style={{ color: themeColor }} />
                      <span className="text-[11px] font-bold text-gray-500 line-clamp-1">{activePopup.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-0.5 py-2.5 border border-gray-100 mb-4 bg-gray-50/50 rounded-xl overflow-hidden">
                    <div className="flex flex-col items-center gap-1 py-1">
                      {activePopup._listingType === "commercial"
                        ? <FaBuilding size={12} style={{ color: themeColor }} />
                        : <FaBed size={12} style={{ color: themeColor }} />}
                      <span className="text-[11px] font-black text-gray-900">{activePopup.bedrooms || "—"}</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">
                        {activePopup._listingType === "commercial" ? "Type" : "Beds"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-1 border-x border-gray-100">
                      <FaBath size={12} style={{ color: themeColor }} />
                      <span className="text-[11px] font-black text-gray-900">{activePopup.bathrooms || "—"}</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">
                        {activePopup._listingType === "commercial" ? "Mode" : "Baths"}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-1">
                      <FaRulerCombined size={12} style={{ color: themeColor }} />
                      <span className="text-[11px] font-black text-gray-900">{activePopup.area || "—"}</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">
                        {activePopup._listingType === "hotel" ? "Floor" : "SqFt"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {activePopup.status && activePopup.status !== "available" ? (
                      <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black bg-gray-100 text-gray-400 border border-gray-200">
                        <FaTimes size={10} /> ENQUIRY CLOSED
                      </div>
                    ) : (
                      <>
                        <a
                          href={`tel:${activePopup.mobileNumber || ""}`}
                          className="flex-[3] flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] font-black !text-white no-underline shadow-lg hover:scale-105 transition-transform"
                          style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}bb)` }}
                        >
                          <FaPhoneAlt size={10} /> CALL
                        </a>
                        <a
                          href={`https://wa.me/${(activePopup.whatsAppNumber || "").replace(/\s+/g, "")}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-[3] flex items-center justify-center gap-1 py-2.5 rounded-xl text-[10px] font-black !text-white no-underline shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 transition-transform"
                        >
                          <FaWhatsapp size={13} /> WHATSAPP
                        </a>
                      </>
                    )}
                    <Link
                      to={
                        activePopup._listingType === "hotel" ? `/room/${activePopup._id}`
                        : activePopup._listingType === "commercial" ? `/commercial/${activePopup._id}`
                        : `/house/${activePopup._id}`
                      }
                      className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-800 rounded-xl border border-gray-100 shadow-md !text-gray-600 hover:!text-white transition-all transform active:scale-90"
                    >
                      <FaExternalLinkAlt size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </MapContainer>
      </div>

      {/* Floating Header */}
      <div className="absolute top-10 left-8 z-[1000] bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg" style={{ background: themeColor }}>
          {themeIcon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1" style={{ color: themeColor }}>
            {themeLabel}
          </p>
          <p className="text-xl font-black text-gray-900 leading-none">
            Showing {totalCount} <span className="text-gray-400 font-bold">Listings</span>
          </p>
        </div>
      </div>

      <style>{`
        .property-popup-premium .leaflet-popup-content-wrapper {
          padding: 0; overflow: hidden; background: transparent; box-shadow: none;
        }
        .property-popup-premium .leaflet-popup-content { margin: 0; width: 300px !important; }
        .property-popup-premium .leaflet-popup-tip { display: none; }
        .custom-div-icon { background: transparent !important; border: none !important; }
        .slick-dots { bottom: 10px !important; }
        .slick-dots li button:before { color: white !important; }
      `}</style>
    </div>
  );
};

export default HousesMapView;
