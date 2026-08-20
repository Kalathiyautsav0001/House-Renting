import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getImageUrl } from "../utils/api";
import {
  FaEdit,
  FaHotel,
  FaMapMarkerAlt,
  FaTag,
  FaBed,
  FaBath,
  FaImages,
  FaAlignLeft,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronLeft,
  FaSave,
  FaBuilding,
  FaCheckCircle,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";
import MapSelector from "../components/MapSelector";
import { analyzeImage } from "../utils/imageAI";
import { FaExclamationTriangle } from "react-icons/fa";

/* ─── Reusable styled input field ──────────────────────────────────────── */
function Field({ label, icon, hint, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon && <span className={error ? "text-red-500" : "text-purple-600"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <input
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none transition-all duration-200 
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 outline-none shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
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
        <div className="w-9 h-9 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600 text-base flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-poppins font-black text-gray-900 leading-none">{title}</h3>
        </div>
        <div className="flex-1 h-px bg-gray-100 ml-2" />
      </div>
      {children}
    </div>
  );
}

/* ─── Select field ──────────────────────────────────────────────────────── */
function SelectField({ label, icon, options, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon && <span className={error ? "text-red-500" : "text-purple-600"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <select
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium focus:outline-none transition-all duration-200 cursor-pointer appearance-none
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE - EDIT HOTEL
   ═══════════════════════════════════════════════════════════════════════════ */
export default function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    hotelName: "",
    location: "",
    address: "",
    pricePerNight: "",
    roomType: "standard",
    bedrooms: 1,
    bathrooms: 1,
    floor: 0,
    description: "",
    mobileNumber: "",
    whatsAppNumber: "",
    latitude: null,
    longitude: null,
  });

  const [images, setImages]             = useState([]);
  const [existingImages, setExistingImages] = useState([]);   // from DB
  const [previewUrls, setPreviewUrls]   = useState([]);       // new uploads
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError]         = useState(null);

  // Fetch existing hotel room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        const data = res.data;
        setForm({
          title:          data.title          || "",
          hotelName:      data.hotelName      || "",
          location:       data.location       || "",
          address:        data.address        || "",
          pricePerNight:  data.pricePerNight  || "",
          roomType:       data.roomType       || "standard",
          bedrooms:       data.bedrooms       || 1,
          bathrooms:      data.bathrooms      || 1,
          floor:          data.floor          || 0,
          description:    data.description    || "",
          mobileNumber:   data.mobileNumber   || "",
          whatsAppNumber: data.whatsAppNumber || "",
          latitude:       data.latitude       || null,
          longitude:      data.longitude      || null,
        });
        
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch hotel room data");
        navigate("/my-houses");
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const [errors, setErrors]           = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.title || form.title.length < 5) newErrors.title = "Title must be at least 5 characters long";
    if (!form.hotelName) newErrors.hotelName = "Hotel name is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.pricePerNight || form.pricePerNight <= 0) newErrors.pricePerNight = "Enter a valid price";
    if (!form.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!form.whatsAppNumber) newErrors.whatsAppNumber = "WhatsApp number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (type === "file") {
      processFiles(files);
    } else {
      setForm({ ...form, [name]: value });
    }
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
      setAiError(`Rejected ${rejectedFiles.length} image(s) that didn't look like a room or hotel photo.`);
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
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });
      
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      await API.put(`/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSaved(true);
      setTimeout(() => navigate("/my-houses"), 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to update hotel room. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading hotel room details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter">
      {/* ── Dark hero header ──────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0b1629] via-[#1a1033] to-[#0b1629] pt-10 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl">
          <button
            onClick={() => navigate("/my-houses")}
            className="inline-flex items-center gap-2 text-purple-300/70 hover:text-white text-sm font-bold mb-8 transition-colors duration-200 group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to My Dashboard
          </button>

          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center flex-shrink-0">
              <FaEdit className="text-purple-400 text-2xl" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
                Editing Hotel Room
              </div>
              <h1 className="text-3xl sm:text-4xl font-poppins font-black text-white tracking-tight">
                Edit Room
              </h1>
              <p className="text-purple-200/60 text-sm font-medium mt-1 line-clamp-1">
                {form.title || "Updating…"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form card ────────────────────────── */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-brand-blue to-blue-500" />

            <div className="p-7 sm:p-10">
              {/* ── 1. Basic Information ─────────────────────────────── */}
              <Section icon={<FaHotel />} title="Hotel Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Field
                      label="Listing Title"
                      icon={<FaEdit className="text-xs" />}
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Luxury Deluxe Suite with Sea View"
                      error={errors.title}
                    />
                  </div>
                  <Field
                    label="Hotel Name"
                    icon={<FaBuilding className="text-xs" />}
                    name="hotelName"
                    value={form.hotelName}
                    onChange={handleChange}
                    placeholder="e.g. Radisson Blu"
                    error={errors.hotelName}
                  />
                  <Field
                    label="Location / Area"
                    icon={<FaMapMarkerAlt className="text-xs" />}
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Juhu, Mumbai"
                    error={errors.location}
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Detailed Address"
                      icon={<FaMapMarkerAlt className="text-xs" />}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Full hotel address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                      <span className="text-purple-600"><FaMapMarkerAlt className="text-xs" /></span>
                      Verify Map Location
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
              </Section>

              {/* ── 2. Room Details ──────────────────────────────────── */}
              <Section icon={<FaTag />} title="Room Details & Pricing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    label="Price Per Night (₹)"
                    icon={<FaTag className="text-xs" />}
                    type="number"
                    name="pricePerNight"
                    value={form.pricePerNight}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    error={errors.pricePerNight}
                  />
                  <SelectField
                    label="Room Type"
                    icon={<FaLayerGroup className="text-xs" />}
                    name="roomType"
                    value={form.roomType}
                    onChange={handleChange}
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
                    icon={<FaBed className="text-xs" />}
                    type="number"
                    name="bedrooms"
                    value={form.bedrooms}
                    onChange={handleChange}
                    min="1"
                  />
                  <Field
                    label="Bathrooms"
                    icon={<FaBath className="text-xs" />}
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    min="1"
                  />
                  <Field
                    label="Floor Level"
                    icon={<FaLayerGroup className="text-xs" />}
                    type="number"
                    name="floor"
                    value={form.floor}
                    onChange={handleChange}
                  />
                </div>
              </Section>

              {/* ── 3. Contact Numbers ───────────────────────────────── */}
              <Section icon={<FaPhoneAlt />} title="Contact Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    label="Reception Mobile"
                    icon={<FaPhoneAlt className="text-xs" />}
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    error={errors.mobileNumber}
                  />
                  <Field
                    label="WhatsApp for Booking"
                    icon={<FaWhatsapp className="text-xs" />}
                    name="whatsAppNumber"
                    value={form.whatsAppNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    error={errors.whatsAppNumber}
                  />
                </div>
              </Section>

              {/* ── 4. Media & Description ───────────────────────────── */}
              <Section icon={<FaImages />} title="Photos & Description">
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                      <span className="text-emerald-500"><FaCheckCircle className="text-xs" /></span>
                      Current Photos ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {existingImages.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-200">
                          <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${isAnalyzing ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-600 hover:bg-purple-50'}`}>
                    {isAnalyzing ? (
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
                          <span className="text-xs font-bold text-purple-600">AI Analyzing Images...</span>
                       </div>
                    ) : (
                      <>
                        <FaImages className="text-3xl text-gray-300 group-hover:text-purple-600 transition-colors mb-2" />
                        <span className="text-sm text-gray-500 font-semibold group-hover:text-purple-600">Click to upload new photos</span>
                      </>
                    )}
                    <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="hidden" disabled={isAnalyzing} />
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
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-200 group/img">
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

                <div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the room, view, amenities and hotel rules..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all duration-200 resize-none"
                  />
                </div>
              </Section>

              {/* ── Action Buttons ─────────────────────────────────────── */}
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
                  className={`flex-[2] flex items-center justify-center gap-3 py-4 font-bold rounded-2xl text-sm transition-all duration-300 shadow-lg ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-purple-200 disabled:opacity-60"
                  }`}
                >
                  {saved ? (
                    <><FaCheckCircle /> Saved! Redirecting…</>
                  ) : saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  ) : (
                    <><FaSave /> Save Changes</>
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
