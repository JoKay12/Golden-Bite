"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { business, whatsappHref } from "@/lib/business";
import {
  buildCateringMessage,
  emptyEnquiry,
  EVENT_TYPES,
  MAX_GUESTS,
  todayIn,
  validateEnquiry,
  type CateringEnquiry,
  type EventType,
} from "@/lib/catering";
import { ChatIcon } from "./icons";

const subscribeNever = () => () => {};

/** Catering enquiry that opens WhatsApp with every detail filled in. */
export function CateringForm() {
  const [form, setForm] = useState<CateringEnquiry>(emptyEnquiry);
  const [showErrors, setShowErrors] = useState(false);
  const uid = useId();
  // Today in Accra, computed on the client only (null on the server).
  const today = useSyncExternalStore(
    subscribeNever,
    () => todayIn(business.hours.timeZone),
    () => null,
  );

  const errors = validateEnquiry(form, today ?? "0000-00-00");
  const set = (patch: Partial<CateringEnquiry>) => setForm((f) => ({ ...f, ...patch }));
  const id = (name: string) => `${uid}-${name}`;
  const err = (name: keyof typeof errors) =>
    showErrors && errors[name] ? (
      <small className="field-error" id={id(`${name}-err`)}>
        {errors[name]}
      </small>
    ) : null;
  const invalidProps = (name: keyof typeof errors) => ({
    "aria-invalid": showErrors && !!errors[name],
    "aria-describedby": showErrors && errors[name] ? id(`${name}-err`) : undefined,
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = (["name", "date", "guests", "location", "budget"] as const).find(
      (k) => errors[k],
    );
    if (first) {
      setShowErrors(true);
      document.getElementById(id(first))?.focus();
      return;
    }
    window.open(whatsappHref(buildCateringMessage(form)), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="catering-form" onSubmit={onSubmit} noValidate aria-label="Catering enquiry">
      <div className="field">
        <label htmlFor={id("name")}>Your name</label>
        <input
          id={id("name")}
          autoComplete="name"
          maxLength={80}
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          {...invalidProps("name")}
        />
        {err("name")}
      </div>

      <div className="field">
        <label htmlFor={id("eventType")}>Type of event</label>
        <select
          id={id("eventType")}
          value={form.eventType}
          onChange={(e) => set({ eventType: e.target.value as EventType })}
        >
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id("date")}>Event date</label>
          <input
            id={id("date")}
            type="date"
            min={today ?? undefined}
            value={form.date}
            onChange={(e) => set({ date: e.target.value })}
            {...invalidProps("date")}
          />
          {err("date")}
        </div>
        <div className="field">
          <label htmlFor={id("guests")}>Number of guests</label>
          <input
            id={id("guests")}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_GUESTS}
            value={form.guests}
            onChange={(e) => set({ guests: e.target.value })}
            {...invalidProps("guests")}
          />
          {err("guests")}
        </div>
      </div>

      <div className="field">
        <label htmlFor={id("location")}>Event location</label>
        <input
          id={id("location")}
          placeholder="e.g. Techiman, Nkwaeso church hall"
          maxLength={200}
          value={form.location}
          onChange={(e) => set({ location: e.target.value })}
          {...invalidProps("location")}
        />
        {err("location")}
      </div>

      <div className="field">
        <label htmlFor={id("budget")}>
          Budget in GH₵ <span className="optional">(optional)</span>
        </label>
        <input
          id={id("budget")}
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="e.g. 3000"
          value={form.budget}
          onChange={(e) => set({ budget: e.target.value })}
          {...invalidProps("budget")}
        />
        {err("budget")}
      </div>

      <div className="field">
        <label htmlFor={id("notes")}>
          What would you like? <span className="optional">(optional)</span>
        </label>
        <textarea
          id={id("notes")}
          rows={3}
          maxLength={400}
          placeholder="e.g. jollof, fried rice and food baskets"
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </div>

      <button className="button button-primary" type="submit">
        <ChatIcon /> Send enquiry on WhatsApp
      </button>
    </form>
  );
}
