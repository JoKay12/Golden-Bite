import { track } from "@vercel/analytics";

/**
 * Visitor stats events, shown in Vercel → Analytics → Events. Only counts and menu facts are sent:
 * never names, phone numbers, locations or notes. Off Vercel (local, tests) the call does nothing
 * useful and never throws.
 */
type Events = {
  "Add to basket": { dish: string; price: number };
  "Order sent": { items: number; total: number; fulfilment: string; payment: string };
  Reorder: { items: number; total: number };
  "Catering enquiry": { eventType: string; guests: number };
};

export function trackEvent<K extends keyof Events>(name: K, data: Events[K]) {
  try {
    track(name, data);
  } catch {
    // Analytics must never break ordering.
  }
}
