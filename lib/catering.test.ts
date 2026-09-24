import { describe, expect, it } from "vitest";
import {
  buildCateringMessage,
  emptyEnquiry,
  formatEventDate,
  todayIn,
  validateEnquiry,
} from "./catering";

const good = {
  ...emptyEnquiry,
  name: " Akua  Boateng ",
  date: "2026-12-05",
  guests: "120",
  eventType: "Wedding or engagement" as const,
  location: "Techiman, Nkwaeso\nchurch hall",
  budget: "5000",
  notes: "Jollof and food baskets",
};

describe("catering enquiry validation", () => {
  it("accepts a complete enquiry", () => {
    expect(validateEnquiry(good, "2026-09-24")).toEqual({});
  });

  it("flags missing and invalid fields", () => {
    const errors = validateEnquiry({ ...emptyEnquiry, guests: "0", budget: "abc" }, "2026-09-24");
    expect(Object.keys(errors).sort()).toEqual(["budget", "date", "guests", "location", "name"]);
  });

  it("rejects past dates but allows today", () => {
    expect(validateEnquiry({ ...good, date: "2026-09-23" }, "2026-09-24").date).toBeDefined();
    expect(validateEnquiry({ ...good, date: "2026-09-24" }, "2026-09-24").date).toBeUndefined();
  });

  it("budget is optional", () => {
    expect(validateEnquiry({ ...good, budget: "" }, "2026-09-24")).toEqual({});
  });
});

describe("catering message", () => {
  it("includes every detail on tidy lines", () => {
    const msg = buildCateringMessage(good);
    expect(msg).toContain("Name: Akua Boateng");
    expect(msg).toContain("Event: Wedding or engagement");
    expect(msg).toContain("Date: Saturday, 5 December 2026");
    expect(msg).toContain("Guests: 120");
    expect(msg).toContain("Location: Techiman, Nkwaeso church hall");
    expect(msg).toContain("Budget: about GH₵5,000");
    expect(msg).toContain("Notes: Jollof and food baskets");
  });

  it("omits optional lines when empty", () => {
    const msg = buildCateringMessage({ ...good, budget: "", notes: " " });
    expect(msg).not.toContain("Budget");
    expect(msg).not.toContain("Notes");
  });
});

describe("dates", () => {
  it("formats and computes today in Accra", () => {
    expect(formatEventDate("2026-01-01")).toBe("Thursday, 1 January 2026");
    expect(todayIn("Africa/Accra", new Date("2026-09-24T23:30:00Z"))).toBe("2026-09-24");
  });
});
