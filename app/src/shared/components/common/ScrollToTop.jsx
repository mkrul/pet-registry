import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const isMessagesNavigation = pathname.startsWith('/dashboard/messages') && prevPathname.startsWith('/dashboard/messages');

    if (!isMessagesNavigation) {
      window.scrollTo(0, 0);
    }

    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
