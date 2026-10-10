"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { allItems, menu, type MenuFamily, type MenuItem, type Photo } from "@/lib/menu";
import { trackEvent } from "@/lib/analytics";
import { cartCount, cartTotal, describeOrder, formatCedis } from "@/lib/order";
import { ArrowRightIcon, ReorderIcon } from "../icons";
import { reorderLast, useBasketState } from "../basket/store";
import { useBasketUI } from "../basket/BasketProvider";
import { OrderSummary } from "../basket/OrderSummary";

/** "Welcome back" prompt above the menu when the basket is empty and an order was sent before. */
function ReorderBanner() {
  const { cart, lastOrder } = useBasketState();
  const { openBasket } = useBasketUI();
  if (cart.length > 0 || lastOrder.length === 0) return null;
  return (
    <div className="reorder-banner">
      <p>
        <strong>Welcome back!</strong> Your last order: {describeOrder(lastOrder)} ·{" "}
        {formatCedis(cartTotal(lastOrder))}
      </p>
      <button
        type="button"
        className="button button-primary"
        onClick={() => {
          reorderLast();
          trackEvent("Reorder", { items: cartCount(lastOrder), total: cartTotal(lastOrder) });
          openBasket();
        }}
      >
        <ReorderIcon /> Reorder my last order
      </button>
    </div>
  );
}

const minPrice = (family: MenuFamily) => Math.min(...family.items.flatMap((i) => i.prices));

export function MenuSection() {
  const [activeId, setActiveId] = useState(menu[0].id);
  const panelRef = useRef<HTMLDivElement>(null);
  const index = Math.max(
    0,
    menu.findIndex((f) => f.id === activeId),
  );
  const family = menu[index];
  const next = menu[(index + 1) % menu.length];

  /** Switches family; scrolls to its first dish when asked, or when the reader is below it. */
  function showFamily(id: string, scroll: "always" | "if-below") {
    setActiveId(id);
    const panel = panelRef.current;
    if (!panel) return;
    if (scroll === "always" || panel.getBoundingClientRect().top < 0) {
      requestAnimationFrame(() => panel.scrollIntoView({ block: "start" }));
    }
  }

  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Build your perfect plate</p>
          <h2 id="menu-title">Our menu.</h2>
        </div>
        <p>
          {menu.length} food families, {allItems.length} dishes. Pick what you are craving, choose
          your portion, then add it to your basket.
        </p>
      </div>

      <ReorderBanner />

      <h3 className="craving-title">What are you craving?</h3>
      <ul className="family-grid">
        {menu.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              className="family-tile"
              aria-pressed={f.id === activeId}
              aria-label={`See ${f.name}: ${f.items.length} ${f.items.length === 1 ? "dish" : "dishes"}, from ${formatCedis(minPrice(f))}`}
              onClick={() => showFamily(f.id, "always")}
            >
              <Image src={f.photo.src} alt="" fill sizes="(max-width: 630px) 50vw, 240px" />
              <span className="family-tile-text">
                <strong>{f.name}</strong>
                <span>
                  {f.items.length} {f.items.length === 1 ? "dish" : "dishes"} · from{" "}
                  {formatCedis(minPrice(f))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="category-bar">
        <div className="category-tabs" aria-label="Food families">
          {menu.map((f) => (
            <button
              type="button"
              aria-pressed={f.id === activeId}
              aria-controls="menu-panel"
              key={f.id}
              onClick={(event) => {
                event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                showFamily(f.id, "if-below");
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-layout">
        <div id="menu-panel" ref={panelRef}>
          <div className="family-showcase">
            <p className="eyebrow">
              Food family {index + 1} of {menu.length} · {family.items.length}{" "}
              {family.items.length === 1 ? "choice" : "choices"}
            </p>
            <h3>{family.name}</h3>
            <p>{family.description}</p>
          </div>

          <div className="menu-grid">
            {family.items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                familyName={family.name}
                fallbackPhoto={family.photo}
              />
            ))}
          </div>

          <button
            type="button"
            className="next-family"
            onClick={() => showFamily(next.id, "always")}
          >
            <span>
              <small>{index === menu.length - 1 ? "Back to the start" : "Next food family"}</small>
              <strong>{next.name}</strong>
            </span>
            <ArrowRightIcon size={22} />
          </button>
          <p className="photo-note">
            Photos are serving suggestions. Portion size depends on the price you choose.
          </p>
        </div>

        <aside className="order-card desktop-order" aria-label="Your order">
          <OrderSummary />
        </aside>
      </div>
    </section>
  );
}

function MenuCard({
  item,
  familyName,
  fallbackPhoto,
}: {
  item: MenuItem;
  familyName: string;
  fallbackPhoto: Photo;
}) {
  const { add } = useBasketUI();
  const [price, setPrice] = useState(item.prices[0]);
  const single = item.prices.length === 1;
  const photo = item.photo ?? fallbackPhoto;

  return (
    <article className="menu-card">
      <div className="menu-card-photo">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 630px) 100vw, (max-width: 900px) 45vw, 400px"
          placeholder="blur"
        />
      </div>
      <div className="card-topline">
        <span>{familyName}</span>
        <span>
          {single ? "" : "From "}
          {formatCedis(item.prices[0])}
        </span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {!single && (
        <>
          <div className="price-label" id={`${item.id}-portion`}>
            Choose your portion
          </div>
          <div className="price-options" role="group" aria-labelledby={`${item.id}-portion`}>
            {item.prices.map((p) => (
              <button type="button" key={p} aria-pressed={p === price} onClick={() => setPrice(p)}>
                {formatCedis(p)}
              </button>
            ))}
          </div>
        </>
      )}
      <button
        className="add-button"
        type="button"
        aria-label={`Add ${formatCedis(price)}: ${item.name}`}
        onClick={() => add(item, price)}
      >
        Add {formatCedis(price)} <span aria-hidden="true">+</span>
      </button>
    </article>
  );
}
