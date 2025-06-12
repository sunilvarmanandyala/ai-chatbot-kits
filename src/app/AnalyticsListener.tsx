'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Minimal `gtag('config',…)` signature
type GtagConfig = (command: 'config', id: string, options: { page_path: string }) => void;

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;

export default function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID) return;
    // Cast window to include our gtag signature
    const w = window as Window & { gtag?: GtagConfig };
    w.gtag?.('config', GA_ID, { page_path: pathname });
  }, [pathname]);

  return null;
}
