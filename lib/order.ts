/**
 * Pure basket, checkout and opening-hours logic. No React here, so it is easy to unit test.
 */

export type CartLine = {
  /** itemId + price, so the same meal at two portion sizes stays as two lines. */
  key: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
};

export type Fulfilment = "Delivery" | "Pickup";
export type PaymentTiming = "Before delivery" | "On delivery";

export type OrderDetails = {
  name: string;
  fulfilment: Fulfilment;
  /** Area and landmark in Techiman. Required for delivery. */
  location: string;
  payment: PaymentTiming;
  notes: string;
};

export const emptyDetails: OrderDetails = {
  name: "",
  fulfilment: "Delivery",
  location: "",
  payment: "On delivery",
  notes: "",
};

export const MAX_QTY = 50;

export const lineKey = (itemId: string, price: number) => `${itemId}@${price}`;

export function addToCart(
  cart: CartLine[],
  item: { id: string; name: string },
  price: number,
): CartLine[] {
  const key = lineKey(item.id, price);
  const existing = cart.find((line) => line.key === key);
  if (existing) {
    return cart.map((line) =>
      line.key === key ? { ...line, qty: Math.min(line.qty + 1, MAX_QTY) } : line,
    );
  }
  return [...cart, { key, itemId: item.id, name: item.name, price, qty: 1 }];
}

/** Sets a line's quantity. Zero or less removes the line. */
export function setQty(cart: CartLine[], key: string, qty: number): CartLine[] {
  if (qty <= 0) return cart.filter((line) => line.key !== key);
  return cart.map((line) => (line.key === key ? { ...line, qty: Math.min(qty, MAX_QTY) } : line));
}

export const cartCount = (cart: CartLine[]) => cart.reduce((sum, line) => sum + line.qty, 0);

export const cartTotal = (cart: CartLine[]) =>
  cart.reduce((sum, line) => sum + line.price * line.qty, 0);

export const formatCedis = (amount: number) => `GH₵${amount.toLocaleString("en-GH")}`;

/** "On delivery" reads as "At pickup" when the customer is collecting the order. */
export function paymentLabel(
  details: Pick<OrderDetails, "fulfilment" | "payment">,
  payment = details.payment,
) {
  if (details.fulfilment === "Delivery") return payment;
  return payment === "On delivery" ? "At pickup" : "Before pickup";
}

export type DetailErrors = Partial<Record<"name" | "location", string>>;

export function validateDetails(details: OrderDetails): DetailErrors {
  const errors: DetailErrors = {};
  if (details.name.trim().length < 2) errors.name = "Please enter your name.";
  if (details.fulfilment === "Delivery" && details.location.trim().length < 3) {
    errors.location = "Please enter your area and a landmark for delivery.";
  }
  return errors;
}

/** Keeps customer text on one tidy line and stops it from breaking the message layout. */
const clean = (text: string, max = 200) => text.replace(/\s+/g, " ").trim().slice(0, max);

export function buildOrderMessage(
  cart: CartLine[],
  details: OrderDetails,
  momo: { number: string; network: string },
): string {
  if (cart.length === 0) return "Hello Golden Bite! I would like to place an order.";

  const lines = cart.map(
    (line) =>
      `• ${line.qty} × ${line.name} (${formatCedis(line.price)}) = ${formatCedis(line.price * line.qty)}`,
  );

  const parts = [
    "Hello Golden Bite! I would like to place an order.",
    "",
    ...lines,
    "",
    `Food total: ${formatCedis(cartTotal(cart))}`,
    "",
    `Name: ${clean(details.name, 80)}`,
    `Fulfilment: ${details.fulfilment}`,
  ];
  if (details.fulfilment === "Delivery") {
    parts.push(`Delivery location: ${clean(details.location)}`);
  }
  parts.push(`Payment: ${momo.network} (${momo.number}), ${paymentLabel(details).toLowerCase()}`);
  const notes = clean(details.notes, 300);
  if (notes) parts.push(`Notes: ${notes}`);
  parts.push(
    "",
    details.fulfilment === "Delivery"
      ? "Please confirm my order and the delivery fee."
      : "Please confirm my order.",
  );
  return parts.join("\n");
}

export type Hours = {
  timeZone: string;
  days: readonly number[];
  opensAt: number;
  closesAt: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Day of week (0 = Sunday) and fractional hour of `date` in the restaurant's time zone. */
export function localTime(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: WEEKDAYS.indexOf(get("weekday")),
    hour: Number(get("hour")) + Number(get("minute")) / 60,
  };
}

export function isOpen(date: Date, hours: Hours): boolean {
  const { day, hour } = localTime(date, hours.timeZone);
  return hours.days.includes(day) && hour >= hours.opensAt && hour < hours.closesAt;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "today at 11 AM", "tomorrow at 11 AM" or "Monday at 11 AM". Assumes the restaurant is closed. */
export function nextOpening(date: Date, hours: Hours): string {
  const { day, hour } = localTime(date, hours.timeZone);
  const time = `${hours.opensAt % 12 || 12} ${hours.opensAt < 12 ? "AM" : "PM"}`;
  for (let offset = 0; offset < 7; offset++) {
    const d = (day + offset) % 7;
    if (!hours.days.includes(d)) continue;
    if (offset === 0 && hour >= hours.opensAt) continue;
    if (offset === 0) return `today at ${time}`;
    if (offset === 1) return `tomorrow at ${time}`;
    return `${DAY_NAMES[d]} at ${time}`;
  }
  return "soon";
}
