import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 *
 * This component listens for route changes and scrolls the window to the top
 * whenever the pathname changes.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top-left corner of the window
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
