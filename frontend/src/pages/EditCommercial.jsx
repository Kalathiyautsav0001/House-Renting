import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { getImageUrl } from "../utils/api";
import {
  FaEdit,
  FaBuilding,
  FaMapMarkerAlt,
  FaTag,
  FaRulerCombined,
  FaImages,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronLeft,
  FaSave,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaPaperPlane,
  FaShieldAlt
} from "react-icons/fa";
import { LuMapPin, LuType, LuLayers, LuInfo } from "react-icons/lu";
import MapSelector from "../components/MapSelector";
import { analyzeImage } from "../utils/imageAI";

/* ─── Reusable styled input field ──────────────────────────────────────── */
function Field({ label, icon, hint, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon && <span className={error ? "text-red-500" : "text-amber-600"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <input
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none transition-all duration-200 
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 outline-none shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
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
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 text-base flex-shrink-0">
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
        {icon && <span className={error ? "text-red-500" : "text-amber-600"}>{icon}</span>}
        <span className={error ? "text-red-600" : ""}>{label}</span>
      </label>
      <select
        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-gray-900 text-sm font-medium focus:outline-none transition-all duration-200 cursor-pointer appearance-none
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]" 
            : "border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
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
   MAIN PAGE - EDIT COMMERCIAL
   ═══════════════════════════════════════════════════════════════════════════ */
export default function EditCommercial() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const BUSINESS_AMENITIES = [
    { id: "Loading Docks",    icon: <FaBuilding className="text-amber-600" />,        label: "Loading Docks" },
    { id: "3-Phase Power",    icon: <FaPaperPlane className="text-orange-500" />, label: "3-Phase Power" },
    { id: "Fire Safety",      icon: <FaShieldAlt className="text-red-500" />,      label: "Fire Safety" },
    { id: "Security 24/7",    icon: <FaShieldAlt className="text-blue-500" />,     label: "Security 24/7" },
    { id: "High Footfall",    icon: <FaSave className="text-emerald-500" />,       label: "High Footfall" },
    { id: "Fiber Internet",   icon: <FaImages className="text-cyan-500" />,         label: "Fiber Internet" },
    { id: "Parking Space",    icon: <FaBuilding className="text-gray-500" />,          label: "Parking Space" },
    { id: "Power Backup",     icon: <FaPaperPlane className="text-yellow-500" />, label: "Power Backup" },
    { id: "CCTV",             icon: <FaImages className="text-slate-600" />,       label: "CCTV" },
    { id: "Water Supply",     icon: <FaSave className="text-blue-400" />,          label: "Water Supply" },
  ];

  const [images, setImages]             = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewUrls, setPreviewUrls]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError]         = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/commercial/${id}`);
        const data = res.data;
        setForm({
          title:          data.title          || "",
          location:       data.location       || "",
          price:          data.price          || "",
          description:    data.description    || "",
          type:           data.type           || "rent",
          commercialType: data.commercialType || "shop",
          area:           data.area           || "",
          mobileNumber:   data.mobileNumber   || "",
          whatsAppNumber: data.whatsAppNumber || "",
          latitude:       data.latitude       || null,
          longitude:      data.longitude      || null,
        });
        
        if (data.amenities) {
          setSelectedBusinessAmenities(data.amenities);
        }
        
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch commercial listing");
        navigate("/my-houses");
      }
    };
    fetchListing();
  }, [id, navigate]);

  const [errors, setErrors] = useState({});

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

  const toggleBusinessAmenity = (id) => {
    setSelectedBusinessAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (errors[name]) { setErrors(prev => { const next = { ...prev }; delete next[name]; return next; }); }

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
    for (const file of Array.from(files)) {
      const { isValid } = await analyzeImage(file);
      if (isValid) validFiles.push(file);
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
    if (!validateForm()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) formData.append(key, form[key]);
      });
      formData.append("amenities", JSON.stringify(selectedBusinessAmenities));
      if (images) {
        for (let i = 0; i < images.length; i++) formData.append("images", images[i]);
      }
      await API.put(`/commercial/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSaved(true);
      setTimeout(() => navigate("/my-houses"), 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter text-gray-900">
      <div className="relative bg-[#0b1629] pt-10 pb-24 px-4 overflow-hidden">
        <div className="relative mx-auto max-w-4xl">
          <button onClick={() => navigate("/my-houses")} className="inline-flex items-center gap-2 text-amber-300/70 hover:text-white text-sm font-bold mb-8 transition-colors group">
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <FaEdit className="text-amber-400 text-2xl" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Editing Business Listing
              </div>
              <h1 className="text-3xl font-poppins font-black text-white">Edit Commercial Property</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 -mt-12 pb-24">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="p-7 sm:p-10">
            <Section icon={<LuInfo />} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Field label="Listing Title" icon={<LuType />} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Modern Office Space in Business Hub" error={errors.title} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Location" icon={<LuMapPin />} name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bandra Kurla Complex, Mumbai" error={errors.location} />
                  <div className="mt-4">
                    <MapSelector selectedLocation={form.latitude ? { lat: form.latitude, lng: form.longitude } : null} onLocationSelect={(pos) => setForm(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <SelectField
                    label="Asset Category"
                    icon={<FaBuilding className="text-xs" />}
                    name="commercialType"
                    value={form.commercialType}
                    onChange={handleChange}
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
                  icon={<FaTag />} 
                  name="type" 
                  value={form.type} 
                  onChange={handleChange} 
                  options={[{ value: "rent", label: "🔑 For Lease/Rent" }, { value: "sale", label: "🏷️ For Sale" }]} 
                />
                <Field 
                  label={form.type === "sale" ? "Selling Price (₹)" : "Monthly Rent (₹)"} 
                  icon={<FaTag />} 
                  type="number" 
                  name="price" 
                  value={form.price} 
                  onChange={handleChange} 
                  placeholder={form.type === "sale" ? "e.g. 15000000" : "e.g. 75000"} 
                  error={errors.price} 
                />
                
                <div className="md:col-span-2">
                  <Field label="Total Area (sq ft)" icon={<FaRulerCombined />} type="number" name="area" value={form.area} onChange={handleChange} placeholder="e.g. 2500" error={errors.area} />
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

            <Section icon={<FaPhoneAlt />} title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Mobile Number" icon={<FaPhoneAlt />} name="mobileNumber" value={form.mobileNumber} onChange={handleChange} error={errors.mobileNumber} />
                <Field label="WhatsApp Number" icon={<FaWhatsapp />} name="whatsAppNumber" value={form.whatsAppNumber} onChange={handleChange} error={errors.whatsAppNumber} />
              </div>
            </Section>

            <Section icon={<FaImages />} title="Media & Description">
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 block">Current Photos</label>
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
                  <label className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl bg-gray-50 transition-all cursor-pointer group ${isAnalyzing ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'}`}>
                    {isAnalyzing ? <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /> : <><FaImages className="text-3xl text-gray-300 group-hover:text-amber-500" /><span className="text-xs font-bold text-gray-500 mt-2">New Photos (Replaces Current)</span></>}
                    <input type="file" name="images" onChange={handleChange} multiple accept="image/*" className="hidden" disabled={isAnalyzing} />
                  </label>
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img src={url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><FaTimes size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the business opportunity, infrastructure, amenities, etc." className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none" />
            </Section>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => navigate("/my-houses")} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
              <button type="submit" disabled={saving || saved} className={`flex-[2] flex items-center justify-center gap-3 py-4 font-bold rounded-2xl text-white shadow-lg transition-all ${saved ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-orange-600 disabled:opacity-60"}`}>
                {saved ? <><FaCheckCircle /> Saved!</> : saving ? <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</> : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
