import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setComponentsLoading } from "../../redux/features/loading/loadingSlice";

interface ComponentLoaderProps {
  children: React.ReactNode;
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setComponentsLoading(true));

    // Use requestAnimationFrame to wait for next paint
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dispatch(setComponentsLoading(false));
      });
    });

    return () => {
      cancelAnimationFrame(timer);
      dispatch(setComponentsLoading(true));
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default ComponentLoader;
