"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { ArrowRightIcon, CateringIcon } from "./icons";

/**
 * A short, skippable welcome tour for first-time visitors: a welcome card, then three steps that
 * spotlight the food families, a dish card and the basket. It never blocks the page (no modal),
 * shows once per device, and can be replayed with the "Take the tour" button.
 */

const SEEN_KEY = "golden-bite:tour-seen:v1";
export const TOUR_EVENT = "golden-bite:tour";

type Step = { target?: string; mobileTarget?: string; title: string; text: string };

const STEPS: Step[] = [
  {
    title: "Welcome to Golden Bite!",
    text: "New here? Ordering takes about a minute and there is no account to create. Want a quick 3-step tour?",
  },
  {
    target: ".family-grid",
    title: "1. Pick what you’re craving",
    text: "Tap a food family to see its dishes: jollof, plain rice, fried rice, banku & tilapia, salads and food baskets.",
  },
  {
    target: ".menu-grid .menu-card",
    title: "2. Choose your portion, then Add",
    text: "Each price is a portion size. Pick one and tap Add. Add as many dishes as you like.",
  },
  {
    target: ".site-header .cart-trigger",
    mobileTarget: ".mobile-basket",
    title: "3. Send your order on WhatsApp",
    text: "Open your basket, choose delivery or pickup and MoMo or cash, then send. We reply on WhatsApp to confirm your order and delivery fee before you pay.",
  },
];

const isPhone = () => window.matchMedia("(max-width: 900px)").matches;

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Private mode: the tour may show again next visit, which is harmless.
  }
}

export function WelcomeTour() {
  const [step, setStep] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const close = useCallback((how: "skipped" | "finished") => {
    markSeen();
    setStep(null);
    trackEvent("Tour", { action: how });
  }, []);

  // First visit: offer the tour after a short pause. `?tour` in the address always shows it.
  // Automated browsers (tests, crawlers) are not interrupted.
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).has("tour");
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (!forced && (seen || navigator.webdriver)) return;
    const timer = window.setTimeout(() => setStep(0), forced ? 0 : 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // "Take the tour" buttons elsewhere on the page start it again.
  useEffect(() => {
    const start = () => setStep(0);
    window.addEventListener(TOUR_EVENT, start);
    return () => window.removeEventListener(TOUR_EVENT, start);
  }, []);

  // Spotlight and scroll to the current step's target.
  useEffect(() => {
    if (step === null) return;
    cardRef.current?.focus();
    const s = STEPS[step];
    const selector = (isPhone() && s.mobileTarget) || s.target;
    const el = selector ? document.querySelector<HTMLElement>(selector) : null;
    if (!el) return;
    el.classList.add("tour-target");
    // Target near the top, clear of the tour card; the basket button and bar are always on screen.
    if (getComputedStyle(el).position !== "fixed" && !el.closest(".site-header")) {
      el.scrollIntoView({ block: "start" });
    }
    return () => el.classList.remove("tour-target");
  }, [step]);

  // Escape skips the tour.
  useEffect(() => {
    if (step === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close("skipped");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, close]);

  if (step === null) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <>
      <div className="tour-dim" aria-hidden="true" onClick={() => close("skipped")} />
      <div
        className="tour-card"
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={cardRef}
      >
        <button
          type="button"
          className="tour-close"
          aria-label="Close the tour"
          onClick={() => close("skipped")}
        >
          ×
        </button>
        {step === 0 ? (
          <span className="tour-badge">
            <CateringIcon size={22} />
          </span>
        ) : (
          <p className="tour-progress">
            Step {step} of {STEPS.length - 1}
          </p>
        )}
        <h2 id={titleId}>{s.title}</h2>
        <p>{s.text}</p>
        <div className="tour-actions">
          {step === 0 ? (
            <>
              <button type="button" className="tour-skip" onClick={() => close("skipped")}>
                No thanks
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  trackEvent("Tour", { action: "started" });
                  setStep(1);
                }}
              >
                Show me <ArrowRightIcon size={18} />
              </button>
            </>
          ) : (
            <>
              <button type="button" className="tour-skip" onClick={() => setStep(step - 1)}>
                Back
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => (last ? close("finished") : setStep(step + 1))}
              >
                {last ? "Start ordering" : "Next"} <ArrowRightIcon size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** Button that replays the tour. */
export function TakeTourButton() {
  return (
    <button
      type="button"
      className="take-tour"
      onClick={() => window.dispatchEvent(new Event(TOUR_EVENT))}
    >
      New here? Take the 1-minute tour <ArrowRightIcon size={18} />
    </button>
  );
}
