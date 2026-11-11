import { expect, test } from "@playwright/test";

/**
 * Public catalog for Sunil Travels. Needs local Supabase with the catalog seed
 * for any test that opens the fleet. It does not need the FastAPI backend.
 */
test.describe("Sunil Travels", () => {
  test("offers self-drive and a driver on the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Sunil Travels/);
    await expect(page.getByRole("radio", { name: "Self-drive" })).toBeChecked();
    await page.getByRole("radio", { name: "With a driver" }).check();
    await expect(page.getByRole("radio", { name: "Airport transfer" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Local trip" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Outstation trip" })).toBeVisible();
  });

  test("keeps a return that is before pickup on the home page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#pickup").fill("2026-11-23T18:00");
    await page.locator("#return").fill("2026-11-20T09:30");
    await page.getByRole("button", { name: "Show cars" }).click();

    await expect(page.getByRole("alert")).toContainText(/return has to be after/i);
    await expect(page).toHaveURL(/\/$/);
  });

  test("lists self-drive cars and opens one at a day rate", async ({ page }) => {
    await page.goto("/");
    await page.locator("#pickup").fill("2026-11-20T09:30");
    await page.locator("#return").fill("2026-11-23T18:00");
    await page.getByRole("button", { name: "Show cars" }).click();

    await expect(page.getByRole("heading", { name: "Cars for this hire" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Hyundai Creta/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Maruti WagonR/ })).toBeVisible();

    await page.getByRole("link", { name: /Hyundai Creta/ }).click();
    await expect(page.getByRole("heading", { name: "Hyundai Creta" })).toBeVisible();
    await expect(page.getByText(/per day/)).toBeVisible();
  });

  test("leaves a self-drive-only car off an airport list", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: "With a driver" }).check();
    await page.locator("#airport-when").fill("2026-11-20T09:30");
    await page.locator("#airport-meetup").fill("Kothrud");
    await page.getByRole("button", { name: "Show cars" }).click();

    await expect(page.getByRole("link", { name: /Hyundai Creta/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Maruti WagonR/ })).toHaveCount(0);
  });

  test("asks for a callable phone before WhatsApp", async ({ page }) => {
    await page.goto("/");
    await page.locator("#pickup").fill("2026-11-20T09:30");
    await page.locator("#return").fill("2026-11-23T18:00");
    await page.getByRole("button", { name: "Show cars" }).click();
    await page.getByRole("link", { name: /Hyundai Creta/ }).click();
    await page.getByRole("link", { name: "Send an enquiry" }).click();

    await page.getByLabel("Name").fill("Priya");
    await page.getByLabel("Callback phone").fill("123");
    await page.getByRole("button", { name: "Send on WhatsApp" }).click();
    await expect(page.getByRole("alert")).toContainText(/phone/i);
  });

  test("saves a guest enquiry and opens WhatsApp", async ({ page }) => {
    await page.addInitScript(() => {
      window.open = (url?: string | URL) => {
        document.documentElement.dataset.whatsapp = String(url ?? "");
        return null;
      };
    });
    await page.goto("/");
    await page.locator("#pickup").fill("2026-11-20T09:30");
    await page.locator("#return").fill("2026-11-23T18:00");
    await page.getByRole("button", { name: "Show cars" }).click();
    await page.getByRole("link", { name: /Hyundai Creta/ }).click();
    await page.getByRole("link", { name: "Send an enquiry" }).click();
    await page.getByLabel("Name").fill("Priya");
    await page.getByLabel("Callback phone").fill("9800098000");
    await page.getByRole("button", { name: "Send on WhatsApp" }).click();
    await expect(page.getByText("Saved. WhatsApp should open with this enquiry.")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-whatsapp", /wa\.me\/919800000000/);
  });

  test("shows about and contact without signing in", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /About Sunil Travels/ })).toBeVisible();
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    await expect(
      page.locator("section").getByRole("link", { name: "98000 00000", exact: true }),
    ).toBeVisible();
  });
});
