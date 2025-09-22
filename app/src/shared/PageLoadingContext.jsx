import React, { createContext, useContext, useState, useEffect } from "react";

const PageLoadingContext = createContext({
  setPageReady: () => {},
  isPageReady: false
});

export const PageLoadingProvider = ({ children }) => {
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
