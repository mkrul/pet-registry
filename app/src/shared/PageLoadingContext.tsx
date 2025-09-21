import React, { createContext, useContext, useState, useEffect } from "react";

interface PageLoadingContextType {
  setPageReady: (ready: boolean) => void;
  isPageReady: boolean;
}

const PageLoadingContext = createContext<PageLoadingContextType>({
  setPageReady: () => {},
  isPageReady: false
});

export const PageLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPageReady, setIsPageReady] = useState(false);

  // Reset ready state on route changes
  useEffect(() => {
    setIsPageReady(false);
    return () => setIsPageReady(false);
  }, [window.location.pathname]);

  return (
    <PageLoadingContext.Provider value={{ isPageReady, setPageReady: setIsPageReady }}>
      {children}
    </PageLoadingContext.Provider>
  );
};

export const usePageLoading = () => useContext(PageLoadingContext);
