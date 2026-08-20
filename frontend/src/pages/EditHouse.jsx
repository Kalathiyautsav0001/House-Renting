import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getImageUrl } from "../utils/api";
import {
  FaEdit,
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
  FaSave,
  FaBuilding,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { LuBed, LuBath, LuBox, LuCar, LuLayers, LuInfo, LuMapPin, LuType } from "react-icons/lu";
import MapSelector from "../components/MapSelector";
import { analyzeImage } from "../utils/imageAI";
import { FaExclamationTriangle } from "react-icons/fa";

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

/* ─── Toggle checkbox ───────────────────────────────────────────────────── */
function ToggleField({ label, icon, checked, onChange, name }) {
  return (
    <label className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:border-brand-blue hover:bg-blue-50/50 transition-all duration-200 group">
      <div className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 px-0.5 flex-shrink-0 ${checked ? "bg-brand-blue" : "bg-gray-300"}`}>
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
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function EditHouse() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [images, setImages]             = useState([]);
  const [existingImages, setExistingImages] = useState([]);   // from DB
  const [previewUrls, setPreviewUrls]   = useState([]);       // new uploads
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  // Fetch existing house data
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await API.get(`/houses/${id}`);
        const data = res.data;
        setForm({
          title:          data.title          || "",
          location:       data.location       || "",
          price:          data.price          || "",
          description:    data.description    || "",
          type:           data.type           || "rent",
          houseType:      data.houseType      || "apartment",
          bedrooms:       Number(data.bedrooms)       || 1,
          bathrooms:      Number(data.bathrooms)      || 1,
          furnished:      data.furnished === true || data.furnished === "true",
          parking:        data.parking === true   || data.parking   === "true",
          area:           data.area           || "",
          mobileNumber:   data.mobileNumber   || "",
          whatsAppNumber: data.whatsAppNumber || "",
          condition:      data.condition      || "good",
          latitude:       data.latitude       !== undefined ? Number(data.latitude) : null,
          longitude:      data.longitude      !== undefined ? Number(data.longitude) : null,
        });
        // ─── Store existing image paths for display ───────────────
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch property data");
        navigate("/my-houses");
      }
    };
    fetchHouse();
  }, [id, navigate]);

  const [errors, setErrors]           = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError]         = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title || form.title.length < 5) newErrors.title = "Title must be at least 5 characters long";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
    if (!form.area || Number(form.area) <= 0) newErrors.area = "Enter a valid area";
    if (!form.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!form.whatsAppNumber) newErrors.whatsAppNumber = "WhatsApp number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (type === "file") {
      processFiles(files);
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
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
      setAiError(`Rejected ${rejectedFiles.length} image(s) that didn't look like a property photo.`);
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
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }
      await API.put(`/houses/${id}`, formData);
      setSaved(true);
      setTimeout(() => navigate("/my-houses"), 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to update property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading property details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter">

      {/* ── Dark hero header ──────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] pt-10 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl">
          {/* Back button */}
          <button
            onClick={() => navigate("/my-houses")}
            className="inline-flex items-center gap-2 text-blue-300/70 hover:text-white text-sm font-bold mb-8 transition-colors duration-200 group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to My Properties
          </button>

          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center flex-shrink-0">
              <FaEdit className="text-brand-blue text-2xl" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                Editing Listing
              </div>
              <h1 className="text-3xl sm:text-4xl font-poppins font-black text-white tracking-tight">
                Edit Property
              </h1>
              <p className="text-blue-200/60 text-sm font-medium mt-1 line-clamp-1">
                {form.title || "Updating…"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form card — pulls up into hero ────────────────────────── */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Colored top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-purple-500 to-pink-500" />

            <div className="p-7 sm:p-10">

              {/* ── 1. Basic Information ─────────────────────────────── */}
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

                    {/* Google Map Selector */}
                    <div className="mt-4">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                        <span className="text-brand-blue"><LuMapPin className="text-xs" /></span>
                        Select Location on Map
                      </label>
                      <MapSelector
                        selectedLocation={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : null}
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

              {/* ── 2. Property Type ──────────────────────────────────── */}
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
                    label="Property Condition"
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
                    error={errors.bedrooms}
                  />
                  <Field
                    label="Bathrooms"
                    icon={<LuBath className="text-xs" />}
                    type="number"
                    name="bathrooms"
                    value={form.bathrooms}
                    onChange={handleChange}
                    min="1"
                    error={errors.bathrooms}
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ToggleField
                    label="Furnished"
                    icon={<LuBox />}
                    name="furnished"
                    checked={form.furnished}
                    onChange={handleChange}
                  />
                  <ToggleField
                    label="Parking Available"
                    icon={<LuCar />}
                    name="parking"
                    checked={form.parking}
                    onChange={handleChange}
                  />
                </div>
              </Section>

              {/* ── 3. Contact Numbers ───────────────────────────────── */}
              <Section icon={<FaPhoneAlt />} title="Contact Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    label="Mobile Number"
                    icon={<FaPhoneAlt className="text-xs" />}
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    error={errors.mobileNumber}
                  />
                  <Field
                    label="WhatsApp Number"
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
              <Section icon={<FaImages />} title="Media & Description">
                {/* ── Existing photos ─────────────────────────────── */}
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                      <span className="text-emerald-500"><FaCheckCircle className="text-xs" /></span>
                      Current Photos ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {existingImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-200 shadow-sm"
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`existing-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-3 pl-1">
                      ⚠️ Uploading new photos below will <span className="text-amber-500 font-bold">replace</span> the current ones.
                    </p>
                  </div>
                )}

                {/* ── Upload new photos ───────────────────────────── */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                    <span className="text-brand-blue"><FaImages className="text-xs" /></span>
                    {existingImages.length > 0 ? "Replace Photos (Optional)" : "Upload Photos *"}
                  </label>
                  <label className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${isAnalyzing ? 'border-brand-blue bg-blue-50/50' : 'border-gray-200 hover:border-brand-blue hover:bg-blue-50/50'}`}>
                    {isAnalyzing ? (
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
                          <span className="text-xs font-bold text-brand-blue">AI Analyzing Images...</span>
                       </div>
                    ) : (
                      <>
                        <FaImages className="text-3xl text-gray-300 group-hover:text-brand-blue transition-colors mb-2" />
                        <span className="text-sm text-gray-500 font-semibold group-hover:text-brand-blue transition-colors">
                          Click to upload new images
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      name="images"
                      onChange={handleChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={isAnalyzing}
                    />
                  </label>

                  {aiError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs animate-fadeIn">
                      <FaExclamationTriangle className="text-base flex-shrink-0" />
                      <p className="font-bold">{aiError}</p>
                    </div>
                  )}

                  {/* New upload previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm group/img">
                            <img src={url} alt={`new-preview-${i}`} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
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
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your property in detail — highlights, nearby amenities, contact info, etc."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all duration-200 resize-none leading-relaxed"
                  />
                </div>
              </Section>

              {/* ── Action Buttons ─────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/my-houses")}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all duration-200 active:scale-95 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || saved}
                  className={`flex-[2] flex items-center justify-center gap-3 py-4 font-bold rounded-2xl text-sm transition-all duration-300 shadow-lg active:scale-95 ${
                    saved
                      ? "bg-emerald-500 text-white shadow-emerald-200"
                      : "bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-700 hover:to-brand-blue text-white hover:shadow-brand-blue/30 disabled:opacity-60"
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
