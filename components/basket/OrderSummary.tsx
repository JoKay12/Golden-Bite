"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { business, whatsappHref } from "@/lib/business";
import {
  buildOrderMessage,
  cartTotal,
  formatCedis,
  isOpen,
  nextOpening,
  paymentLabel,
  setQty,
  validateDetails,
  type Fulfilment,
  type OrderDetails,
  type PaymentMethod,
} from "@/lib/order";
import {
  BagIcon,
  CashIcon,
  ChatIcon,
  DeliveryIcon,
  MealIcon,
  MomoIcon,
  PickupIcon,
} from "../icons";
import { clearBasket, updateBasket, useBasketState } from "./store";

const FULFILMENT: Fulfilment[] = ["Delivery", "Pickup"];
const PAYMENT: PaymentMethod[] = ["MoMo", "Cash"];

/** Current minute, refreshed every 30 s; null during server render so the notice never mismatches. */
function useNowMinute(): number | null {
  return useSyncExternalStore(
    (notify) => {
      const timer = window.setInterval(notify, 30_000);
      return () => window.clearInterval(timer);
    },
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}

export function OrderSummary({ titleId }: { titleId?: string }) {
  const { cart, details } = useBasketState();
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);
  const uid = useId();
  const minute = useNowMinute();

  const total = cartTotal(cart);
  const errors = validateDetails(details);
  const valid = Object.keys(errors).length === 0;
  const empty = cart.length === 0;
  const closed = minute !== null && !isOpen(new Date(minute * 60_000), business.hours);

  const setDetails = (patch: Partial<OrderDetails>) =>
    updateBasket((s) => ({ ...s, details: { ...s.details, ...patch } }));
  const changeQty = (key: string, qty: number) =>
    updateBasket((s) => ({ ...s, cart: setQty(s.cart, key, qty) }));

  const href = whatsappHref(buildOrderMessage(cart, details, business.momo));
  const ids = { name: `${uid}-name`, location: `${uid}-location`, notes: `${uid}-notes` };

  return (
    <>
      <div className="order-header">
        <div>
          <p className="eyebrow">Your selection</p>
          <h2 id={titleId}>Your basket</h2>
        </div>
        <span className="basket-icon">
          <BagIcon />
        </span>
      </div>

      {closed && (
        <p className="closed-notice">
          We’re closed right now. You can still send your order and we’ll confirm it when we open{" "}
          {nextOpening(new Date(minute! * 60_000), business.hours)}.
        </p>
      )}

      {empty ? (
        <div className="empty-basket">
          <MealIcon size={30} />
          <p>Your basket is waiting for something delicious.</p>
        </div>
      ) : (
        <ul className="cart-items">
          {cart.map((line) => (
            <li key={line.key}>
              <div className="cart-line-text">
                <strong>{line.name}</strong>
                <span>
                  {formatCedis(line.price)} each · {formatCedis(line.price * line.qty)}
                </span>
              </div>
              <div className="qty" role="group" aria-label={`Quantity of ${line.name}`}>
                <button
                  type="button"
                  onClick={() => changeQty(line.key, line.qty - 1)}
                  aria-label={line.qty === 1 ? `Remove ${line.name}` : `One less ${line.name}`}
                >
                  {line.qty === 1 ? "×" : "−"}
                </button>
                <output aria-live="polite">{line.qty}</output>
                <button
                  type="button"
                  onClick={() => changeQty(line.key, line.qty + 1)}
                  aria-label={`One more ${line.name}`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <fieldset className="choice-group">
        <legend>How would you like it?</legend>
        <div>
          {FULFILMENT.map((option) => (
            <button
              type="button"
              aria-pressed={details.fulfilment === option}
              onClick={() => setDetails({ fulfilment: option })}
              key={option}
            >
              {option === "Delivery" ? <DeliveryIcon size={18} /> : <PickupIcon size={18} />}
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor={ids.name}>Your name</label>
        <input
          id={ids.name}
          autoComplete="name"
          value={details.name}
          maxLength={80}
          onChange={(e) => setDetails({ name: e.target.value })}
          aria-invalid={showErrors && !!errors.name}
          aria-describedby={showErrors && errors.name ? `${ids.name}-err` : undefined}
        />
        {showErrors && errors.name && (
          <small className="field-error" id={`${ids.name}-err`}>
            {errors.name}
          </small>
        )}
      </div>

      {details.fulfilment === "Delivery" ? (
        <div className="field">
          <label htmlFor={ids.location}>Delivery area and landmark</label>
          <input
            id={ids.location}
            autoComplete="street-address"
            placeholder="e.g. Tanoso, near the filling station"
            value={details.location}
            maxLength={200}
            onChange={(e) => setDetails({ location: e.target.value })}
            aria-invalid={showErrors && !!errors.location}
            aria-describedby={`${ids.location}-hint${showErrors && errors.location ? ` ${ids.location}-err` : ""}`}
          />
          <small className="field-hint" id={`${ids.location}-hint`}>
            {business.deliveryFeeNote}
          </small>
          {showErrors && errors.location && (
            <small className="field-error" id={`${ids.location}-err`}>
              {errors.location}
            </small>
          )}
        </div>
      ) : (
        <p className="field-hint pickup-hint">
          Pick up from {business.address.inSentence}, {business.address.locality}.
        </p>
      )}

      <fieldset className="choice-group">
        <legend>Mode of payment</legend>
        <div>
          {PAYMENT.map((option) => (
            <button
              type="button"
              aria-pressed={details.payment === option}
              onClick={() => setDetails({ payment: option })}
              key={option}
            >
              {option === "MoMo" ? <MomoIcon size={18} /> : <CashIcon size={18} />}
              {paymentLabel(option)}
            </button>
          ))}
        </div>
        <small className="field-hint">
          {details.payment === "MoMo"
            ? `${business.momo.number}${business.momo.accountName ? ` · ${business.momo.accountName}` : ""}. Pay after we confirm your order.`
            : `Pay in cash ${details.fulfilment === "Delivery" ? "when your order arrives" : "when you pick up"}.`}
        </small>
      </fieldset>

      <div className="field">
        <label htmlFor={ids.notes}>
          Notes <span className="optional">(optional)</span>
        </label>
        <textarea
          id={ids.notes}
          rows={2}
          maxLength={300}
          placeholder="e.g. extra pepper, call when you arrive"
          value={details.notes}
          onChange={(e) => setDetails({ notes: e.target.value })}
        />
      </div>

      <div className="basket-total">
        <span>Food total</span>
        <strong>{formatCedis(total)}</strong>
      </div>

      {empty ? (
        <button className="button whatsapp-button" type="button" disabled>
          <ChatIcon /> Send order on WhatsApp
        </button>
      ) : (
        <a
          className="button whatsapp-button"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (!valid) {
              event.preventDefault();
              setShowErrors(true);
              document.getElementById(errors.name ? ids.name : ids.location)?.focus();
              return;
            }
            setSent(true);
          }}
        >
          <ChatIcon /> Send order on WhatsApp
        </a>
      )}
      {!empty && (
        <div className={`clear-basket${sent ? " is-sent" : ""}`}>
          {sent && <p role="status">Order sent? Clear it so it isn’t sent twice.</p>}
          <button
            type="button"
            onClick={() => {
              clearBasket();
              setSent(false);
              setShowErrors(false);
            }}
          >
            Clear basket and my details
          </button>
        </div>
      )}
      <p className="basket-help">
        Opens WhatsApp with your order filled in. Or call{" "}
        <a href={`tel:+${business.phones[0].international}`}>{business.phones[0].display}</a>.
      </p>
    </>
  );
}
