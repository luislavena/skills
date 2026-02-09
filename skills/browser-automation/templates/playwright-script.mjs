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
 * Generated: {{GENERATED_DATE}}
 * Target: {{TARGET_URL}}
 * ---
 */

import { chromium } from "playwright";

const TARGET_URL = "{{TARGET_URL}}";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Add workflow-specific helpers here (date formatting, price parsing, etc.)

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const headed = process.argv.includes("--headed");

const browser = await chromium.launch({
  headless: !headed,
  // Disable automation detection flags that many sites check
  args: ["--disable-blink-features=AutomationControlled"],
});

const context = await browser.newContext({
  // Use a realistic user agent to avoid bot detection
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});

const page = await context.newPage();

try {
  // ------------------------------------------------------------------
  // Step 1: Navigate to the target page
  // ------------------------------------------------------------------
  console.log("Opening page...");
  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });

  // Dismiss cookie banner if present.
  // Adapt the button name to match the target site.
  const cookieBtn = page.getByRole("button", { name: "Accept cookies" });
  if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log("Accepting cookies...");
    await cookieBtn.click();
    await page.waitForTimeout(500);
  }

  // ------------------------------------------------------------------
  // Step 2: {{STEP_2_DESCRIPTION}}
  // ------------------------------------------------------------------
  // Replace this section with the first real interaction discovered
  // during the exploration phase.  Example patterns:
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
  // After completing the workflow, read confirmation or summary elements
  // and assert their values match expectations.
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

  // Capture a screenshot so the user can see what went wrong
  const screenshotPath = "error-screenshot.png";
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.error(`Screenshot saved to ${screenshotPath}`);

  process.exitCode = 1;
} finally {
  await browser.close();
}
