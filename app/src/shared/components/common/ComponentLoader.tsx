import { PropsWithChildren, Suspense } from "react";
import { CircularProgress } from "@mui/material";

interface ComponentLoaderProps extends PropsWithChildren {
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex justify-center items-center min-h-[200px]" role="status" aria-live="polite">
    <CircularProgress aria-label="Loading content" />
  </div>
);

const ComponentLoader = ({ children, fallback = <DefaultFallback /> }: ComponentLoaderProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default ComponentLoader;
