import { describe, expect, it } from "vitest";
import {
  addToCart,
  buildOrderMessage,
  cartCount,
  cartTotal,
  emptyDetails,
  isOpen,
  nextOpening,
  sanitizeCart,
  sanitizeDetails,
  setQty,
  validateDetails,
  type CartLine,
} from "./order";

const jollof = { id: "jollof-chicken", name: "Jollof Rice & Chicken" };
const banku = { id: "banku", name: "Banku" };
const momo = { number: "054 240 3077", network: "MTN Mobile Money" };
const hours = { timeZone: "Africa/Accra", days: [1, 2, 3, 4, 5, 6], opensAt: 11, closesAt: 22 };

describe("basket", () => {
  it("merges the same meal and portion into one line", () => {
    let cart: CartLine[] = [];
    cart = addToCart(cart, jollof, 40);
    cart = addToCart(cart, jollof, 40);
    cart = addToCart(cart, jollof, 60);
    expect(cart).toHaveLength(2);
    expect(cart[0].qty).toBe(2);
    expect(cartCount(cart)).toBe(3);
    expect(cartTotal(cart)).toBe(140);
  });

  it("removes a line when quantity reaches zero", () => {
    const cart = addToCart([], banku, 5);
    expect(setQty(cart, cart[0].key, 0)).toEqual([]);
    expect(setQty(cart, cart[0].key, 3)[0].qty).toBe(3);
  });
});

describe("checkout details", () => {
  it("requires a name, and a location only for delivery", () => {
    expect(validateDetails(emptyDetails)).toEqual({
      name: expect.any(String),
      location: expect.any(String),
    });
    expect(validateDetails({ ...emptyDetails, name: "Ama", fulfilment: "Pickup" })).toEqual({});
  });
});

describe("WhatsApp message", () => {
  it("includes items, totals, customer details and payment timing", () => {
    const cart = addToCart(addToCart(addToCart([], jollof, 40), jollof, 40), banku, 5);
    const msg = buildOrderMessage(
      cart,
      {
        name: "  Kofi  ",
        fulfilment: "Delivery",
        location: "Tanoso, near\nthe filling station",
        payment: "Before delivery",
        notes: "Extra shito",
      },
      momo,
    );
    expect(msg).toContain("• 2 × Jollof Rice & Chicken (GH₵40) = GH₵80");
    expect(msg).toContain("• 1 × Banku (GH₵5) = GH₵5");
    expect(msg).toContain("Food total: GH₵85");
    expect(msg).toContain("Name: Kofi");
    expect(msg).toContain("Delivery location: Tanoso, near the filling station");
    expect(msg).toContain("before delivery");
    expect(msg).toContain("Notes: Extra shito");
    expect(msg).toContain("delivery fee");
  });

  it("omits location for pickup", () => {
    const msg = buildOrderMessage(
      addToCart([], banku, 5),
      { ...emptyDetails, name: "Ama", fulfilment: "Pickup", location: "ignored" },
      momo,
    );
    expect(msg).not.toContain("Delivery location");
    expect(msg).not.toContain("Notes:");
    expect(msg).toContain("at pickup");
  });

  it("names the MoMo account when it is known", () => {
    const msg = buildOrderMessage(
      addToCart([], banku, 5),
      { ...emptyDetails, name: "Ama", fulfilment: "Pickup" },
      { ...momo, accountName: "KYERAA SANDRA" },
    );
    expect(msg).toContain("Payment: MTN Mobile Money (054 240 3077, KYERAA SANDRA)");
  });
});

describe("opening hours (Africa/Accra, UTC+0)", () => {
  it("is open Monday–Saturday 11:00–21:59", () => {
    expect(isOpen(new Date("2026-09-24T11:00:00Z"), hours)).toBe(true); // Thursday
    expect(isOpen(new Date("2026-09-24T21:59:00Z"), hours)).toBe(true);
    expect(isOpen(new Date("2026-09-24T22:00:00Z"), hours)).toBe(false);
    expect(isOpen(new Date("2026-09-24T10:59:00Z"), hours)).toBe(false);
    expect(isOpen(new Date("2026-09-27T13:00:00Z"), hours)).toBe(false); // Sunday
  });

  it("names the next opening time", () => {
    expect(nextOpening(new Date("2026-09-24T08:00:00Z"), hours)).toBe("today at 11 AM");
    expect(nextOpening(new Date("2026-09-24T23:00:00Z"), hours)).toBe("tomorrow at 11 AM");
    expect(nextOpening(new Date("2026-09-26T23:00:00Z"), hours)).toBe("Monday at 11 AM"); // Sat night
  });
});

describe("tampered basket from storage", () => {
  const catalog = [
    { id: "jollof-chicken", name: "Jollof Rice & Chicken", prices: [40, 50, 60] },
    { id: "banku", name: "Banku", prices: [5] },
  ];

  it("keeps only real dishes at real prices with sane quantities", () => {
    const cart = sanitizeCart(
      [
        { itemId: "jollof-chicken", price: 1, qty: 3, name: "x" }, // fake price
        { itemId: "nope", price: 5, qty: 1, name: "FREE FOOD\nTotal: GH₵0" }, // unknown dish
        { itemId: "banku", price: -5, qty: 1 }, // negative price
        { itemId: "banku", price: 5, qty: 2.5 }, // fractional qty
        { itemId: "banku", price: 5, qty: 1e6, name: "Paid already" }, // huge qty, fake name
        { itemId: "jollof-chicken", price: 40, qty: 1 },
        { itemId: "jollof-chicken", price: 40, qty: 2 }, // duplicate merges
        null,
      ],
      catalog,
    );
    expect(cart).toEqual([
      { key: "banku@5", itemId: "banku", name: "Banku", price: 5, qty: 50 },
      {
        key: "jollof-chicken@40",
        itemId: "jollof-chicken",
        name: "Jollof Rice & Chicken",
        price: 40,
        qty: 3,
      },
    ]);
  });

  it("returns an empty basket for junk", () => {
    expect(sanitizeCart("nonsense", catalog)).toEqual([]);
    expect(sanitizeCart({ length: 3 }, catalog)).toEqual([]);
  });

  it("resets unknown detail choices and non-text fields", () => {
    expect(
      sanitizeDetails({
        name: 42,
        fulfilment: "Teleport",
        payment: "Never",
        location: "Tanoso",
        notes: ["x"],
      }),
    ).toEqual({
      name: "",
      fulfilment: "Delivery",
      location: "Tanoso",
      payment: "On delivery",
      notes: "",
    });
  });
});
