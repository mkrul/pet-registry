import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { store } from "../redux/store";

export const useScrollRestoration = () => {
  const scrollPosition = useAppSelector(state => state.search.scrollPosition);

  useEffect(() => {
    if (scrollPosition > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPosition);
      });
    }

    return () => {};
  }, [scrollPosition]);
};
