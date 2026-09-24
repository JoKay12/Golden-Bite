"use client";

import type { Ref } from "react";
import { OrderSummary } from "./OrderSummary";

/**
 * Native <dialog> opened with showModal(): gives focus trapping, Escape-to-close and an inert
 * background for free. Clicking the dimmed backdrop also closes it.
 */
export function BasketDrawer({ ref }: { ref: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      className="basket-dialog"
      aria-labelledby="basket-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="order-card drawer-order">
        <form method="dialog" className="close-form">
          <button className="close-button" type="submit" aria-label="Close basket">
            ×
          </button>
        </form>
        <OrderSummary titleId="basket-dialog-title" />
      </div>
    </dialog>
  );
}
