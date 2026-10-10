import Image from "next/image";
import { business, telHref, whatsappHref } from "@/lib/business";
import { BasketButton } from "./basket/MobileBasketBar";
import { CateringForm } from "./CateringForm";
import {
  ArrowDownIcon,
  CashIcon,
  CateringIcon,
  WhatsAppIcon,
  CheckIcon,
  ClockIcon,
  DeliveryIcon,
  MealIcon,
  MomoIcon,
  PhoneIcon,
  PinIcon,
  StepsIcon,
} from "./icons";
import heroFlyer from "@/public/images/hero-flyer.webp";
import logoHorizontal from "@/public/brand/logo-horizontal.png";
import logoStacked from "@/public/brand/logo-stacked.png";

/** Server-rendered sections: they ship as HTML only, no JavaScript. */

const [mainPhone, secondPhone] = business.phones;
const generalHref = whatsappHref("Hello Golden Bite! I have a question.");

export function Announcement() {
  return (
    <aside className="announcement" aria-label="Opening hours and delivery">
      <span>
        <ClockIcon size={15} /> Open {business.hours.label}
      </span>
      <span className="announcement-dot" aria-hidden="true">
        •
      </span>
      <span>
        <DeliveryIcon size={16} /> Pickup & delivery in {business.deliveryArea}
      </span>
    </aside>
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
          <a href="#menu">
            <MealIcon size={18} />
            <span>Menu</span>
          </a>
          <a href="#how-it-works">
            <StepsIcon size={18} />
            <span>How to order</span>
          </a>
          <a href="#catering">
            <CateringIcon size={18} />
            <span>Catering</span>
          </a>
          <a href="#contact">
            <PhoneIcon size={18} />
            <span>Contact</span>
          </a>
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
            <MealIcon /> Order now <ArrowDownIcon size={18} />
          </a>
          <a className="button button-quiet" href={telHref(mainPhone)}>
            <PhoneIcon /> Call {mainPhone.display}
          </a>
        </div>
        <dl className="hero-facts">
          <div>
            <ClockIcon size={22} />
            <dt>{business.hours.shortDays}</dt>
            <dd>{business.hours.shortTime}</dd>
          </div>
          <div>
            <DeliveryIcon size={22} />
            <dt>{business.deliveryArea}</dt>
            <dd>Delivery area</dd>
          </div>
          <div>
            <MomoIcon size={22} />
            <dt>MoMo or cash</dt>
            <dd>Pay your way</dd>
          </div>
        </dl>
      </div>
      <div className="hero-visual">
        <div className="hero-frame">
          <Image
            src={heroFlyer}
            alt="Golden Bite flyer: Satisfy your hunger. The Golden Bite shop front with a bowl of jollof rice and chicken. We serve jollof rice, fried rice, plain rice, banku and tilapia, salads and food baskets. Opposite Nana Abena Market. Open Monday to Saturday, 11am to 10pm. Call 0206637359 or 0542403077."
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
        <PinIcon /> {business.address.street}, {business.address.locality}
      </li>
      <li>
        <DeliveryIcon /> Pickup & delivery
      </li>
      <li>
        <CateringIcon /> Catering for your events
      </li>
    </ul>
  );
}

export function HowToOrder() {
  const steps = [
    {
      icon: <MealIcon size={26} />,
      title: "Pick your meal",
      text: "Choose your favourite dish and the portion that suits your appetite.",
    },
    {
      icon: <WhatsAppIcon size={28} />,
      title: "Send your order",
      text: "Add your name and location, then send your basket on WhatsApp or call us.",
    },
    {
      icon: <DeliveryIcon size={26} />,
      title: "Enjoy Golden Bite",
      text: `Pick up from ${business.address.inSentence} or get it delivered in ${business.deliveryArea}.`,
    },
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
        {steps.map(({ icon, title, text }, i) => (
          <li key={title}>
            <div className="step-head">
              <span className="step-icon">{icon}</span>
              <span className="step-number" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
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
        <h2 id="pay-title">Pay with MoMo or cash.</h2>
        <p>
          Choose your mode of payment when you order. We confirm every order by WhatsApp or phone
          call before you pay.
        </p>
        <ul className="pay-modes">
          <li>
            <MomoIcon size={22} /> MTN Mobile Money
          </li>
          <li>
            <CashIcon size={22} /> Cash on delivery or at pickup
          </li>
        </ul>
      </div>
      <div className="momo-card">
        <span>
          <MomoIcon size={18} /> {momo.network}
        </span>
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
          <li>
            <CheckIcon size={18} /> Birthdays, weddings, funerals, church and office events
          </li>
          <li>
            <CheckIcon size={18} /> Jollof, fried rice, banku & tilapia, salads and food baskets
          </li>
          <li>
            <CheckIcon size={18} /> Delivered anywhere in {business.deliveryArea}
          </li>
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
        <p className="footer-line">
          <PinIcon size={18} />
          <span>
            {business.address.street}
            <br />
            {business.address.locality}, Ghana
          </span>
        </p>
        <p className="footer-line">
          <ClockIcon size={18} />
          <span>
            {business.hours.longDays}
            <br />
            {business.hours.shortTime}
          </span>
        </p>
      </div>
      <div>
        <h2>Order with us</h2>
        <a href={telHref(mainPhone)}>
          <PhoneIcon size={18} /> {mainPhone.display}
        </a>
        <a href={telHref(secondPhone)}>
          <PhoneIcon size={18} /> {secondPhone.display}
        </a>
        <a href={generalHref} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={20} /> WhatsApp Golden Bite
        </a>
      </div>
    </footer>
  );
}
