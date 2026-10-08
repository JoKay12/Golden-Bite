"use client";

import { cartCount, cartTotal, formatCedis } from "@/lib/order";
import { useBasketUI } from "./BasketProvider";
import { useBasketState } from "./store";

/** Persistent basket bar on phones and tablets (hidden on desktop, where the sidebar shows). */
export function MobileBasketBar() {
  const { cart } = useBasketState();
  const { openBasket } = useBasketUI();
  const count = cartCount(cart);

  return (
    <button className="mobile-basket" type="button" onClick={openBasket}>
      <span>View basket</span>
      <strong>
        {count} item{count === 1 ? "" : "s"} · {formatCedis(cartTotal(cart))}
      </strong>
    </button>
  );
}

/** Header basket button, shown at every width. */
export function BasketButton() {
  const { cart } = useBasketState();
  const { openBasket } = useBasketUI();
  const count = cartCount(cart);

  return (
    <button
      className="cart-trigger"
      type="button"
      aria-label={`Basket ${count} item${count === 1 ? "" : "s"}`}
      onClick={openBasket}
    >
      <BagIcon />
      <span className="cart-trigger-label">Basket</span>
      <span className="cart-count">{count}</span>
    </button>
  );
}

export function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
