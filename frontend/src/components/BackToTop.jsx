import { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 z-[999] transition-all duration-500 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
      <button
        onClick={scrollToTop}
        className="group relative flex items-center justify-center w-14 h-14 bg-white text-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 hover:bg-brand-blue hover:text-white transition-all duration-300 active:scale-90"
        aria-label="Scroll to top"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-brand-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col items-center">
            <FaChevronUp className="text-xl group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1 hidden sm:block">TOP</span>
        </div>
      </button>
    </div>
  );
}
