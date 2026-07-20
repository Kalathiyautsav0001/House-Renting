import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Prevent the browser from trying to restore scroll position automatically
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top on every navigation (including Back/Forward)
    // Using a micro-delay to ensure the scroll happens AFTER the browser's own internal navigation handling
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return null;
}
