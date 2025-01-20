import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { store } from "../redux/store";

export const useScrollRestoration = () => {
  const scrollPosition = useAppSelector(state => state.search.scrollPosition);

  useEffect(() => {
    console.log("useScrollRestoration - Initial mount", {
      currentScrollY: window.scrollY,
      reduxScrollPosition: store.getState().search.scrollPosition
    });

    // Use requestAnimationFrame to ensure the scroll happens after render
    if (scrollPosition > 0) {
      requestAnimationFrame(() => {
        console.log("useScrollRestoration - Scrolling to position", {
          scrollPosition,
          currentScrollY: window.scrollY
        });
        window.scrollTo(0, scrollPosition);
      });
    }

    return () => {
      console.log("useScrollRestoration - Cleanup", {
        finalScrollY: window.scrollY,
        reduxScrollPosition: store.getState().search.scrollPosition
      });
    };
  }, [scrollPosition]);
};
