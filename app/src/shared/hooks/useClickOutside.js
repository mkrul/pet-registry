import { useEffect, useRef } from 'react';

const useClickOutside = ({ isOpen, onClose, excludeRef }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      if (!ref.current) return;

      if (excludeRef && excludeRef.current && excludeRef.current.contains(target)) {
        return;
      }

      if (target instanceof Element) {
        const isMaterialUIPortal = target.closest('[data-mui-portal]') ||
                                   target.closest('.MuiPopper-root') ||
                                   target.closest('.MuiModal-root') ||
                                   target.closest('.MuiBackdrop-root');

        if (isMaterialUIPortal) {
          return;
        }
      }

      if (!ref.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, excludeRef]);

  return ref;
};

export default useClickOutside;
