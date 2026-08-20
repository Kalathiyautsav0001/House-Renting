import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import {
  FaHome,
  FaMapMarkerAlt,
  FaTag,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCouch,
  FaParking,
  FaImages,
  FaAlignLeft,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronLeft,
  FaPlus,
  FaBuilding,
  FaCheckCircle,
  FaPaperPlane,
  FaHotel,
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaDumbbell,
  FaConciergeBell,
  FaSnowflake,
  FaTimes,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { LuBed, LuBath, LuBox, LuCar, LuLayers, LuInfo, LuMapPin, LuType } from "react-icons/lu";
import MapSelector from "../components/MapSelector";
import { analyzeImage } from "../utils/imageAI";

const ALL_AMENITIES = [
  { id: "AC",                 icon: <FaSnowflake className="text-blue-400" />,     label: "AC" },
  { id: "WiFi",               icon: <FaWifi className="text-blue-500" />,           label: "WiFi" },
  { id: "TV",                 icon: <FaTv className="text-gray-600" />,             label: "TV" },
  { id: "Parking",            icon: <FaCar className="text-gray-500" />,            label: "Parking" },
  { id: "Pool",               icon: <FaSwimmingPool className="text-cyan-500" />,   label: "Pool" },
  { id: "Gym",                icon: <FaDumbbell className="text-orange-500" />,     label: "Gym" },
  { id: "Room Service",       icon: <FaConciergeBell className="text-amber-500" />, label: "Room Service" },
  { id: "Restaurant",         icon: <FaConciergeBell className="text-rose-500" />,  label: "Restaurant" },
  { id: "Geyser",             icon: <FaSnowflake className="text-red-400" />,       label: "Geyser" },
  { id: "Breakfast Included", icon: <FaConciergeBell className="text-emerald-500" />, label: "Breakfast Included" },
];

const BUSINESS_AMENITIES = [
  { id: "Loading Docks",    icon: <LuBox className="text-amber-600" />,        label: "Loading Docks" },
  { id: "3-Phase Power",    icon: <FaPaperPlane className="text-orange-500" />, label: "3-Phase Power" },
  { id: "Fire Safety",      icon: <FaShieldAlt className="text-red-500" />,      label: "Fire Safety" },
  { id: "Security 24/7",    icon: <FaShieldAlt className="text-blue-500" />,     label: "Security 24/7" },
  { id: "High Footfall",    icon: <FaPlus className="text-emerald-500" />,       label: "High Footfall" },
  { id: "Fiber Internet",   icon: <FaWifi className="text-cyan-500" />,         label: "Fiber Internet" },
  { id: "Parking Space",    icon: <FaCar className="text-gray-500" />,          label: "Parking Space" },
  { id: "Power Backup",     icon: <FaPaperPlane className="text-yellow-500" />, label: "Power Backup" },
  { id: "CCTV",             icon: <FaImages className="text-slate-600" />,       label: "CCTV" },
  { id: "Water Supply",     icon: <FaPlus className="text-blue-400" />,          label: "Water Supply" },
];

/* ─── Reusable styled input field ──────────────────────────────────────── */
function Field({ label, icon, hint, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon && <span className={error ? "text-red-500" : "text-brand-blue"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <input
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none transition-all duration-200 
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 outline-none shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          }`}
        {...props}
      />
      {error ? (
        <p className="text-[11px] text-red-500 font-bold pl-1 animate-fadeIn">{error}</p>
      ) : (
        hint && <p className="text-[11px] text-gray-400 font-medium pl-1">{hint}</p>
      )}
    </div>
  );
}

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({ icon, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue text-base flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-base font-poppins font-black text-gray-900 leading-none">{title}</h3>
        <div className="flex-1 h-px bg-gray-100 ml-2" />
      </div>
      {children}
    </div>
  );
}

/* ─── Styled select ─────────────────────────────────────────────────────── */
function SelectField({ label, icon, options, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon && <span className={error ? "text-red-500" : "text-brand-blue"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <select
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium focus:outline-none transition-all duration-200 cursor-pointer appearance-none
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          }`}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-red-500 font-bold pl-1 animate-fadeIn">{error}</p>}
    </div>
  );
}

/* ─── Animated toggle ───────────────────────────────────────────────────── */
function ToggleField({ label, icon, checked, onChange, name }) {
  return (
    <label className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:border-brand-blue hover:bg-blue-50/50 transition-all duration-200 group">
      <div className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 flex-shrink-0 ${checked ? "bg-brand-blue" : "bg-gray-300"}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${checked ? "translate-x-6" : "translate-x-0"}`} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-brand-blue text-sm">{icon}</span>
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand-blue transition-colors">{label}</span>
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function AddHouse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listingCategory, setListingCategory]    = useState("house"); 
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat === "hotel" || cat === "business") {
      setListingCategory(cat);
    } else {
      setListingCategory("house");
    }
  }, [location.search]);
// 'house' | 'hotel' | 'business'

  // ── House form state ────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    type: "rent",
    houseType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    parking: false,
    area: "",
    mobileNumber: "",
    whatsAppNumber: "",
    condition: "good",
    latitude: null,
    longitude: null,
  });

  // ── Hotel Room form state ────────────────────────────────────────────────
  const [hotelForm, setHotelForm] = useState({
    title: "",
    hotelName: "",
    location: "",
    roomType: "standard",
    pricePerNight: "",
    bedrooms: 1,
    bathrooms: 1,
    floor: 0,
    description: "",
    mobileNumber: "",
    whatsAppNumber: "",
    latitude: null,
    longitude: null,
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [images, setImages]           = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [errors, setErrors]           = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError]         = useState(null);

  // ── Business form state ───────────────────────────────────────────────
  const [businessForm, setBusinessForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    type: "rent",
    commercialType: "Shop",
    area: "",
    mobileNumber: "",
    whatsAppNumber: "",
    latitude: null,
    longitude: null,
  });
  const [selectedBusinessAmenities, setSelectedBusinessAmenities] = useState([]);

  // ── Pre-fill from User Profile ─────────────────────────────────────────
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.mobile) {
          setForm(prev => ({ ...prev, mobileNumber: user.mobile, whatsAppNumber: user.mobile }));
          setHotelForm(prev => ({ ...prev, mobileNumber: user.mobile, whatsAppNumber: user.mobile }));
          setBusinessForm(prev => ({ ...prev, mobileNumber: user.mobile, whatsAppNumber: user.mobile }));
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleBusinessAmenity = (id) => {
    setSelectedBusinessAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (listingCategory === "hotel") {
      if (!hotelForm.title || hotelForm.title.length < 5) newErrors.title = "Room title must be at least 5 characters";
      if (!hotelForm.hotelName) newErrors.hotelName = "Hotel name is required";
      if (!hotelForm.location) newErrors.location = "Location is required";
      if (!hotelForm.pricePerNight || Number(hotelForm.pricePerNight) <= 0) newErrors.pricePerNight = "Enter a valid price";
      if (!hotelForm.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
      if (!hotelForm.whatsAppNumber) newErrors.whatsAppNumber = "WhatsApp number is required";
      if (!images || images.length === 0) newErrors.images = "At least one room photo is required";
    } else if (listingCategory === "business") {
      if (!businessForm.title || businessForm.title.length < 3) newErrors.title = "Title must be at least 3 characters";
      if (!businessForm.location) newErrors.location = "Location is required";
      if (!businessForm.price || Number(businessForm.price) <= 0) newErrors.price = "Enter a valid price";
      if (!businessForm.area || Number(businessForm.area) <= 0) newErrors.area = "Enter a valid area";
      if (!businessForm.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
      if (!businessForm.whatsAppNumber) newErrors.whatsAppNumber = "WhatsApp number is required";
      if (!images || images.length === 0) newErrors.images = "At least one photo is required";
    } else {
      if (!form.title || form.title.length < 5) newErrors.title = "Title must be at least 5 characters long";
      if (!form.location) newErrors.location = "Location is required";
      if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
      if (!form.area || Number(form.area) <= 0) newErrors.area = "Enter a valid area";
      if (!form.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
      if (!form.whatsAppNumber) newErrors.whatsAppNumber = "WhatsApp number is required";
      if (!images || images.length === 0) newErrors.images = "At least one property photo is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (type === "file") {
      processFiles(files);
      if (errors.images) setErrors(prev => ({ ...prev, images: null }));
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setHotelForm({ ...hotelForm, [name]: value });
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setBusinessForm({ ...businessForm, [name]: value });
  };

  const processFiles = async (files) => {
    setIsAnalyzing(true);
    setAiError(null);
    const validFiles = [];
    const rejectedFiles = [];

    for (const file of Array.from(files)) {
      const { isValid, predictions } = await analyzeImage(file);
      if (isValid) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(file.name);
        console.log(`AI Rejected ${file.name}:`, predictions);
      }
    }

    if (rejectedFiles.length > 0) {
      setAiError(`Rejected ${rejectedFiles.length} image(s) that didn't look like a ${listingCategory === 'hotel' ? 'room' : 'property'}.`);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
    }
    setIsAnalyzing(false);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first to add a property.");
        navigate("/login");
        return;
      }

      if (listingCategory === "house") {
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key] !== null && form[key] !== undefined) {
             formData.append(key, form[key]);
          }
        });
        if (images) {
          for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
          }
        }
        await API.post("/houses", formData);
      } else if (listingCategory === "hotel") {
        const formData = new FormData();
        Object.keys(hotelForm).forEach((key) => {
          if (hotelForm[key] !== null && hotelForm[key] !== undefined) {
             formData.append(key, hotelForm[key]);
          }
        });
        formData.append("amenities", JSON.stringify(selectedAmenities));
        if (images) {
          for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
          }
        }
        await API.post("/rooms", formData);
      } else if (listingCategory === "business") {
        const formData = new FormData();
        Object.keys(businessForm).forEach((key) => {
          if (businessForm[key] !== null && businessForm[key] !== undefined) {
             formData.append(key, businessForm[key]);
          }
        });
        if (images) {
          for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
          }
        }
        await API.post("/commercial", formData);
      }

      setSaved(true);
      setTimeout(() => navigate(listingCategory === "hotel" ? "/rooms" : listingCategory === "business" ? "/business" : "/my-houses"), 1400);
    } catch (err) {
      console.error("Error adding listing:", err);
      const backendError = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error occurred";
      alert("Failed to add listing: " + backendError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter">

      {/* ── Dark hero header ──────────────────────────────────────── */}
      <div className={`relative pt-10 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-500 ${listingCategory === "hotel" ? "bg-gradient-to-br from-[#1a0533] via-[#2d1052] to-[#1a0533]" : "bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629]"}`}>
        <div className={`absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${listingCategory === "hotel" ? "bg-purple-600/10" : listingCategory === "business" ? "bg-amber-600/10" : "bg-brand-blue/10"}`} />
        <div className={`absolute -bottom-8 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${listingCategory === "hotel" ? "bg-pink-600/10" : listingCategory === "business" ? "bg-orange-600/10" : "bg-emerald-600/10"}`} />

        <div className="relative mx-auto max-w-4xl">
          {/* 1. Enhanced Back Navigation */}
          <button
            type="button"
            onClick={() => navigate("/my-houses")}
            className="inline-flex items-center gap-2 text-blue-300/50 hover:text-white text-xs font-black uppercase tracking-widest mb-10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <FaChevronLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              {/* 2. Unified Title Cluster */}
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-2xl transition-all duration-500 ${
                  listingCategory === "hotel" ? "bg-purple-600 text-white shadow-purple-500/20" : 
                  listingCategory === "business" ? "bg-amber-500 text-white shadow-amber-500/20" :
                  "bg-emerald-500 text-white shadow-emerald-500/20"
                }`}>
                  {listingCategory === "hotel" ? <FaHotel className="text-xl sm:text-2xl" /> : 
                   listingCategory === "business" ? <FaBuilding className="text-xl sm:text-2xl" /> :
                   <FaHome className="text-xl sm:text-2xl" />}
                </div>
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${
                    listingCategory === "hotel" ? "bg-purple-500/20 text-purple-300 border border-purple-400/20" : 
                    listingCategory === "business" ? "bg-amber-500/20 text-amber-300 border border-amber-400/20" :
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${listingCategory === "hotel" ? "bg-purple-400" : listingCategory === "business" ? "bg-amber-400" : "bg-emerald-400"}`} />
                    New {listingCategory === "hotel" ? "Room" : listingCategory === "business" ? "Business Asset" : "Property"}
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-poppins font-black text-white tracking-tight mb-2">
                    {listingCategory === "hotel" ? "Add Hotel Room" : listingCategory === "business" ? "Add Business Property" : "Add Property"}
                  </h1>
                  <p className="text-blue-200/50 text-sm sm:text-base font-medium">
                    Please provide the details to list your new {listingCategory}.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Compact Segmented Category Switcher */}
            <div className="w-full md:w-auto">
              <div className="relative bg-black/20 p-1.5 rounded-2xl grid grid-cols-3 border border-white/5 backdrop-blur-md min-w-[320px] sm:min-w-[400px] shadow-2xl">
                <div 
                  className={`absolute inset-y-1 left-1.5 w-[calc(33.33%-4px)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-xl ${
                    listingCategory === "hotel" ? "translate-x-[calc(100%+2px)] bg-purple-600 shadow-[0_8px_20px_rgba(147,51,234,0.4)]" : 
                    listingCategory === "business" ? "translate-x-[calc(200%+4px)] bg-amber-500 shadow-[0_8px_20px_rgba(245,158,11,0.4)]" :
                    "translate-x-0 bg-brand-blue shadow-[0_8px_20px_rgba(13,110,253,0.4)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => { setListingCategory("house"); setImages([]); setPreviewUrls([]); setErrors({}); navigate("/add-house?category=house"); }}
                  className={`relative z-10 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${listingCategory === "house" ? "text-white" : "text-blue-200/50 hover:text-white"}`}
                >
                  Residences
                </button>
                <button
                  type="button"
                  onClick={() => { setListingCategory("hotel"); setImages([]); setPreviewUrls([]); setErrors({}); navigate("/add-house?category=hotel"); }}
                  className={`relative z-10 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${listingCategory === "hotel" ? "text-white" : "text-purple-300/50 hover:text-white"}`}
                >
                  Hotels
                </button>
                <button
                  type="button"
                  onClick={() => { setListingCategory("business"); setImages([]); setPreviewUrls([]); setErrors({}); navigate("/add-house?category=business"); }}
                  className={`relative z-10 py-3 text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${listingCategory === "business" ? "text-white" : "text-amber-200/50 hover:text-white"}`}
                >
                  Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`h-1.5 w-full ${
              listingCategory === "hotel" ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400" : 
              listingCategory === "business" ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-400" :
              "bg-gradient-to-r from-emerald-400 via-brand-blue to-purple-500"
            }`} />

            <div className="p-7 sm:p-10">
              {listingCategory === "hotel" ? (
                <>
                  <Section icon={<LuInfo />} title="Hotel & Room Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Field
                          label="Room Title"
                          icon={<LuType className="text-xs" />}
                          name="title"
                          value={hotelForm.title}
                          onChange={handleHotelChange}
                          placeholder="e.g. Deluxe AC Room with Sea View"
                          error={errors.title}
                        />
                      </div>
                      <Field
                        label="Hotel Name"
                        icon={<FaBuilding className="text-xs" />}
                        name="hotelName"
                        value={hotelForm.hotelName}
                        onChange={handleHotelChange}
                        placeholder="e.g. Hotel Sunrise Grand"
                        error={errors.hotelName}
                      />
                      <Field
                        label="Price Per Night (₹)"
                        icon={<FaTag className="text-xs" />}
                        type="number"
                        name="pricePerNight"
                        value={hotelForm.pricePerNight}
                        onChange={handleHotelChange}
                        placeholder="e.g. 5000"
                        error={errors.pricePerNight}
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Location / Area"
                          icon={<LuMapPin className="text-xs" />}
                          name="location"
                          value={hotelForm.location}
                          onChange={handleHotelChange}
                          placeholder="e.g. Juhu, Mumbai"
                          error={errors.location}
                        />
                        <div className="mt-4">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                            <span className="text-purple-600"><LuMapPin className="text-xs" /></span>
                            Select Location on Map
                          </label>
                          <MapSelector
                            selectedLocation={hotelForm.latitude ? { lat: hotelForm.latitude, lng: hotelForm.longitude } : null}
                            onLocationSelect={(pos) => setHotelForm(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))}
                          />
                          {hotelForm.latitude && (
                            <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                              <FaCheckCircle className="text-[8px]" /> Coordinates captured
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Section>

                  <Section icon={<LuLayers />} title="Room Specifications">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <SelectField
                        label="Room Type"
                        icon={<LuBed className="text-xs" />}
                        name="roomType"
                        value={hotelForm.roomType}
                        onChange={handleHotelChange}
                        options={[
                          { value: "standard",  label: "🏨 Standard Room" },
                          { value: "deluxe",    label: "✨ Deluxe / Superior Room" },
                          { value: "executive", label: "💼 Executive Suite" },
                          { value: "suite",     label: "👑 Suite" },
                          { value: "single",    label: "🛏️ Single Room" },
                          { value: "double",    label: "🛏️🛏️ Double Room" },
                          { value: "family",    label: "👨‍👩‍👧 Family Room" },
                          { value: "dormitory", label: "🏢 Hostel / Dormitory" },
                          { value: "resort",    label: "🏝️ Resort" },
                          { value: "boutique",  label: "💎 Boutique Hotel" },
                          { value: "heritage",  label: "🏰 Heritage Hotel" },
                          { value: "guest",     label: "🏡 Guest House / Homestay" },
                          { value: "motel",     label: "🛣️ Motel" },
                          { value: "service",   label: "🏙️ Service Apartment" },
                          { value: "junior",    label: "🛋️ Junior Suite" },
                          { value: "presidential", label: "🎖️ Presidential Suite" },
                          { value: "studio",    label: "🎨 Studio Room" },
                          { value: "connecting", label: "🚪 Connecting Rooms" },
                          { value: "cabana",    label: "⛱️ Cabana" },
                          { value: "mews",      label: "🏘️ Mews" },
                        ]}
                      />
                      <Field
                        label="Max Beds in Room"
                        icon={<LuBed className="text-xs" />}
                        type="number"
                        name="bedrooms"
                        value={hotelForm.bedrooms}
                        onChange={handleHotelChange}
                        min="1"
                      />
                      <Field
                        label="Bathrooms"
                        icon={<LuBath className="text-xs" />}
                        type="number"
                        name="bathrooms"
                        value={hotelForm.bathrooms}
                        onChange={handleHotelChange}
                        min="1"
                      />
                      <Field
                        label="Floor level"
                        icon={<LuLayers className="text-xs" />}
                        type="number"
                        name="floor"
                        value={hotelForm.floor}
                        onChange={handleHotelChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {ALL_AMENITIES.map((a) => {
                        const active = selectedAmenities.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => toggleAmenity(a.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
                              active ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50 bg-opacity-50"
                            }`}
                          >
                            <span className="text-xl">{a.icon}</span>
                            <span className={`text-[10px] font-black ${active ? "text-purple-700" : "text-gray-400 uppercase"}`}>{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Section>

                  <Section icon={<FaPhoneAlt />} title="Contact Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Reception Mobile"
                        icon={<FaPhoneAlt className="text-xs" />}
                        name="mobileNumber"
                        value={hotelForm.mobileNumber}
                        onChange={handleHotelChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.mobileNumber}
                      />
                      <Field
                        label="WhatsApp for Booking"
                        icon={<FaWhatsapp className="text-xs" />}
                        name="whatsAppNumber"
                        value={hotelForm.whatsAppNumber}
                        onChange={handleHotelChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.whatsAppNumber}
                      />
                    </div>
                  </Section>

                  <Section icon={<FaImages />} title="Media & Description">
                    <div className="mb-6">
                      <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${errors.images ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"}`}>
                        <FaImages className={`text-2xl mb-2 ${errors.images ? "text-red-400" : "text-gray-300 group-hover:text-purple-500"}`} />
                        <span className={`text-sm font-bold ${errors.images ? "text-red-600" : "text-gray-600 group-hover:text-purple-600"}`}>{errors.images || `Add ${listingCategory === 'hotel' ? 'Room' : 'Listing'} Photos`}</span>
                        <input type="file" onChange={handleChange} multiple accept="image/*" className="hidden" />
                      </label>
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                           {previewUrls.map((url, i) => (
                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-purple-200 shadow-sm group/img">
                               <img src={url} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                               <button
                                 type="button"
                                 onClick={() => removeImage(i)}
                                 className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 scale-75 group-hover/img:scale-100"
                               >
                                 <FaTimes className="text-[10px]" />
                               </button>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                    <textarea
                      name="description"
                      value={listingCategory === "hotel" ? hotelForm.description : listingCategory === "business" ? businessForm.description : form.description}
                      onChange={listingCategory === "hotel" ? handleHotelChange : listingCategory === "business" ? handleBusinessChange : handleChange}
                      rows={5}
                      placeholder="Describe the amenities, location highlights, and key features..."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all resize-none"
                    />
                  </Section>
                </>
              ) : listingCategory === "business" ? (
                <>
                  <Section icon={<LuInfo />} title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Field
                          label="Business Listing Name"
                          icon={<LuType className="text-xs" />}
                          name="title"
                          value={businessForm.title}
                          onChange={handleBusinessChange}
                          placeholder="e.g. Modern Retail Shop in Alpha Mall"
                          error={errors.title}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Field
                          label="Location / Full Address"
                          icon={<LuMapPin className="text-xs" />}
                          name="location"
                          value={businessForm.location}
                          onChange={handleBusinessChange}
                          placeholder="e.g. MG Road, Bangalore, Karnataka"
                          error={errors.location}
                        />
                        <div className="mt-4">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                            <span className="text-amber-600"><LuMapPin className="text-xs" /></span>
                            Precise Location on Map
                          </label>
                          <MapSelector
                            selectedLocation={businessForm.latitude ? { lat: businessForm.latitude, lng: businessForm.longitude } : null}
                            onLocationSelect={(pos) => setBusinessForm(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))}
                          />
                          {businessForm.latitude && (
                            <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                              <FaCheckCircle className="text-[8px]" /> Coordinates captured
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <SelectField
                          label="Asset Category"
                          icon={<FaBuilding className="text-xs" />}
                          name="commercialType"
                          value={businessForm.commercialType}
                          onChange={handleBusinessChange}
                          options={[
                            { value: "shop", label: "🛒 Retail Shop / Showroom" },
                            { value: "office", label: "💼 Office Space" },
                            { value: "warehouse", label: "📦 Warehouse / Godown" },
                            { value: "factory", label: "🏭 Factory / Industrial" },
                            { value: "land", label: "🏗️ Commercial Land / Plot" },
                            { value: "other", label: "🏢 Other Business Asset" }
                          ]}
                        />
                      </div>

                      <SelectField
                        label="Transaction Type"
                        icon={<FaTag className="text-xs" />}
                        name="type"
                        value={businessForm.type}
                        onChange={handleBusinessChange}
                        options={[
                          { value: "rent", label: "🔑 For Lease / Rent" },
                          { value: "sale", label: "🏷️ For Sale" },
                        ]}
                      />
                      <Field
                        label={businessForm.type === "sale" ? "Selling Price (₹)" : "Monthly Rent (₹)"}
                        icon={<FaTag className="text-xs" />}
                        type="number"
                        name="price"
                        value={businessForm.price}
                        onChange={handleBusinessChange}
                        placeholder={businessForm.type === "sale" ? "e.g. 15000000" : "e.g. 75000"}
                        error={errors.price}
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Total Area (sq ft)"
                          icon={<FaRulerCombined className="text-xs" />}
                          type="number"
                          name="area"
                          value={businessForm.area}
                          onChange={handleBusinessChange}
                          placeholder="e.g. 2500"
                          error={errors.area}
                        />
                      </div>
                    </div>
                  </Section>

                  <Section icon={<LuLayers />} title="Business Amenities"> 
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                      <span className="text-amber-600"><FaCheckCircle className="text-xs" /></span>
                      Select Relevant Amenities
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {BUSINESS_AMENITIES.map((a) => {
                        const active = selectedBusinessAmenities.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => toggleBusinessAmenity(a.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
                              active ? "border-amber-500 bg-amber-50" : "border-gray-200 bg-gray-50 bg-opacity-50"
                            }`}
                          >
                            <span className="text-xl">{a.icon}</span>
                            <span className={`text-[10px] font-black ${active ? "text-amber-700" : "text-gray-400 uppercase"}`}>{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Section>

                  <Section icon={<FaPhoneAlt />} title="Contact Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Commercial Inquiry Mobile"
                        icon={<FaPhoneAlt className="text-xs" />}
                        name="mobileNumber"
                        value={businessForm.mobileNumber}
                        onChange={handleBusinessChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.mobileNumber}
                      />
                      <Field
                        label="WhatsApp for Business"
                        icon={<FaWhatsapp className="text-xs" />}
                        name="whatsAppNumber"
                        value={businessForm.whatsAppNumber}
                        onChange={handleBusinessChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.whatsAppNumber}
                      />
                    </div>
                  </Section>
                  <Section icon={<FaImages />} title="Media & Proposal Details">
                    <div className="mb-6">
                      <label className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${errors.images ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-amber-500 hover:bg-amber-50"}`}>
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                             <span className="text-xs font-bold text-amber-600">AI Analyzing Images...</span>
                          </div>
                        ) : (
                          <>
                            <FaImages className={`text-2xl mb-2 ${errors.images ? "text-red-400" : "text-gray-300 group-hover:text-amber-500"}`} />
                            <span className={`text-sm font-bold ${errors.images ? "text-red-600" : "text-gray-600 group-hover:text-amber-600"}`}>{errors.images || "Add Business Property Photos"}</span>
                          </>
                        )}
                        <input type="file" onChange={handleChange} multiple accept="image/*" className="hidden" disabled={isAnalyzing} />
                      </label>

                      {aiError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs animate-fadeIn">
                          <FaExclamationTriangle className="text-base flex-shrink-0" />
                          <p className="font-bold">{aiError}</p>
                        </div>
                      )}
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                           {previewUrls.map((url, i) => (
                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm group/img">
                               <img src={url} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                               <button
                                 type="button"
                                 onClick={() => removeImage(i)}
                                 className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 scale-75 group-hover/img:scale-100"
                               >
                                 <FaTimes className="text-[10px]" />
                               </button>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                    <textarea
                      name="description"
                      value={businessForm.description}
                      onChange={handleBusinessChange}
                      rows={5}
                      placeholder="Describe the key features, surrounding area, and business potential..."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                    />
                  </Section>
                </>
              ) : (
                <>
                  <Section icon={<LuInfo />} title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Field
                          label="Property Title"
                          icon={<LuType className="text-xs" />}
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. Spacious 2BHK Apartment in Surat"
                          error={errors.title}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Field
                          label="Location / Address"
                          icon={<LuMapPin className="text-xs" />}
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="e.g. Vesu, Surat, Gujarat"
                          error={errors.location}
                        />
                        <div className="mt-4">
                          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                            <span className="text-brand-blue"><LuMapPin className="text-xs" /></span>
                            Select Location on Map
                          </label>
                          <MapSelector
                            selectedLocation={form.latitude ? { lat: form.latitude, lng: form.longitude } : null}
                            onLocationSelect={(pos) => setForm(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))}
                          />
                          {form.latitude && (
                            <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                              <FaCheckCircle className="text-[8px]" /> Coordinates captured
                            </p>
                          )}
                        </div>
                      </div>
                      <Field
                        label="Price (₹)"
                        icon={<FaTag className="text-xs" />}
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="e.g. 15000"
                        error={errors.price}
                      />
                      <Field
                        label="Area (sq ft)"
                        icon={<FaRulerCombined className="text-xs" />}
                        type="number"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        placeholder="e.g. 1200"
                        error={errors.area}
                      />
                    </div>
                  </Section>

                  <Section icon={<LuLayers />} title="Property Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <SelectField
                        label="Listing Type"
                        icon={<FaTag className="text-xs" />}
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        options={[
                          { value: "rent", label: "🔑 For Rent" },
                          { value: "sale", label: "🏷️ For Sale" },
                        ]}
                      />
                      <SelectField
                        label="Property Type"
                        icon={<FaBuilding className="text-xs" />}
                        name="houseType"
                        value={form.houseType}
                        onChange={handleChange}
                        options={[
                          { value: "apartment",  label: "🏢 Apartment / Flat" },
                          { value: "bungalow",   label: "🏠 Bungalow" },
                          { value: "villa",      label: "🏡 Villa" },
                          { value: "penthouse",  label: "🌆 Penthouse" },
                          { value: "duplex",     label: "🏘️ Duplex" },
                          { value: "studio",     label: "🛋️ Studio Apartment (1RK)" },
                          { value: "builder",    label: "🏗️ Builder Floor" },
                          { value: "row_house",  label: "🏠 Row House / Gala" },
                          { value: "haveli",     label: "🏰 Haveli" },
                          { value: "nalukettu",  label: "🏮 Nalukettu" },
                          { value: "bhunga",     label: "🛖 Bhunga" },
                          { value: "chawl",      label: "🏘️ Chawl" },
                          { value: "palace",     label: "💎 Palace" },
                          { value: "farmhouse",  label: "🚜 Farmhouse" },
                          { value: "kutcha",     label: "🛖 Kutcha House" },
                          { value: "stilt",      label: "🏝️ Stilt House" },
                          { value: "houseboat",  label: "🚢 Houseboat" },
                        ]}
                      />
                      <SelectField
                        label="Condition"
                        icon={<FaCheckCircle className="text-xs" />}
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                        options={[
                          { value: "brand_new",       label: "💎 Brand New / Fresh"      },
                          { value: "newly_renovated", label: "✨ Newly Renovated"        },
                          { value: "well_maintained", label: "✅ Well Maintained"        },
                          { value: "good",            label: "👍 Good Condition"        },
                          { value: "fair",            label: "⚠️ Fair / Old Condition"  },
                          { value: "needs_repair",    label: "🛠️ Needs Repair"           },
                        ]}
                      />
                      <Field
                        label="Bedrooms"
                        icon={<LuBed className="text-xs" />}
                        type="number"
                        name="bedrooms"
                        value={form.bedrooms}
                        onChange={handleChange}
                        min="1"
                      />
                      <Field
                        label="Bathrooms"
                        icon={<LuBath className="text-xs" />}
                        type="number"
                        name="bathrooms"
                        value={form.bathrooms}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ToggleField label="Furnished" icon={<LuBox />} name="furnished" checked={form.furnished} onChange={handleChange} />
                      <ToggleField label="Parking Available" icon={<LuCar />} name="parking" checked={form.parking} onChange={handleChange} />
                    </div>
                  </Section>

                  <Section icon={<FaPhoneAlt />} title="Contact Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Mobile Number"
                        icon={<FaPhoneAlt className="text-xs" />}
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.mobileNumber}
                      />
                      <Field
                        label="WhatsApp Number"
                        icon={<FaWhatsapp className="text-xs" />}
                        name="whatsAppNumber"
                        value={form.whatsAppNumber}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        error={errors.whatsAppNumber}
                      />
                    </div>
                  </Section>

                  <Section icon={<FaImages />} title="Media & Description">
                    <div className="mb-6">
                      <label className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${errors.images ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-brand-blue hover:bg-blue-50"}`}>
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center gap-2">
                             <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
                             <span className="text-xs font-bold text-brand-blue">AI Analyzing Images...</span>
                          </div>
                        ) : (
                          <>
                            <FaImages className={`text-2xl mb-2 ${errors.images ? "text-red-400" : "text-gray-300 group-hover:text-brand-blue"}`} />
                            <span className={`text-sm font-bold ${errors.images ? "text-red-600" : "text-gray-600 group-hover:text-brand-blue"}`}>{errors.images || "Add Property Photos"}</span>
                          </>
                        )}
                        <input type="file" onChange={handleChange} multiple accept="image/*" className="hidden" disabled={isAnalyzing} />
                      </label>
                      
                      {aiError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs animate-fadeIn">
                          <FaExclamationTriangle className="text-base flex-shrink-0" />
                          <p className="font-bold">{aiError}</p>
                        </div>
                      )}

                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                           {previewUrls.map((url, i) => (
                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-brand-blue/20 shadow-sm group/img">
                               <img src={url} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                               <button
                                 type="button"
                                 onClick={() => removeImage(i)}
                                 className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 scale-75 group-hover/img:scale-100"
                               >
                                 <FaTimes className="text-[10px]" />
                               </button>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your property in detail..."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all resize-none"
                    />
                  </Section>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/my-houses")}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || saved}
                  className={`flex-[2] flex items-center justify-center gap-3 py-4 font-bold rounded-2xl text-sm transition-all shadow-lg active:scale-95 ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : listingCategory === "hotel"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-brand-blue text-white"
                  }`}
                >
                  {saved ? (
                    <><FaCheckCircle /> Published! Redirecting…</>
                  ) : saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing…</>
                  ) : (
                    <><FaPaperPlane /> Publish {listingCategory === "hotel" ? "Hotel Room" : "Property"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}