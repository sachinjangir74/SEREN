import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, we want to scroll to it, otherwise scroll to top.
    // However, since AnimatePresence handles the exit animation, 
    // doing a brute force scrollTo here might jump the scroll before the exit animation finishes.
    // But it's good as a fallback if AnimatePresence misses something.
    if (!hash) {
      // Small timeout to allow AnimatePresence to finish if it's coordinating
      setTimeout(() => {
         window.scrollTo(0, 0);
      }, 0);
    }
  }, [pathname, hash]);

  return null;
}
