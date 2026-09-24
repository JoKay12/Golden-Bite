import { expect, test } from "@playwright/test";

test.describe("catering enquiry", () => {
  test.beforeEach(async ({ page }) => {
    // Record window.open instead of leaving the site.
    await page.addInitScript(() => {
      (window as unknown as { __opened: string[] }).__opened = [];
      window.open = ((url?: string | URL) => {
        (window as unknown as { __opened: string[] }).__opened.push(String(url));
        return null;
      }) as typeof window.open;
    });
    await page.goto("/#catering");
  });

  test("validates, then opens WhatsApp with the event details", async ({ page }) => {
    const form = page.getByRole("form", { name: "Catering enquiry" });
    await form.getByRole("button", { name: /send enquiry/i }).click();
    await expect(form.getByText("Please enter your name.")).toBeVisible();
    await expect(form.getByText("Please choose the event date.")).toBeVisible();
    await expect(form.getByLabel("Your name")).toBeFocused();
    expect(
      await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened),
    ).toEqual([]);

    const nextYear = new Date().getUTCFullYear() + 1;
    await form.getByLabel("Your name").fill("Akua Boateng");
    await form.getByLabel("Type of event").selectOption("Wedding or engagement");
    await form.getByLabel("Event date").fill(`${nextYear}-03-14`);
    await form.getByLabel("Number of guests").fill("150");
    await form.getByLabel("Event location").fill("Techiman, Nkwaeso church hall");
    await form.getByLabel(/budget/i).fill("6000");
    await form.getByRole("button", { name: /send enquiry/i }).click();

    const opened = await page.evaluate(
      () => (window as unknown as { __opened: string[] }).__opened,
    );
    expect(opened).toHaveLength(1);
    const url = new URL(opened[0]);
    expect(url.hostname).toBe("wa.me");
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain("Name: Akua Boateng");
    expect(text).toContain("Event: Wedding or engagement");
    expect(text).toContain(`14 March ${nextYear}`);
    expect(text).toContain("Guests: 150");
    expect(text).toContain("Budget: about GH₵6,000");
  });
});

test("unknown pages show the branded 404 with a way back to the menu", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This plate is");
  await page.getByRole("link", { name: "See the menu" }).click();
  await expect(page).toHaveURL(/\/#menu$/);
});

test("SEO files and structured data are served", async ({ page, request }) => {
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  await page.goto("/");
  const ld = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
  );
  expect(ld["@type"]).toBe("Restaurant");
  expect(ld.hasMenu.hasMenuSection).toHaveLength(6);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});
