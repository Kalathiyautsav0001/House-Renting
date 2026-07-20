import { useState, useEffect } from "react";
import API from "../utils/api";
import { FaTrash, FaCheckCircle, FaExclamationTriangle, FaEyeSlash, FaEye } from "react-icons/fa";

export default function AdminDashboard() {
  const [houses, setHouses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("houses");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHouses();
    fetchRooms();
  }, []);

  const fetchHouses = async () => {
    try {
      const res = await API.get("/houses/admin/all");
      setHouses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms/admin/all");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (houses.length >= 0) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete this listing?")) return;
    try {
      if (activeTab === 'houses') {
        await API.delete(`/houses/${id}`);
        setHouses(houses.filter((h) => h._id !== id));
      } else {
        await API.delete(`/rooms/${id}`);
        setRooms(rooms.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Access Denied.");
    }
  };

  const handleToggleHide = async (id) => {
    try {
      if (activeTab === 'houses') {
        const res = await API.put(`/houses/admin/toggle-hide/${id}`);
        setHouses(houses.map(h => h._id === id ? res.data : h));
      } else {
        const res = await API.put(`/rooms/admin/toggle-hide/${id}`);
        setRooms(rooms.map(r => r._id === id ? res.data : r));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to toggle visibility. Access Denied.");
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-2xl text-brand-blue">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Cinematic Header */}
      <div className="bg-gradient-to-br from-[#0b1629] via-[#0f2748] to-[#0b1629] pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-4xl font-black font-poppins mb-2 tracking-tight flex items-center gap-3 text-white drop-shadow-sm">
              <FaCheckCircle className="text-status-green drop-shadow-sm" /> Super Admin Portal
            </h1>
            <p className="text-blue-100/80 text-lg mt-1 font-medium">Manage all properties across the platform.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 flex items-center gap-4">
             <div>
               <p className="text-blue-200/50 text-xs font-bold uppercase tracking-wider">Total Database Listings</p>
               <p className="text-white text-2xl font-black">{activeTab === "houses" ? houses.length : rooms.length}</p>
             </div>
             <div className="w-px h-10 bg-white/10 mx-2"></div>
             <FaExclamationTriangle className="text-yellow-400 text-3xl opacity-80" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14">
        {/* Tabs */}
        <div className="flex gap-2 mb-4 bg-white/10 backdrop-blur-md p-1 rounded-2xl w-fit border border-white/20">
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'houses' ? 'bg-white text-brand-blue shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            Residences
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'rooms' ? 'bg-white text-brand-blue shadow-md' : 'text-white/70 hover:text-white'
            }`}
          >
            Hotels & Stays
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-bold">
                   <th className="p-4 pl-6">Property</th>
                   <th className="p-4">Owner Contact</th>
                   <th className="p-4">Price</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(activeTab === 'houses' ? houses : rooms).map(item => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="p-4 pl-6">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                           {item.images?.[0] ? <img src={`http://localhost:5000${item.images[0]}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100"></div>}
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title || 'Untitled'}</p>
                           <p className="text-xs text-brand-blue font-semibold uppercase">
                             {activeTab === 'houses' ? `${item.type} • ${item.houseType}` : `${item.hotelName || 'Hotel'} • ${item.roomType}`}
                           </p>
                         </div>
                       </div>
                     </td>
                     <td className="p-4">
                        <p className="text-sm font-bold text-gray-800">{item.owner?.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{item.owner?.email || 'N/A'}</p>
                     </td>
                     <td className="p-4">
                        <span className="font-black text-gray-900">₹{(item.price || item.pricePerNight)?.toLocaleString()}</span>
                     </td>
                     <td className="p-4">
                        {item.adminHidden ? (
                          <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wider bg-slate-800 text-white">
                            Admin Hidden
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${item.isPublic ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.isPublic ? 'Public' : 'Hidden'}
                          </span>
                        )}
                     </td>
                     <td className="p-4 pr-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleToggleHide(item._id)} 
                           className={`p-2 rounded-lg transition-colors inline-flex ${item.adminHidden ? 'text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-400 hover:bg-slate-100 hover:text-slate-600'}`}
                           title={item.adminHidden ? 'Restore Visibility' : 'Hide from Marketplace'}
                         >
                           {item.adminHidden ? <FaEye /> : <FaEyeSlash />}
                         </button>
                         <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex" title="Delete">
                           <FaTrash />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
                {(activeTab === 'houses' ? houses : rooms).length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No {activeTab === 'houses' ? 'properties' : 'hotels/rooms'} found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
