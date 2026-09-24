/**
 * Catering enquiry: validation and the WhatsApp message. Pure functions, unit tested.
 */

export const EVENT_TYPES = [
  "Birthday or party",
  "Wedding or engagement",
  "Funeral",
  "Church or naming ceremony",
  "Office or meeting",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type CateringEnquiry = {
  name: string;
  /** YYYY-MM-DD from <input type="date">. */
  date: string;
  guests: string;
  eventType: EventType;
  location: string;
  budget: string;
  notes: string;
};

export const emptyEnquiry: CateringEnquiry = {
  name: "",
  date: "",
  guests: "",
  eventType: "Birthday or party",
  location: "",
  budget: "",
  notes: "",
};

export const MAX_GUESTS = 5000;

export type EnquiryErrors = Partial<
  Record<"name" | "date" | "guests" | "location" | "budget", string>
>;

/** `today` is YYYY-MM-DD in Africa/Accra time. */
export function validateEnquiry(e: CateringEnquiry, today: string): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (e.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) errors.date = "Please choose the event date.";
  else if (e.date < today) errors.date = "The event date can’t be in the past.";
  const guests = Number(e.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    errors.guests = "Please enter the number of guests.";
  }
  if (e.location.trim().length < 3) errors.location = "Please enter the event location.";
  if (e.budget.trim() && !(Number(e.budget) > 0))
    errors.budget = "Enter the budget in cedis, e.g. 3000.";
  return errors;
}

const clean = (text: string, max = 200) => text.replace(/\s+/g, " ").trim().slice(0, max);

/** "2026-12-05" → "Saturday, 5 December 2026". */
export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function buildCateringMessage(e: CateringEnquiry): string {
  const lines = [
    "Hello Golden Bite! I would like to enquire about catering.",
    "",
    `Name: ${clean(e.name, 80)}`,
    `Event: ${e.eventType}`,
    `Date: ${formatEventDate(e.date)}`,
    `Guests: ${Number(e.guests)}`,
    `Location: ${clean(e.location)}`,
  ];
  if (e.budget.trim()) lines.push(`Budget: about GH₵${Number(e.budget).toLocaleString("en-GH")}`);
  const notes = clean(e.notes, 400);
  if (notes) lines.push(`Notes: ${notes}`);
  lines.push("", "Please let me know the options and prices.");
  return lines.join("\n");
}

/** Today's date as YYYY-MM-DD in the given time zone. */
export function todayIn(timeZone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(now);
}
