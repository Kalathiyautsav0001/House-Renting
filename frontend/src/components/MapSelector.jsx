import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { FaMapMarkerAlt, FaSearch, FaCrosshairs } from "react-icons/fa";
import L from "leaflet";

// Center for Surat, Gujarat
const DEFAULT_CENTER = [21.1702, 72.8311];

// This sub-component handles map clicks to place a marker
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPos = marker.getLatLng();
          setPosition([newPos.lat, newPos.lng]);
          onLocationSelect({ lat: newPos.lat, lng: newPos.lng });
        }
      }}
    />
  );
};

// This sub-component handles external center updates (e.g. from search)
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const MapSelector = ({ selectedLocation, onLocationSelect }) => {
  const [position, setPosition] = useState(
    selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : DEFAULT_CENTER
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
    } else if (navigator.geolocation) {
      // Auto-detect location on mount if no location is selected yet (for new listings)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log("Geolocation auto-detect failed or denied:", err.message),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []); // Run on mount to initialize or auto-detect

  // Sync with prop changes (useful for editing or initial load)
  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => alert("Error: Geolocation failed.")
      );
    } else {
      alert("Error: Browser doesn't support geolocation.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      // Use free Nominatim API for search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const newPos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPos);
        onLocationSelect({ lat: newPos[0], lng: newPos[1] });
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for a location (e.g. Surat, Gujarat)..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-3 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          title="Use current location"
          className="px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          <FaCrosshairs />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm z-0">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <ChangeView center={position} />
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            onLocationSelect={onLocationSelect} 
          />
        </MapContainer>

        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 p-3 rounded-xl shadow-lg pointer-events-none z-[1000]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">Click map to move marker or drag it manually</p>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
