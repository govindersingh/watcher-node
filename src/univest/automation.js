// src/univest/automation.js
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { config } from "../config/env.js";

// Path to saved storage state (create this with manual login flow)
const STORAGE_PATH = path.resolve(process.cwd(), "secrets", "univestStorage.json");
console.log(STORAGE_PATH);

export async function ensureLoggedInAndExit(symbol) {
  if (!fs.existsSync(STORAGE_PATH)) {
    throw new Error("Missing storage state. Run the login helper to create univestStorage.json");
  }

  // Launch browser (headless: false for debug; true for production)
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Create a context with saved session
  const context = await browser.newContext({
    storageState: STORAGE_PATH,
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    // Navigate to Univest home/dashboard
    await page.goto(config.UNIVEST_BASE_URL || "https://univest.in", { waitUntil: "networkidle" });

    // Optionally verify we are logged-in by checking for a known selector
    // Replace the selector below with something real from Univest (e.g., profile avatar)
    // ✅ Check both possible indicators of login
    const profileButton = page.locator('button[aria-label="Profile"]');
    const logoutText = page.locator('text=Logout');

    const isLoggedIn =
    (await profileButton.count()) > 0 || (await logoutText.count()) > 0;

    if (!isLoggedIn) {
    throw new Error("Not logged in — storage state may be invalid or expired.");
    }


    // Navigate to holdings or search for symbol
    // Example: click search box, type symbol, open instrument page
    // Replace selectors with actual page-specific selectors
    await page.click('css=input[placeholder="Search"]'); // adjust selector
    await page.fill('css=input[placeholder="Search"]', symbol);
    await page.keyboard.press('Enter');

    // Wait for search results and click the matching result
    // Example selector: .search-result-item >> text=${symbol}
    await page.waitForTimeout(1000);
    const result = page.locator(`text=${symbol}`).first();
    await result.click();

    // On instrument page, locate "Exit" / "Sell" button and click
    // Replace with exact selector for the exit action on univest
    await page.waitForSelector('button:has-text("Exit"), button:has-text("Sell")', { timeout: 5000 });
    const exitBtn = page.locator('button:has-text("Exit"), button:has-text("Sell")').first();
    await exitBtn.click();

    // Confirm exit (if modal)
    // Replace selector for confirm button
    await page.waitForSelector('button:has-text("Confirm"), button:has-text("Place Order")', { timeout: 5000 });
    const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Place Order")').first();
    await confirmBtn.click();

    // Wait for success state or a toast
    await page.waitForSelector('text=Order placed, text=Order executed, text=Success', { timeout: 10000 });

    // Optionally take screenshot for audit
    const screenshotPath = path.resolve(process.cwd(), "logs", `univest_${symbol}_${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    await context.close();
    await browser.close();

    return { ok: true, screenshot: screenshotPath, message: "Exit executed" };
  } catch (err) {
    // capture error with screenshot
    const errShot = path.resolve(process.cwd(), "logs", `univest_error_${Date.now()}.png`);
    try { await page.screenshot({ path: errShot, fullPage: false }); } catch (e) {}
    await context.close();
    await browser.close();
    return { ok: false, error: err.message, screenshot: errShot };
  }
}
