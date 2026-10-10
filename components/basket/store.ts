"use client";

import { useSyncExternalStore } from "react";
import { allItems } from "@/lib/menu";
import {
  emptyDetails,
  sanitizeCart,
  sanitizeDetails,
  type CartLine,
  type OrderDetails,
} from "@/lib/order";

/**
 * A tiny external store for the basket and checkout details.
 * It is saved to localStorage so a refresh, or a trip to WhatsApp and back, keeps the order.
 * useSyncExternalStore keeps server and client renders consistent (the server always sees an
 * empty basket; the saved basket appears right after hydration).
 */

type BasketState = {
  cart: CartLine[];
  details: OrderDetails;
  /** The last basket sent to WhatsApp from this device, for "Reorder my last order". */
  lastOrder: CartLine[];
};

const STORAGE_KEY = "golden-bite:basket:v1";
const SERVER_STATE: BasketState = { cart: [], details: emptyDetails, lastOrder: [] };

let state: BasketState | null = null;
const listeners = new Set<() => void>();

function load(): BasketState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SERVER_STATE;
    const parsed = JSON.parse(raw) as { cart?: unknown; details?: unknown; lastOrder?: unknown };
    // Never trust storage: rebuild from the official menu (see sanitizeCart). A saved order whose
    // dish or price has since changed simply drops that line.
    return {
      cart: sanitizeCart(parsed.cart, allItems),
      details: sanitizeDetails(parsed.details),
      lastOrder: sanitizeCart(parsed.lastOrder, allItems),
    };
  } catch {
    return SERVER_STATE;
  }
}

function getSnapshot(): BasketState {
  if (state === null) state = load();
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Empties the basket and forgets the customer's details on this device. */
export function clearBasket() {
  updateBasket((s) => ({ ...s, cart: [], details: emptyDetails }));
}

/** Remembers the order just sent so it can be reordered next time. */
export function saveLastOrder(cart: CartLine[]) {
  updateBasket((s) => ({ ...s, lastOrder: cart }));
}

/** Puts the last sent order back in the basket (prices are always today's menu prices). */
export function reorderLast() {
  updateBasket((s) => ({ ...s, cart: s.lastOrder }));
}

export function updateBasket(update: (current: BasketState) => BasketState) {
  state = update(getSnapshot());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or storage full: the basket still works for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function useBasketState(): BasketState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}
