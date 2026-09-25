import Image from "next/image";
import { business, telHref, whatsappHref } from "@/lib/business";
import { BasketButton } from "./basket/MobileBasketBar";
import { CateringForm } from "./CateringForm";
import heroPhoto from "@/public/images/menu/hero.jpg";
import logoHorizontal from "@/public/brand/logo-horizontal.png";
import logoStacked from "@/public/brand/logo-stacked.png";

/** Server-rendered sections: they ship as HTML only, no JavaScript. */

const [mainPhone, secondPhone] = business.phones;
const generalHref = whatsappHref("Hello Golden Bite! I have a question.");

export function Announcement() {
  return (
    <div className="announcement">
      <span>Open {business.hours.label}</span>
      <span className="announcement-dot" aria-hidden="true">
        •
      </span>
      <span>Pickup & delivery in {business.deliveryArea}</span>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top">
          <Image src={logoHorizontal} alt="Golden Bite home" priority sizes="200px" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#how-it-works">How to order</a>
          <a href="#catering">Catering</a>
          <a href="#contact">Contact</a>
        </nav>
        <BasketButton />
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">Techiman’s flavour destination</p>
        <h1>
          Satisfy your <em>hunger.</em>
        </h1>
        <p className="hero-intro">
          Big flavour, generous portions, and your Golden Bite favourites delivered across{" "}
          {business.deliveryArea}.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#menu">
            Order now <span aria-hidden="true">↓</span>
          </a>
          <a className="button button-quiet" href={telHref(mainPhone)}>
            Call {mainPhone.display}
          </a>
        </div>
        <dl className="hero-facts">
          <div>
            <dt>{business.hours.shortDays}</dt>
            <dd>{business.hours.shortTime}</dd>
          </div>
          <div>
            <dt>{business.deliveryArea}</dt>
            <dd>Delivery area</dd>
          </div>
          <div>
            <dt>MTN MoMo</dt>
            <dd>Pay before or on delivery</dd>
          </div>
        </dl>
      </div>
      <div className="hero-visual">
        <div className="hero-frame">
          <Image
            src={heroPhoto}
            alt="Jollof rice with grilled turkey, fried plantain, salad and pepper sauce"
            priority
            fill
            sizes="(max-width: 900px) 90vw, 480px"
            placeholder="blur"
          />
        </div>
        <div className="hero-note">
          <span>Now serving</span>
          <strong>Jollof · Fried rice · Tilapia</strong>
        </div>
      </div>
    </section>
  );
}

export function ServiceStrip() {
  return (
    <ul className="service-strip" aria-label="Golden Bite services">
      <li>
        <span aria-hidden="true">⌖</span> {business.address.street}, {business.address.locality}
      </li>
      <li>
        <span aria-hidden="true">✓</span> Pickup & delivery
      </li>
      <li>
        <span aria-hidden="true">✦</span> Catering for your events
      </li>
    </ul>
  );
}

export function HowToOrder() {
  const steps = [
    ["Pick your meal", "Choose your favourite dish and the portion that suits your appetite."],
    [
      "Send your order",
      "Add your name and location, then send your basket on WhatsApp or call us.",
    ],
    [
      "Enjoy Golden Bite",
      `Pick up at ${business.address.street} or receive delivery in ${business.deliveryArea}.`,
    ],
  ];
  return (
    <section className="how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="section-heading inverse-heading">
        <div>
          <p className="eyebrow">Simple from start to finish</p>
          <h2 id="how-title">How to order.</h2>
        </div>
        <p>
          No account needed. We confirm every order and the delivery fee on WhatsApp or by phone.
        </p>
      </div>
      <ol className="steps">
        {steps.map(([title, text], i) => (
          <li key={title}>
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Payment() {
  const { momo } = business;
  return (
    <section className="payment-section" aria-labelledby="pay-title">
      <div className="payment-copy">
        <p className="eyebrow">Easy payment</p>
        <h2 id="pay-title">Pay with MTN Mobile Money.</h2>
        <p>
          Pay before delivery or when your order arrives. We confirm every order by WhatsApp or
          phone call before you pay.
        </p>
      </div>
      <div className="momo-card">
        <span>{momo.network}</span>
        <strong>{momo.number}</strong>
        <p>
          {momo.accountName
            ? `Account name: ${momo.accountName}. Check this name appears before you confirm payment.`
            : "Only pay after we have confirmed your order."}
        </p>
      </div>
    </section>
  );
}

export function Catering() {
  return (
    <section className="catering-section" id="catering" aria-labelledby="catering-title">
      <div className="catering-copy">
        <p className="eyebrow">For gatherings big and small</p>
        <h2 id="catering-title">Let’s cater your next event.</h2>
        <p>
          From food baskets to crowd-pleasing rice dishes, Golden Bite is ready to make your
          celebration, meeting or special occasion delicious. Tell us about your event and we’ll
          reply on WhatsApp with options and prices.
        </p>
        <ul className="catering-points">
          <li>Birthdays, weddings, funerals, church and office events</li>
          <li>Jollof, fried rice, banku & tilapia, salads and food baskets</li>
          <li>Delivered anywhere in {business.deliveryArea}</li>
        </ul>
      </div>
      <div className="catering-form-card">
        <CateringForm />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact">
      <div className="footer-brand">
        <Image src={logoStacked} alt="Golden Bite" width={170} sizes="170px" />
        <p>Big flavour. Golden moments.</p>
      </div>
      <div>
        <h2>Visit us</h2>
        <p>
          {business.address.street}
          <br />
          {business.address.locality}, Ghana
        </p>
        <p>
          {business.hours.longDays}
          <br />
          {business.hours.shortTime}
        </p>
      </div>
      <div>
        <h2>Order with us</h2>
        <a href={telHref(mainPhone)}>{mainPhone.display}</a>
        <a href={telHref(secondPhone)}>{secondPhone.display}</a>
        <a href={generalHref} target="_blank" rel="noopener noreferrer">
          WhatsApp Golden Bite
        </a>
      </div>
    </footer>
  );
}
