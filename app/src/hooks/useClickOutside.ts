import { useEffect, useRef } from 'react';

interface UseClickOutsideProps {
  isOpen: boolean;
  onClose: () => void;
  excludeRef?: React.RefObject<HTMLElement>;
}

const useClickOutside = ({ isOpen, onClose, excludeRef }: UseClickOutsideProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

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
