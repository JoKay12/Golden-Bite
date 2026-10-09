"use client";

import { cartCount, cartTotal, formatCedis } from "@/lib/order";
import { BagIcon } from "../icons";
import { useBasketUI } from "./BasketProvider";
import { useBasketState } from "./store";

/** Persistent basket bar on phones and tablets (hidden on desktop, where the sidebar shows). */
export function MobileBasketBar() {
  const { cart } = useBasketState();
  const { openBasket } = useBasketUI();
  const count = cartCount(cart);

  return (
    <button className="mobile-basket" type="button" onClick={openBasket}>
      <span className="mobile-basket-label">
        <BagIcon size={20} /> View basket
      </span>
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
      <BagIcon size={18} />
      <span className="cart-trigger-label">Basket</span>
      <span className="cart-count">{count}</span>
    </button>
  );
}
