/**
 * {{SCRIPT_DESCRIPTION}}
 *
 * Usage:
 *   node bin/{{SCRIPT_NAME}}.mjs [--headed]
 *
 * Requires: playwright (npm install playwright)
 *
 * ---
 * Original request:
 *   {{ORIGINAL_REQUEST}}
 *
 * Flow modifications:
 *   {{FLOW_MODIFICATIONS}}
 *
 * Workflow summary:
 *   {{WORKFLOW_SUMMARY}}
 *
 * Required environment variables:
 *   {{REQUIRED_ENV_VARS}}
 *
 * Generated: {{GENERATED_DATE}}
 * Target: {{TARGET_URL}}
 * ---
 */

import { chromium } from "playwright";

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------

// When the workflow needs credentials or secrets, read them from the
// environment at runtime. Never write secret values in this file.
//
// Example:
//   const username = process.env.HTTP_USERNAME;
//   const password = process.env.HTTP_PASSWORD;
//   if (!username || !password) {
//     throw new Error("Missing required env vars: HTTP_USERNAME, HTTP_PASSWORD");
//   }

const TARGET_URL = "{{TARGET_URL}}";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Add the helpers of this workflow here (date format, price parsing, and so on)

// ---------------------------------------------------------------------------
// Iframe handling
// ---------------------------------------------------------------------------

// To use elements inside an iframe (payment form, chat widget, consent
// manager), go into the iframe with frameLocator() first:
//
//   const paymentFrame = page.frameLocator('iframe[name="payment-form"]');
//   await paymentFrame.locator('#card-number').fill(cardNumber);
//   await paymentFrame.locator('#expiry').fill(expiry);
//   await paymentFrame.locator('#cvc').fill(cvc);
//   await paymentFrame.getByRole('button', { name: 'Pay' }).click();
//
// For an iframe inside an iframe, chain the frameLocator calls:
//   page.frameLocator('#outer').frameLocator('#inner').locator('button')

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const headed = process.argv.includes("--headed");

const browser = await chromium.launch({
  headless: !headed,
  // Hide the automation flags that many sites read
  args: ["--disable-blink-features=AutomationControlled"],
});

const context = await browser.newContext({
  // A real user agent helps against bot detection
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  // An explicit viewport keeps headed and headless rendering the same
  viewport: { width: 1280, height: 720 },
});

const page = await context.newPage();

try {
  // ------------------------------------------------------------------
  // Step 1: Navigate to the target page
  // ------------------------------------------------------------------
  console.log("Opening page...");
  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });

  // Close the cookie banner, if it is there.
  // Change the button name to match the target site.
  const cookieBtn = page.getByRole("button", { name: "Accept cookies" });
  if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log("Accepting cookies...");
    await cookieBtn.click();
    await page.waitForTimeout(500);
  }

  // ------------------------------------------------------------------
  // Step 2: {{STEP_2_DESCRIPTION}}
  // ------------------------------------------------------------------
  // Replace this section with the first real interaction from the
  // exploration phase. Examples:
  //
  //   await page.locator('[data-action="open"]').click();
  //   await page.waitForSelector('.modal-content', { timeout: 10000 });
  //
  //   await page.getByRole('button', { name: 'Submit' }).click();
  //
  //   await page.locator('li', { hasText: 'Option A' }).click();

  // ------------------------------------------------------------------
  // Step N: Validate the result
  // ------------------------------------------------------------------
  // After the main flow, read the confirmation or summary elements and
  // compare their values with the expected result.
  //
  // const summary = await page.evaluate(() => {
  //   return {
  //     item: document.querySelector('.summary-item')?.textContent.trim(),
  //     total: document.querySelector('.summary-total')?.textContent.trim(),
  //   };
  // });
  //
  // const errors = [];
  // if (!summary.item?.includes("Expected item")) {
  //   errors.push(`Item: expected "Expected item", got "${summary.item}"`);
  // }
  // if (errors.length > 0) {
  //   throw new Error("Validation failed:\n  - " + errors.join("\n  - "));
  // }
  //
  // console.log("All validations passed.");

  // ------------------------------------------------------------------
  // Done
  // ------------------------------------------------------------------
  console.log("\nWorkflow complete.");

  if (headed) {
    console.log("Browser will stay open for 30 seconds...");
    await page.waitForTimeout(30000);
  }
} catch (err) {
  console.error("\nError:", err.message);

  // Take a screenshot, so the user sees the failure
  const screenshotPath = "error-screenshot.png";
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.error(`Screenshot saved to ${screenshotPath}`);

  process.exitCode = 1;
} finally {
  await browser.close();
}
