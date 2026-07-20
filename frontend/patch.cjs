const fs = require('fs');
const file = 'c:/Users/VISHAL/Desktop/utsav/rentingweb/house-rent-sell/frontend/src/pages/MyHouses.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const totalRent = activeTab === \'houses\' ? houses.filter(h => h.type === \'rent\').length : rooms.length;',
  'const totalRent = activeTab === \'houses\' ? houses.filter(h => h.type === \'rent\').length : rooms.filter(r => r.status === \'available\').length;'
);

content = content.replace(
  '<p className="text-blue-200/60 font-medium text-base">\n                Manage, monitor &amp; control all your listings\n              </p>',
  '<p className="text-blue-200/60 font-medium text-base">\n                Manage, monitor &amp; control all your listings\n              </p>\n              <div className="mt-6 flex space-x-3">\n                 <button onClick={() => setActiveTab(\'houses\')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === \'houses\' ? \'bg-brand-blue text-white shadow-lg\' : \'bg-white/10 text-white hover:bg-white/20\'}`}>Houses</button>\n                 <button onClick={() => setActiveTab(\'hotels\')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === \'hotels\' ? \'bg-brand-blue text-white shadow-lg\' : \'bg-white/10 text-white hover:bg-white/20\'}`}>Hotel Rooms</button>\n              </div>'
);

content = content.replace(
  '{ label: "Total",   value: houses.length, color: "from-blue-500 to-blue-700",     icon: <FaBuilding /> },',
  '{ label: "Total",   value: activeTab === \'houses\' ? houseStats.total : roomStats.total, color: "from-blue-500 to-blue-700",     icon: <FaBuilding /> },'
);

content = content.replace(
  '{ label: "For Rent",value: totalRent,     color: "from-violet-500 to-purple-600", icon: <FaHome /> },',
  '{ label: activeTab === \'houses\' ? "For Rent" : "Available", value: totalRent,     color: "from-violet-500 to-purple-600", icon: <FaHome /> },'
);

fs.writeFileSync(file, content);
console.log('Patched UI elements.');
