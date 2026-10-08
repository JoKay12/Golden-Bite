"use client";

import Image from "next/image";
import { useState } from "react";
import { menu, type MenuItem, type Photo } from "@/lib/menu";
import { formatCedis } from "@/lib/order";
import { useBasketUI } from "../basket/BasketProvider";
import { OrderSummary } from "../basket/OrderSummary";

export function MenuSection() {
  const [activeId, setActiveId] = useState(menu[0].id);
  const family = menu.find((f) => f.id === activeId) ?? menu[0];

  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Build your perfect plate</p>
          <h2 id="menu-title">Our menu.</h2>
        </div>
        <p>Pick a food family, choose your meal and portion, then add it to your basket.</p>
      </div>

      <div className="category-tabs" aria-label="Food families">
        {menu.map((f) => (
          <button
            type="button"
            aria-pressed={f.id === activeId}
            aria-controls="menu-panel"
            key={f.id}
            onClick={() => setActiveId(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="menu-layout">
        <div id="menu-panel">
          <div className="family-showcase">
            <p className="eyebrow">
              {family.items.length} {family.items.length === 1 ? "choice" : "choices"}
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
