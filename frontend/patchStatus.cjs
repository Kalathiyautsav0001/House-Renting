const fs = require('fs');
const file = 'c:/Users/VISHAL/Desktop/utsav/rentingweb/house-rent-sell/frontend/src/pages/MyHouses.jsx';
let content = fs.readFileSync(file, 'utf8');

const houseStatusFixTarget = `onClick={() => updateStatus(h._id, status.id)}`;
content = content.replace(houseStatusFixTarget, `onClick={() => updateHouseStatus(h._id, status.id)}`);

const updateFunctionTarget = `  // ── Status Updates (Sold/Rented for House, etc) ──────────────────────────
  const updateHouseStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(\`/houses/\${id}\`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHouses((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error("Error updating house status:", err);
    }
  };`;

const newFunctions = `  // ── Status Updates (Sold/Rented for House, etc) ──────────────────────────
  const updateHouseStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(\`/houses/\${id}\`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHouses((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error("Error updating house status:", err);
    }
  };

  const updateRoomStatus = async (id, newStatus) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await API.put(\`/rooms/\${id}\`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRooms((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error("Error updating room status:", err);
    }
  };`;

content = content.replace(updateFunctionTarget, newFunctions);

const statusUItarget = `                    {r.adminHidden ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-red-50 text-red-600 border border-red-200 text-center px-4 cursor-not-allowed">
                        <FaExclamationTriangle className="text-lg flex-shrink-0" />
                        <span>Hidden by Super Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button`;

const statusUIreplacement = `                    {r.adminHidden ? (
                      <div className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-red-50 text-red-600 border border-red-200 text-center px-4 cursor-not-allowed">
                        <FaExclamationTriangle className="text-lg flex-shrink-0" />
                        <span>Hidden by Super Admin</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Status Selection (Available / Booked / Closed) */}
                        <div className="grid grid-cols-3 gap-2">
                           {[
                             { id: 'available', label: 'Available', icon: <FaCheckCircle/>, activeClass: 'bg-emerald-500 text-white border-emerald-500', inactiveClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
                             { id: 'booked', label: 'Booked', icon: <FaHome/>, activeClass: 'bg-orange-500 text-white border-orange-500', inactiveClass: 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' },
                             { id: 'closed', label: 'Closed', icon: <FaTag/>, activeClass: 'bg-red-500 text-white border-red-500', inactiveClass: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' },
                           ].map((status) => (
                             <button
                               key={status.id}
                               onClick={() => updateRoomStatus(r._id, status.id)}
                               className={\`flex flex-col items-center justify-center py-2 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-200 \${r.status === status.id ? status.activeClass : status.inactiveClass}\`}
                             >
                               <span className="text-xs mb-1">{status.icon}</span>
                               {status.label}
                             </button>
                           ))}
                        </div>

                        <button`;

content = content.replace(statusUItarget, statusUIreplacement);

fs.writeFileSync(file, content);
console.log('Script done');
