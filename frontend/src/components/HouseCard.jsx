// import { Link } from "react-router-dom";
// import Slider from "react-slick";

// export default function HouseCard({ house, isOwner, onDelete }) {
//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };

//   return (
//     <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl">
//       {/* Image Carousel */}
//       {house.images && house.images.length > 0 && (
//         <div className="relative">
//           <Slider {...carouselSettings}>
//             {house.images.map((img, idx) => (
//               <div key={idx} className="h-56 overflow-hidden md:h-64">
//                 <img
//                   src={`http://localhost:5000${img}`}
//                   alt={house.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             ))}
//           </Slider>
//           <div className="absolute px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full top-3 left-3">
//             ${house.price}/mo
//           </div>
//         </div>
//       )}

//       <div className="p-5">
//         {/* Title and Location */}
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-gray-800 truncate">{house.title}</h3>
//           <p className="flex items-center text-gray-600">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             {house.location}
//           </p>
//         </div>

//         {/* Property Details */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             {house.type}
//           </div>
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//             </svg>
//             {house.houseType}
//           </div>
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//             </svg>
//             {house.bedrooms} Bed
//           </div>
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             {house.bathrooms} Bath
//           </div>
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
//             </svg>
//             {house.area} sq ft
//           </div>
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//             {house.furnished ? "Furnished" : "Not Furnished"}
//           </div>
//         </div>

//         {/* Amenities */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {house.parking && (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               Parking Available
//             </span>
//           )}
//         </div>

//         {/* Description */}
//         <p className="mb-6 text-gray-600 line-clamp-2">{house.description}</p>

//         {/* Owner actions */}
//         {isOwner && (
//           <div className="flex gap-2 pt-4 border-t border-gray-100">
//             <Link
//               to={`/edit-house/${house._id}`}
//               className="flex items-center justify-center flex-1 px-4 py-2 font-medium text-center text-white transition-colors duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//               </svg>
//               Edit
//             </Link>
//             <button
//               onClick={() => onDelete(house._id)}
//               className="flex items-center justify-center flex-1 px-4 py-2 font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















// ----------------after responsive
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { getImageUrl } from "../utils/api";

export default function HouseCard({ house, isOwner, onDelete }) {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl">
      {/* Image Carousel */}
      {house.images && house.images.length > 0 && (
        <div className="relative">
          <Slider {...carouselSettings}>
            {house.images.map((img, idx) => (
              <div
                key={idx}
                className="h-40 overflow-hidden sm:h-52 md:h-64 lg:h-72"
              >
                <img
                  src={getImageUrl(img)}
                  alt={house.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </Slider>
          {/* Price badge — top left */}
          <div className="absolute z-20 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full top-3 left-3 sm:text-sm shadow-lg">
            ₹{house.price?.toLocaleString()}
            {house.type === "rent" && <span className="text-[10px] opacity-70">/mo</span>}
          </div>

          {/* Condition badge — top right */}
          {house.condition && (
            <div className="absolute z-20 px-2.5 py-1 text-[10px] sm:text-xs font-black text-white bg-black/60 backdrop-blur-md rounded-lg top-3 right-3 shadow-lg border border-white/20 flex items-center gap-1.5">
              <span>
                {house.condition === "brand_new" && "💎"}
                {house.condition === "newly_renovated" && "✨"}
                {house.condition === "well_maintained" && "✅"}
                {house.condition === "good" && "👍"}
                {house.condition === "fair" && "⚠️"}
                {house.condition === "needs_repair" && "🛠️"}
              </span>
              <span className="uppercase tracking-tighter">
                {house.condition.replace(/_/g, " ")}
              </span>
            </div>
          )}

          {/* Availability Overlay */}
          {house.status && house.status !== 'available' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
               <div className="px-4 py-1.5 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-xl transform -rotate-12 shadow-2xl">
                  <span className="text-white text-base sm:text-lg font-black uppercase tracking-wider drop-shadow-md">
                    {house.status === 'rented' ? 'HOUSE RENTED' : 'HOUSE SOLD'}
                  </span>
               </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 truncate sm:text-xl">
            {house.title}
          </h3>
          <p className="flex items-center text-xs text-gray-600 sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 mr-1 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {house.location}
          </p>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-700 sm:grid-cols-3">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {house.type}
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {house.houseType}
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            {house.bedrooms} Bed
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {house.bathrooms} Bath
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
            {house.area} sq ft
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 text-blue-500 sm:w-5 sm:h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {house.furnished ? "Furnished" : "Not Furnished"}
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {house.parking && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Parking Available
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mb-6 text-xs text-gray-600 line-clamp-2 sm:text-sm md:text-base">
          {house.description}
        </p>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 sm:flex-row">
            <Link
              to={`/edit-house/${house._id}`}
              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-colors duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600 sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => onDelete(house._id)}
              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-red-600 rounded-lg hover:bg-red-700 sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
