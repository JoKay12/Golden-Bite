"use client";

import { useSyncExternalStore } from "react";
import { emptyDetails, type CartLine, type OrderDetails } from "@/lib/order";

/**
 * A tiny external store for the basket and checkout details.
 * It is saved to localStorage so a refresh, or a trip to WhatsApp and back, keeps the order.
 * useSyncExternalStore keeps server and client renders consistent (the server always sees an
 * empty basket; the saved basket appears right after hydration).
 */

type BasketState = { cart: CartLine[]; details: OrderDetails };

const STORAGE_KEY = "golden-bite:basket:v1";
const SERVER_STATE: BasketState = { cart: [], details: emptyDetails };

let state: BasketState | null = null;
const listeners = new Set<() => void>();

function load(): BasketState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SERVER_STATE;
    const parsed = JSON.parse(raw) as Partial<BasketState>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart.filter(isCartLine) : [],
      details: { ...emptyDetails, ...parsed.details },
    };
  } catch {
    return SERVER_STATE;
  }
}

function isCartLine(value: unknown): value is CartLine {
  const line = value as CartLine;
  return (
    typeof line?.key === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.qty === "number" &&
    line.qty > 0
  );
}

function getSnapshot(): BasketState {
  if (state === null) state = load();
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
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
