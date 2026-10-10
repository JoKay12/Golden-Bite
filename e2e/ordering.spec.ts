import { expect, test, type Page } from "@playwright/test";

const decodeWhatsApp = (href: string | null) =>
  decodeURIComponent(new URL(href ?? "").searchParams.get("text") ?? "");

/** On phones the basket opens from the bottom bar; on desktop from the header button. */
async function openBasket(page: Page) {
  await page.getByRole("button", { name: /^Basket \d+ item/ }).click();
  const dialog = page.getByRole("dialog", { name: "Your basket" });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("page loads cleanly with no horizontal scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Satisfy your");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
});

test("adding meals merges quantities and does not open the basket", async ({ page }) => {
  const firstCard = page.locator(".menu-card").first();
  const add = firstCard.getByRole("button", { name: /^Add GH₵\d+: Jollof Rice & Chicken/ });
  await add.click();
  await add.click();
  await firstCard.getByRole("button", { name: "GH₵60" }).click();
  await add.click();

  await expect(page.locator(".toast-region")).toContainText("Added Jollof Rice & Chicken");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".cart-count")).toHaveText("3");

  const dialog = await openBasket(page);
  await expect(dialog.locator(".cart-items li")).toHaveCount(2);
  await expect(dialog.locator(".basket-total strong")).toHaveText("GH₵140");
  // The toast is cleared once the basket is open.
  await expect(page.locator(".toast")).toHaveCount(0);

  await dialog.getByRole("button", { name: "One less Jollof Rice & Chicken" }).click();
  await expect(dialog.locator(".basket-total strong")).toHaveText("GH₵100");
});

test("checkout requires details and builds the WhatsApp order", async ({ page }) => {
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  const dialog = await openBasket(page);

  await dialog.getByRole("link", { name: /send order on whatsapp/i }).click();
  await expect(dialog.getByText("Please enter your name.")).toBeVisible();
  await expect(dialog.getByLabel("Your name")).toBeFocused();

  await dialog.getByLabel("Your name").fill("Kofi Mensah");
  await dialog.getByLabel("Delivery area and landmark").fill("Tanoso, near the filling station");
  await dialog.getByRole("button", { name: "Cash", exact: true }).click();
  await dialog.getByLabel(/notes/i).fill("Extra shito");

  const message = decodeWhatsApp(
    await dialog.getByRole("link", { name: /send order on whatsapp/i }).getAttribute("href"),
  );
  expect(message).toContain("1 × Jollof Rice & Chicken (GH₵40) = GH₵40");
  expect(message).toContain("Name: Kofi Mensah");
  expect(message).toContain("Delivery location: Tanoso, near the filling station");
  expect(message).toContain("Mode of payment: Cash on delivery");
  expect(message).toContain("Notes: Extra shito");

  await dialog.getByRole("button", { name: "Pickup" }).click();
  await expect(dialog.getByLabel("Delivery area and landmark")).toHaveCount(0);
  const pickup = decodeWhatsApp(
    await dialog.getByRole("link", { name: /send order on whatsapp/i }).getAttribute("href"),
  );
  expect(pickup).toContain("Fulfilment: Pickup");
  expect(pickup).toContain("Mode of payment: Cash at pickup");

  await dialog.getByRole("button", { name: "MoMo", exact: true }).click();
  const momo = decodeWhatsApp(
    await dialog.getByRole("link", { name: /send order on whatsapp/i }).getAttribute("href"),
  );
  expect(momo).toContain("Mode of payment: MoMo (MTN Mobile Money 054 240 3077, KYERAA SANDRA)");
  expect(pickup).not.toContain("Delivery location");
});

test("Escape closes the basket and the basket survives a reload", async ({ page }) => {
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  let dialog = await openBasket(page);
  await dialog.getByLabel("Your name").fill("Ama");
  // Chrome's close-watcher can swallow an Escape that follows scripted input, so retry briefly.
  await expect(async () => {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden({ timeout: 500 });
  }).toPass({ timeout: 5000 });

  await page.reload();
  await expect(page.locator(".cart-count")).toHaveText("1");
  dialog = await openBasket(page);
  await expect(dialog.getByLabel("Your name")).toHaveValue("Ama");
});

test("food families switch the meals shown", async ({ page }) => {
  await page.getByRole("button", { name: "Banku & Tilapia" }).click();
  await expect(page.getByRole("button", { name: "Banku & Tilapia" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".menu-card h3")).toHaveText([
    "Tilapia",
    "Tilapia & Fried Eggs",
    "Banku",
  ]);
});

test("desktop shows the basket sidebar; phones show the bottom bar", async ({ page }, info) => {
  if (info.project.name === "desktop") {
    await expect(page.getByRole("complementary", { name: "Your order" })).toBeVisible();
    await expect(page.locator(".mobile-basket")).toBeHidden();
  } else {
    await expect(page.locator(".mobile-basket")).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Your order" })).toBeHidden();
  }
});

test("a sent order can be reordered later in one tap", async ({ page, context }) => {
  // Opening WhatsApp would leave the page, so swallow the new tab.
  context.on("page", (p) => p.close());
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  await page.getByRole("button", { name: /^Add GH₵40: Jollof Rice & Chicken/ }).click();
  let dialog = await openBasket(page);
  await dialog.getByLabel("Your name").fill("Ama");
  await dialog.getByRole("button", { name: "Pickup" }).click();
  await dialog.getByRole("link", { name: /send order on whatsapp/i }).click();
  await dialog.getByRole("button", { name: /clear basket/i }).click();

  // The empty basket offers the last order.
  await expect(dialog.getByText("2 × Jollof Rice & Chicken")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();

  // After a reload the menu greets the customer with it too.
  const banner = page.locator(".reorder-banner");
  await expect(banner).toContainText("2 × Jollof Rice & Chicken · GH₵80");
  await banner.getByRole("button", { name: /reorder my last order/i }).click();
  dialog = page.getByRole("dialog", { name: "Your basket" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".basket-total strong")).toHaveText("GH₵80");
  await expect(banner).toHaveCount(0);
});
