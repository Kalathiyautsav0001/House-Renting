import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuBuilding, LuBed } from "react-icons/lu";

/**
 * MarketplaceToggle - A unified switch to toggle between Residential and Hotel marketplaces.
 * @param {boolean} mobile - If true, renders a full-width mobile version.
 * @param {string} variant - 'default' for Navbar, 'hero' for a 3D glassmorphic look in page headers.
 * @param {function} onSelect - Callback function to execute when a selection is made (e.g. to close the menu).
 */
const MarketplaceToggle = ({ mobile = false, variant = "default", onSelect }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // 3D Glassmorphic styles for Hero sections
  const isHero = variant === "hero";

  const containerClasses = isHero
    ? `grid grid-cols-3 gap-1 sm:gap-1.5 bg-white/5 backdrop-blur-xl p-1.5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500 scale-100 hover:scale-[1.02] w-full max-w-[480px] mx-auto`
    : `grid grid-cols-3 gap-1 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50 transition-all duration-300 w-full max-w-[420px] mx-auto`;

  const linkBaseClasses = `flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2.5 sm:py-2 px-1 sm:px-4 rounded-[14px] font-bold transition-all duration-500 relative overflow-hidden group text-[10px] sm:text-[13px]`;
  
  // Theme-aware active classes for Hero variant
  const getActiveClasses = (path) => {
    if (!isHero) return "bg-white text-brand-blue shadow-sm ring-1 ring-black/5 font-black";
    
    if (path === "/") {
      return "bg-brand-blue text-white shadow-[0_10px_30px_rgba(13,110,253,0.3)] ring-1 ring-white/20";
    }
    if (path === "/rooms") {
      return "bg-purple-600 text-white shadow-[0_10px_30px_rgba(147,51,234,0.3)] ring-1 ring-white/20";
    }
    return "bg-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] ring-1 ring-white/20";
  };

  const inactiveClasses = isHero
    ? "text-gray-400 hover:text-white hover:bg-white/5"
    : "text-gray-500 hover:text-gray-900";

  return (
    <div className={containerClasses}>
      <Link
        to="/"
        onClick={onSelect}
        className={`${linkBaseClasses} ${isActive("/") ? getActiveClasses("/") : inactiveClasses}`}
      >
        <LuBuilding className={`size-4 sm:size-5 ${isActive("/") ? (isHero ? "text-white" : "text-brand-blue") : "opacity-60 group-hover:opacity-100"}`} />
        <span className="leading-tight">Residences</span>
      </Link>
      <Link
        to="/rooms"
        onClick={onSelect}
        className={`${linkBaseClasses} ${isActive("/rooms") ? getActiveClasses("/rooms") : inactiveClasses}`}
      >
        <LuBed className={`size-4 sm:size-5 ${isActive("/rooms") ? (isHero ? "text-white" : "text-brand-blue") : "opacity-60 group-hover:opacity-100"}`} />
        <span className="leading-tight">Hotels</span>
      </Link>
      <Link
        to="/business"
        onClick={onSelect}
        className={`${linkBaseClasses} ${isActive("/business") ? getActiveClasses("/business") : inactiveClasses}`}
      >
        <LuBuilding className={`size-4 sm:size-5 ${isActive("/business") ? (isHero ? "text-white" : "text-brand-blue") : "opacity-60 group-hover:opacity-100"}`} />
        <span className="leading-tight">Business</span>
      </Link>
    </div>
  );
};

export default MarketplaceToggle;
