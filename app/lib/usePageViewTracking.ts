import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logAnalyticsEvent } from './analytics';

/**
 * Hook to automatically track page views
 */
export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Log page view
    logAnalyticsEvent('page_view', `Page: ${pathname}`);
  }, [pathname]);
}
