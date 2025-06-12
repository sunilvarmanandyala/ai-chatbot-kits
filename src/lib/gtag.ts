// Measurement ID from env
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;

// Define the combined signature for gtag
interface GtagFn {
  (command: 'config', id: string, options: { page_path: string }): void;
  (command: 'event', action: string, params: {
    event_category: string;
    event_label: string;
    value?: number;
  }): void;
}

/** Manually send a page_view if needed */
export function pageview(url: string) {
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.('config', GA_ID, { page_path: url });
}

interface EventParams {
  action: string;
  category: string;
  label: string;
  value?: number;
}

/** Fire a custom GA4 event */
export function event({ action, category, label, value }: EventParams) {
  const w = window as Window & { gtag?: GtagFn };
  w.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}
