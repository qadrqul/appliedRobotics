import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useRouteTransition(callback: () => void) {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    // Execute callback
    callback();
  }, [location, callback]);
}