import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setScrollPosition } from "../../redux/features/search/searchSlice";

/**
 * ScrollToTop Component
 *
 * This component listens for route changes and scrolls the window to the top
 * whenever the pathname changes.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const savedScrollPosition = useAppSelector(state => state.search.scrollPosition);

  useEffect(() => {
    // Save scroll position when navigating away from reports index
    if (pathname !== "/") {
      dispatch(setScrollPosition(window.scrollY));
    }

    // Restore scroll position when returning to reports index
    if (pathname === "/") {
      window.scrollTo(0, savedScrollPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, dispatch, savedScrollPosition]);

  return null;
};

export default ScrollToTop;
