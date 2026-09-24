# Golden Bite

Golden Bite is a mobile-first web application for a fast food restaurant in Techiman, Ghana. It helps customers browse the menu, build an order, and request pickup or delivery from their phones.

## Business details

- **Location:** Ohene Ameyaw Park, Techiman
- **Category:** Fast food restaurant
- **Contact:** 054 240 3077 / 020 663 7359
- **Opening hours:** Monday–Saturday, 11:00 AM – 10:00 PM
- **Fulfilment:** Pickup and delivery
- **Ordering:** WhatsApp or phone call
- **Payment:** Mobile Money, either before delivery or on delivery
- **Mobile Money number:** 054 240 3077 (MTN)
- **Delivery area:** Techiman
- **Additional service:** Event catering
- **Website:** Coming soon

## Product goals

- Present the Golden Bite menu clearly on every screen size.
- Make ordering quick on low-data mobile connections.
- Let customers choose between pickup and delivery.
- Serve delivery requests within Techiman.
- Provide clear call and WhatsApp contact options.
- Promote catering services for parties, meetings, and other events.
- Establish a foundation for online payments, customer accounts, and order management.

## Customer experience

1. Visit the home page and see the featured menu and an **Order now** call to action.
2. Browse menu categories such as Jollof, Plain Rice, Fried Rice, Banku & Tilapia, Salads, and Food Baskets.
3. Select a meal, portion or price option, and add it to a basket.
4. Choose pickup or delivery within Techiman and provide contact and location details.
5. Confirm the order through WhatsApp or phone call and pay by MTN Mobile Money on 0542403077 before delivery or when the order arrives.

The owner or an administrator receives and fulfils incoming orders. The first release supports guest ordering; customer accounts are a later enhancement for returning customers. Catering enquiries use the restaurant's existing phone and WhatsApp contacts.

## Tech stack

- **Next.js 16 (App Router) + React 19** — the page is server-rendered; only the menu and basket ship JavaScript.
- **TypeScript** (strict) and plain CSS with design tokens in `app/globals.css`.
- **Vitest** for unit tests, **ESLint** (`eslint-config-next`) and **Prettier**.
- **PostgreSQL** (planned) when menu editing, orders and accounts are introduced.

## Getting started

Requires Node.js 20.9+ (22 recommended, see `.nvmrc`).

```bash
npm ci            # install exact versions from package-lock.json
npm run dev       # http://localhost:3000
npm run check     # lint + typecheck + tests + production build (same as CI)
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the live domain before deploying. It is used for social previews, the sitemap and Google structured data.

## Project structure

```
app/
  layout.tsx            metadata, social preview tags
  page.tsx              page composition
  globals.css           all styles
  icon.png, apple-icon.png, opengraph-image.jpg
  robots.ts, sitemap.ts
components/
  sections.tsx          header, hero, how-to-order, payment, catering, footer (server)
  menu/MenuSection.tsx  food families, meal cards, portion picker (client)
  basket/               basket store (localStorage), drawer, checkout form, toast
  StructuredData.tsx    schema.org Restaurant + menu JSON-LD
lib/
  business.ts           phones, MoMo, hours, address: edit business details here
  menu.ts               menu items and prices: edit the menu here
  order.ts              basket maths, WhatsApp message, opening hours (+ order.test.ts)
public/
  brand/                transparent logo files
  images/               food photos
design/                 original flyers and logo files (not served)
```

## How ordering works

1. Customer picks a food family, a meal and a portion, then taps **Add**. Identical meals merge into one line with a quantity.
2. The basket is saved in the browser, so it survives a refresh or a trip to WhatsApp and back.
3. At checkout the customer chooses Delivery or Pickup, enters their name, delivery area/landmark, when they will pay with MoMo, and optional notes.
4. **Send order on WhatsApp** opens a chat with 054 240 3077 containing the full order. Staff confirm the order and delivery fee, then the customer pays by MTN MoMo.
5. Outside opening hours the basket shows a notice with the next opening time (Africa/Accra time).

## Common edits

- **Change a price or add a dish:** edit `lib/menu.ts`.
- **Change phone numbers, hours or MoMo details:** edit `lib/business.ts`.
- **Add a food photo:** put it in `public/images/`, import it in `lib/menu.ts` and set the family's `image` and `imageAlt`. Families without a photo show the logo.

## Design direction

The interface uses Golden Bite's black-and-gold identity, with warm food imagery as an accent. It prioritises readable text, 44 px tap targets, and a persistent mobile basket bar. The gold logo is used on dark backgrounds only.

## Owner to-do

- [ ] Supply real food photos (hero, each food family, catering). Current images are interim crops from the flyers.
- [ ] Confirm the MoMo account name and set `momo.accountName` in `lib/business.ts`.
- [ ] Confirm delivery fees/zones and the menu descriptions.

## Roadmap

- [x] Build a responsive menu and home page.
- [x] Add basket, WhatsApp ordering, and call-to-order actions.
- [x] Add pickup and delivery checkout details.
- [x] Add Mobile Money payment instructions for pre-delivery and pay-on-delivery orders.
- [x] Add catering enquiries via WhatsApp.
- [ ] Select the launch domain, hosting provider (Vercel recommended) and push to GitHub.
- [ ] Publish and link the website to the Golden Bite Google Business Profile after verification.
- [ ] Catering enquiry form (date, guests, budget).
- [ ] Database-backed menu with an admin page (edit prices, mark items sold out).
- [ ] Order-management dashboard and online MoMo payments.
- [ ] Optional customer accounts after guest ordering is established.
