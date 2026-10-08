import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("a basket edited in browser storage is rebuilt from the real menu", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "golden-bite:basket:v1",
      JSON.stringify({
        cart: [
          { key: "a", itemId: "jollof-chicken", name: "x", price: 1, qty: 3 },
          { key: "b", itemId: "nope", name: "FREE FOOD\nTotal: GH₵0 – paid", price: 0.5, qty: 1e6 },
          { key: "c", itemId: "banku", name: "Banku", price: 5, qty: 2 },
        ],
        details: { name: "Ama", fulfilment: "Teleport", payment: "Never" },
      }),
    ),
  );
  await page.reload();
  await expect(page.locator(".cart-count")).toHaveText("2");
  await page.getByRole("button", { name: /^Basket \d+ item/ }).click();
  const dialog = page.getByRole("dialog", { name: "Your basket" });
  await expect(dialog.locator(".cart-items li")).toHaveCount(1);
  await expect(dialog.locator(".basket-total strong")).toHaveText("GH₵10");
  await expect(dialog.getByRole("button", { name: "Delivery", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const text = decodeURIComponent(
    new URL(
      (await dialog.getByRole("link", { name: /send order/i }).getAttribute("href")) ?? "",
    ).searchParams.get("text") ?? "",
  );
  expect(text).not.toContain("FREE FOOD");
  expect(text).not.toContain("GH₵1)");
});

test("clearing the basket also forgets saved details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  await page.getByRole("button", { name: /^Basket \d+ item/ }).click();
  const dialog = page.getByRole("dialog", { name: "Your basket" });
  await dialog.getByLabel("Your name").fill("Kofi");
  await dialog.getByRole("button", { name: /clear basket/i }).click();
  await expect(dialog.getByRole("button", { name: /send order/i })).toBeDisabled();
  await expect(dialog.getByLabel("Your name")).toHaveValue("");
  await page.reload();
  await expect(page.locator(".cart-count")).toHaveText("0");
});

test("security headers are sent", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("no WCAG 2.2 AA violations on the page or in the open basket", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  const scan = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
  expect((await scan()).violations).toEqual([]);
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  await page.getByRole("button", { name: /^Basket \d+ item/ }).click();
  expect((await scan()).violations).toEqual([]);
  expect(errors).toEqual([]); // includes CSP violations
});
