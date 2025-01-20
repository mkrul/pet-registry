import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

export const useScrollRestoration = () => {
  const scrollPosition = useAppSelector(state => state.search.scrollPosition);

  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [scrollPosition]);
};
