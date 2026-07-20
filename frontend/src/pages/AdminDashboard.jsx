import { useState, useEffect } from "react";
import API from "../utils/api";
import {
  FaTrash, FaCheckCircle, FaExclamationTriangle, FaEyeSlash, FaEye,
  FaHome, FaHotel, FaBuilding, FaUser, FaPhone, FaWhatsapp,
  FaRupeeSign, FaMapMarkerAlt, FaSearch, FaShieldAlt
} from "react-icons/fa";
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";

/* ── Status badge helper ─────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    available: { label: "Available", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    rented:    { label: "Rented",    cls: "bg-blue-100   text-blue-700   border-blue-200" },
    sold:      { label: "Sold",      cls: "bg-rose-100   text-rose-700   border-rose-200" },
    booked:    { label: "Booked",    cls: "bg-purple-100 text-purple-700 border-purple-200" },
  };
  const { label, cls } = map[status] || { label: "Available", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full border tracking-wider ${cls}`}>
      {label}
    </span>
  );
};

/* ── Visibility badge helper ─────────────────────────────────────── */
const VisibilityBadge = ({ isPublic, adminHidden }) => {
  if (adminHidden)
    return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full border bg-slate-800 text-white border-slate-700 tracking-wider">Admin Hidden</span>;
  if (isPublic)
    return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full border bg-green-100 text-green-700 border-green-200 tracking-wider">Public</span>;
  return <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full border bg-amber-100 text-amber-700 border-amber-200 tracking-wider">User Hidden</span>;
};

export default function AdminDashboard() {
  const [houses, setHouses]         = useState([]);
  const [rooms, setRooms]           = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [activeTab, setActiveTab]   = useState("houses");
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    Promise.all([fetchHouses(), fetchRooms(), fetchCommercials()])
      .finally(() => setLoading(false));
  }, []);

  const fetchHouses = async () => {
    try { const res = await API.get("/houses/admin/all"); setHouses(res.data); } catch {}
  };
  const fetchRooms = async () => {
    try { const res = await API.get("/rooms/admin/all"); setRooms(res.data); } catch {}
  };
  const fetchCommercials = async () => {
    try { const res = await API.get("/commercial/admin/all"); setCommercials(res.data); } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      if (activeTab === "houses") { await API.delete(`/houses/${id}`); setHouses(p => p.filter(h => h._id !== id)); }
      else if (activeTab === "rooms") { await API.delete(`/rooms/${id}`); setRooms(p => p.filter(r => r._id !== id)); }
      else { await API.delete(`/commercial/${id}`); setCommercials(p => p.filter(c => c._id !== id)); }
    } catch { alert("Failed to delete. Access Denied."); }
  };

  const handleToggleHide = async (id) => {
    try {
      if (activeTab === "houses") {
        const res = await API.put(`/houses/admin/toggle-hide/${id}`);
        setHouses(p => p.map(h => h._id === id ? res.data : h));
      } else if (activeTab === "rooms") {
        const res = await API.put(`/rooms/admin/toggle-hide/${id}`);
        setRooms(p => p.map(r => r._id === id ? res.data : r));
      } else {
        const res = await API.put(`/commercial/admin/toggle-hide/${id}`);
        setCommercials(p => p.map(c => c._id === id ? res.data : c));
      }
    } catch { alert("Failed to toggle. Access Denied."); }
  };

  const activeData = (activeTab === "houses" ? houses : activeTab === "rooms" ? rooms : commercials)
    .filter(item => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (item.title || "").toLowerCase().includes(q) ||
             (item.location || "").toLowerCase().includes(q) ||
             (item.owner?.name || "").toLowerCase().includes(q) ||
             (item.owner?.email || "").toLowerCase().includes(q);
    });

  const tabs = [
    { key: "houses",     label: "Residences",       icon: <FaHome />,     count: houses.length,     color: "text-blue-600",   ring: "ring-blue-500" },
    { key: "rooms",      label: "Hotels & Stays",    icon: <FaHotel />,    count: rooms.length,      color: "text-purple-600", ring: "ring-purple-500" },
    { key: "commercials",label: "Business / Industry",icon: <FaBuilding />,count: commercials.length, color: "text-amber-600",  ring: "ring-amber-500" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-gray-600">Loading Super Admin Panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4fb] font-inter">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] pt-14 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest mb-3">
                <FaShieldAlt className="text-[10px]" /> Super Admin
              </div>
              <h1 className="text-4xl font-black font-poppins tracking-tight text-white mb-1">Admin Portal</h1>
              <p className="text-blue-100/60 text-base font-medium">Full control over all platform listings.</p>
            </div>
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
              {tabs.map(t => (
                <div key={t.key} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center">
                  <p className={`text-2xl font-black text-white`}>{t.count}</p>
                  <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-16">
        {/* ── Tab Bar ───────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-white/20">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setSearch(""); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === t.key ? "bg-white text-gray-900 shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <span className={activeTab === t.key ? t.color : ""}>{t.icon}</span>
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === t.key ? "bg-gray-100 text-gray-700" : "bg-white/10 text-white/60"
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── Search ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 flex items-center gap-3 px-4 py-3">
          <FaSearch className="text-gray-300 text-sm flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by title, location, owner name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600 font-bold">Clear</button>
          )}
          <span className="text-xs text-gray-400 font-bold">{activeData.length} results</span>
        </div>

        {/* ── Table ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-widest font-black">
                  <th className="p-4 pl-6">Listing</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Listing Status</th>
                  <th className="p-4">User Visibility</th>
                  <th className="p-4">Admin Control</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeData.map(item => {
                  const price = item.pricePerNight || item.price;
                  const subtitle = activeTab === "houses"
                    ? `${item.houseType || "Property"} · For ${item.type || "—"}`
                    : activeTab === "rooms"
                    ? `${item.hotelName || "Hotel"} · ${item.roomType || "Room"}`
                    : `${item.commercialType || "Commercial"} · For ${item.type || "—"}`;

                  return (
                    <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Listing */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {item.images?.[0]
                              ? <img src={`http://localhost:5000${item.images[0]}`} className="w-full h-full object-cover" alt="" />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                                  {activeTab === "rooms" ? <FaHotel /> : activeTab === "commercials" ? <FaBuilding /> : <FaHome />}
                                </div>
                            }
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm line-clamp-1 max-w-[200px]">{item.title || "Untitled"}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider capitalize">{subtitle}</p>
                            {item.location && (
                              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <FaMapMarkerAlt className="text-[8px]" /> {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            <FaUser className="text-blue-500 text-[10px]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.owner?.name || "Unknown"}</p>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{item.owner?.email || "N/A"}</p>
                            {item.mobileNumber && (
                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <FaPhone className="text-[8px]" /> {item.mobileNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div>
                          <p className="font-black text-gray-900 text-base">₹{price?.toLocaleString() || "—"}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {activeTab === "rooms" ? "/night" : item.type === "rent" ? "/month" : "sale price"}
                          </p>
                        </div>
                      </td>

                      {/* Listing Status (Available / Rented / Sold) */}
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* User Visibility (isPublic toggle set by user) */}
                      <td className="p-4">
                        <VisibilityBadge isPublic={item.isPublic} adminHidden={false} />
                      </td>

                      {/* Admin Control (adminHidden) */}
                      <td className="p-4">
                        {item.adminHidden
                          ? <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase rounded-full bg-red-100 text-red-700 border border-red-200 tracking-wider"><LuBadgeX size={12} /> Restricted</span>
                          : <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase rounded-full bg-green-100 text-green-700 border border-green-200 tracking-wider"><LuBadgeCheck size={12} /> Allowed</span>
                        }
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleHide(item._id)}
                            title={item.adminHidden ? "Restore Visibility" : "Admin Hide from Marketplace"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              item.adminHidden
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-500 hover:text-white border border-slate-200"
                            }`}
                          >
                            {item.adminHidden ? <><FaEye size={11} /> Restore</> : <><FaEyeSlash size={11} /> Hide</>}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            title="Permanently Delete"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 transition-all"
                          >
                            <FaTrash size={11} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {activeData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <FaExclamationTriangle className="text-4xl opacity-30" />
                        <p className="font-bold">No listings found{search ? ` for "${search}"` : ""}.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {activeData.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-bold">
                Showing <span className="text-gray-700">{activeData.length}</span> of <span className="text-gray-700">
                  {activeTab === "houses" ? houses.length : activeTab === "rooms" ? rooms.length : commercials.length}
                </span> listings
              </p>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Rented</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Sold</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700 inline-block" /> Admin Hidden</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
