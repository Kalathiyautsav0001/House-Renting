// import React, { useEffect, useState } from "react";
// import API from "../api";
// import HouseCard from "../components/HouseCard";

// export default function Home() {
//   const [houses, setHouses] = useState([]);

//   const fetchHouses = async () => {
//     try {
//       const { data } = await API.get("/houses");
//       setHouses(data);
//     } catch (err) {
//       console.error("Error fetching houses:", err);
//     }
//   };

//   useEffect(() => {
//     fetchHouses();
//   }, []);

//   if (houses.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
//         <img
//           src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" // Optional stylish image
//           alt="No houses"
//           className="w-48 h-48 mb-6 animate-bounce"
//         />
//         <h1 className="mb-2 text-3xl font-bold text-gray-700">
//           No Houses Available
//         </h1>
//         <p className="mb-4 text-gray-500">
//           It looks like no houses have been added yet.
//         </p>
//         <button
//           onClick={fetchHouses}
//           className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//         >
//           Refresh
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       {houses.map((house) => (
//         <HouseCard key={house._id} house={house} fetchHouses={fetchHouses} />
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import HouseCard from "../components/HouseCard";
import InfoPopup from "../components/InfoPopup"; // 👈 import popup

// --- Skeleton Component for Loading State ---
const HouseCardSkeleton = () => (
  <div className="overflow-hidden bg-white rounded-lg shadow-md animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="p-6">
      <div className="w-3/4 h-4 mb-4 bg-gray-300 rounded"></div>
      <div className="w-1/2 h-3 mb-2 bg-gray-300 rounded"></div>
      <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
      <div className="flex items-center justify-between mt-6">
        <div className="w-24 h-8 bg-gray-300 rounded"></div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Home Component ---
export default function Home() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/houses");
      setHouses(data);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="max-w-6xl p-4 mx-auto sm:p-6 lg:p-8">
        <InfoPopup /> {/* 👈 Popup will still show while loading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Our Properties</h1>
          <p className="mt-2 text-lg text-gray-500">
            Loading the best homes for you...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <HouseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <InfoPopup /> {/* 👈 Popup included */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 mb-4 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="mb-2 text-3xl font-bold text-gray-700">
          Oops! Something went wrong.
        </h1>
        <p className="mb-6 text-gray-500">{error}</p>
        <button
          onClick={fetchHouses}
          className="px-6 py-3 font-bold text-white transition-transform transform bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- Render Empty State ---
  if (houses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <InfoPopup /> {/* 👈 Popup included */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No houses found"
          className="w-48 h-48 mb-6 opacity-70"
        />
        <h1 className="mb-2 text-3xl font-bold text-gray-700">No Houses Found</h1>
        <p className="mb-6 text-gray-500">
          It looks like there are no properties available at the moment.
        </p>
        <button
          onClick={fetchHouses}
          className="px-6 py-3 font-bold text-white transition-transform transform bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 hover:scale-105"
        >
          Check Again
        </button>
      </div>
    );
  }

  // --- Render Data State ---
  return (
    <div className="min-h-screen bg-gray-50">
      <InfoPopup /> {/* 👈 Popup always rendered on Home page */}
      <div className="max-w-6xl p-4 mx-auto sm:p-6 lg:p-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Featured Properties
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Find your next home from our exclusive collection.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {houses.map((house) => (
            <HouseCard
              key={house._id}
              house={house}
              fetchHouses={fetchHouses}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
