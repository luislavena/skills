---
name: browser-automation
description: Explore a website interactively with agent-browser, then generate a tested Playwright script that automates the discovered workflow. Use when users want to automate a web interaction, create a browser script, scrape a site, or fill out a form programmatically. Triggers include "automate this site", "automate fill this form", "navigate to and do", or any request involving browser workflow automation.
---

# Browser automation

You help users automate browser workflows by first exploring a target site interactively, then producing a tested Playwright script that reproduces the discovered flow.

The work happens in two distinct phases. Never skip Phase 1; the exploration is what makes the generated script reliable.

## Phase 1: Interactive exploration

Use `agent-browser` (via `npx agent-browser`) to walk through the target site. The goal is to build a **complete picture** of the page structure, selectors, data attributes, timing behavior, and edge cases before writing any code.

When presented with multiple options, ask the user for confirmation before proceeding.

**IMPORTANT:** Present the summary to the user and **wait for their confirmation** before proceeding to Phase 2. The user may want to adjust the flow, correct assumptions, or add steps before any code is generated.

### 1.1 Open the page

```
npx agent-browser open <url>
```

If the site blocks headless access (CDN bot detection, Akamai, Cloudflare), retry with headed mode and anti-detection flags:

```
npx agent-browser close
npx agent-browser --headed --args "--disable-blink-features=AutomationControlled" \
  --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  open <url>
```

### 1.2 Discover page structure

Take snapshots at every meaningful state change:

```
npx agent-browser snapshot        # full accessibility tree
npx agent-browser snapshot -i     # interactive elements only
npx agent-browser snapshot -c     # compact (removes empty nodes)
```

For each step of the user's desired workflow:

1. **Identify interactive elements** and their refs (`@e1`, `@e2`, ...).
2. **Record selectors**: note CSS classes, `data-*` attributes, ARIA roles, and text content. Prefer stable attributes (`data-*`, `role`, `aria-label`) over brittle ones (nth-child, generated class names).
3. **Check for hidden state**: use `eval` to inspect attributes the snapshot does not expose (e.g. `data-availability`, `disabled`, `aria-pressed`).
4. **Handle obstacles**: dismiss cookie banners, close modals, accept terms before proceeding.

### 1.3 Interact and observe

Click, fill, and navigate using refs from the snapshot:

```
npx agent-browser click @e5
npx agent-browser fill @e3 "some text"
npx agent-browser select @e7 "option-value"
```

After every interaction, **re-snapshot** to capture the new state. Page transitions invalidate previous refs.

When a standard click times out or a button is hidden (mobile/desktop variants), fall back to JavaScript evaluation:

```
npx agent-browser eval "document.querySelector('selector').click()"
```

### 1.4 Catalog what you learned

Before moving to Phase 2, compile a **Site exploration notes** block for yourself that records:

- **URL and anti-bot measures** observed (headed mode needed, custom UA, etc.)
- **Step-by-step flow** with the action taken and the resulting page state
- **Selectors used** at each step and why they were chosen
- **Dynamic data** (availability attributes, loaded-via-JS elements, timing-sensitive content)
- **Edge cases** (sold-out slots, hidden buttons, dual mobile/desktop elements)
- **Validation points** (summary panels, confirmation text, status messages)

This catalog is the source of truth for the script you will generate.

## Credential and environment variable handling

When the user asks to use environment variables for credentials (e.g. HTTP Basic Auth usernames, passwords, API keys), follow these rules strictly:

1. **Never read environment variable values into the conversation context.** Do not run `echo $VAR`, `printenv VAR`, or any command that would expose the secret in tool output.
2. **Interpolate as shell variables in commands.** When passing credentials in shell commands, reference them directly as `${VAR_NAME}` so the shell resolves them at runtime:

   ```
   # Set credentials before navigation
   npx agent-browser set credentials ${HTTP_USERNAME} ${HTTP_PASSWORD}

   # Navigate to protected resource
   npx agent-browser open "https://example.com/protected"
   ```

3. **Use `process.env` in generated scripts.** In the Playwright script, read credentials from the environment at runtime:

   ```js
   const username = process.env.HTTP_USERNAME;
   const password = process.env.HTTP_PASSWORD;
   if (!username || !password) {
     throw new Error("Missing required environment variables: HTTP_USERNAME, HTTP_PASSWORD");
   }
   ```

4. **Document required variables.** Add a "Required environment variables" section to the script header listing every variable the script expects, without default values or examples that could leak secrets.
5. **Include in run instructions.** When presenting the result, show how to pass variables:

   ```
   HTTP_USERNAME=<value> HTTP_PASSWORD=<value> node bin/script.mjs
   ```

   Or note that they should be exported beforehand.

## Phase 2: Script generation

Translate the exploration notes into a standalone Playwright script.

### 2.1 Scaffold the script

Use the template in [templates/playwright-script.mjs](templates/playwright-script.mjs) as a starting point. The template includes:

- Anti-detection launch flags and custom user agent
- Cookie banner dismissal
- Structured step comments
- Error handling with screenshot capture
- `--headed` CLI flag for visual debugging

#### Fill in template placeholders

The template contains placeholders that **must be filled in** so the script is self-documenting. When someone opens the file later, the header should give them full context about what it does and why.

| Placeholder | What to write |
|---|---|
| `{{SCRIPT_DESCRIPTION}}` | A one-line summary of what the script does (e.g., "Books a time slot on example.com and validates the cart"). Keep it under 80 characters. |
| `{{SCRIPT_NAME}}` | The filename without the `.mjs` extension. Must match the actual file you create (e.g., `book-timeslot` if the file is `bin/book-timeslot.mjs`). |
| `{{ORIGINAL_REQUEST}}` | The user's original instructions, quoted verbatim or closely paraphrased. Wrap to 72 characters with leading whitespace to stay inside the comment block. |
| `{{FLOW_MODIFICATIONS}}` | Any changes the user requested after reviewing the exploration summary (added steps, removed steps, adjusted parameters). Write "None" if the user approved the flow without changes. |
| `{{WORKFLOW_SUMMARY}}` | A numbered list of the high-level steps the script performs (e.g. "1. Navigate to booking page, 2. Select date and time, 3. Add to cart, 4. Validate summary"). One step per line, indented to align inside the comment block. |
| `{{REQUIRED_ENV_VARS}}` | A list of environment variables the script needs at runtime (e.g. `HTTP_USERNAME`, `HTTP_PASSWORD`). Write "None" if the script does not require any. Never include actual values or examples that could leak secrets. |
| `{{GENERATED_DATE}}` | The current date in YYYY-MM-DD format. |
| `{{TARGET_URL}}` | The target URL for the automation. This value appears in both the header comment and the `TARGET_URL` constant in the script body; use the same value for both. |

This metadata block serves as a quick reference when revisiting the script. Keep each field concise but complete enough to understand the intent without reading the code.

**Step comments:** The template includes numbered step sections with placeholder comments (e.g., `Step 2: {{STEP_2_DESCRIPTION}}`). Replace each placeholder with a brief description of that step's action (e.g., "Select date from calendar"). Add or remove step sections as needed to match the workflow discovered in Phase 1.

**Validation checkpoint:** Before testing, search the script for `{{` to confirm no unfilled placeholders remain.

#### Adapt the template to the workflow

Every script should:

1. Accept a `--headed` flag so users can watch the browser.
2. Log each step to the console with clear descriptions.
3. Use resilient selectors (data attributes, ARIA roles, text content).
4. Include explicit waits based on what the exploration revealed (not arbitrary sleeps).
5. Validate results before proceeding to the next step.

### 2.2 Selector strategy (order of preference)

1. **Data attributes**: `[data-availability="available"]`, `[data-cart-step-btn]`
2. **ARIA roles and labels**: `getByRole('button', { name: 'Increase quantity' })`
3. **CSS classes scoped to the component**: `.sidebar__hours-btn`, `.list-cart__price-label`
4. **Text content** (via Playwright locators): `locator('li', { hasText: 'Full Rate' })`
5. **`page.evaluate()`** as last resort for hidden elements or React state that does not respond to synthetic events.

### 2.3 Iframe handling

Many sites embed critical functionality inside iframes: payment forms (Stripe, Braintree), chat widgets, consent managers, and third-party widgets. Playwright cannot interact with iframe content using regular locators; you must use `frameLocator()` to scope into the iframe first.

#### Basic pattern

```js
// Locate the iframe by its selector, then interact with elements inside it
const paymentFrame = page.frameLocator('iframe[name="payment-form"]');
await paymentFrame.locator('#card-number').fill('4242424242424242');
await paymentFrame.locator('#expiry').fill('12/30');
await paymentFrame.locator('#cvc').fill('123');
await paymentFrame.getByRole('button', { name: 'Pay' }).click();
```

#### Key points

- `frameLocator()` returns a locator-like object scoped to the iframe content
- All standard locator methods (`.locator()`, `.getByRole()`, `.fill()`, `.click()`) work inside the frame
- Playwright handles cross-origin iframes automatically; you do not need special permissions
- Nested iframes require chaining: `page.frameLocator('#outer').frameLocator('#inner')`

#### Common iframe scenarios

| Scenario | Typical selector | Notes |
|---|---|---|
| Payment forms (Stripe) | `iframe[name*="stripe"]` | Multiple iframes for card number, expiry, CVC |
| Chat widgets | `iframe[title*="chat"]` | Often appears after delay |
| Consent managers | `iframe[src*="consent"]` | May block main page interaction |
| Embedded maps | `iframe[src*="maps"]` | Usually read-only, rarely need interaction |

#### Waiting for iframe content

If the iframe loads content dynamically, wait for an element inside it before interacting:

```js
const frame = page.frameLocator('iframe#checkout');
await frame.locator('#card-number').waitFor({ state: 'visible', timeout: 10000 });
await frame.locator('#card-number').fill(cardNumber);
```

### 2.4 Timing strategy

Never use arbitrary `waitForTimeout` as the primary wait. Prefer:

- `waitForSelector` for elements that appear after navigation or AJAX
- `waitForFunction` for conditions in JavaScript state (button enabled, attribute changed)
- `waitForTimeout` only as a small buffer after a confirmed state change

When the exploration revealed that a button exists in two variants (mobile hidden, desktop visible), use `page.evaluate()` to click the enabled one rather than fighting visibility checks.

### 2.4 Add validation steps

After completing the main workflow, add assertions that verify the final state. Query the page for summary or confirmation elements and compare their values against the expected outcome. For example:

- Read a summary panel and assert the item name, quantity, and total.
- Verify a confirmation message appeared.
- Check that a "proceed" button is enabled.

Collect all mismatches into an array and throw a single descriptive error so the user sees every failure at once.

### 2.5 Iterate until the script passes in both modes

The script must pass in **both headless and headed mode** before it is considered done. Some sites behave differently depending on whether a visible browser window is present (bot detection, viewport-dependent rendering, lazy loading triggers), so testing only one mode is not sufficient.

#### Step 1: Test in headed mode first

Start with headed mode so you can visually confirm each step works:

```
node bin/<script-name>.mjs --headed
```

Fix any failures before moving on. Headed mode is easier to debug because you can see what the browser is doing.

#### Step 2: Test in headless mode

Once headed mode passes, run without the flag:

```
node bin/<script-name>.mjs
```

If headless mode fails where headed mode succeeded, the cause is almost always one of:

| Headless-specific symptom | Likely cause | Fix |
|---|---|---|
| Access Denied / blank page | Bot detection triggers on headless | Ensure anti-detection args and custom UA are set in the script |
| Element not visible / click intercepted | Viewport too small for element | Increase viewport dimensions or scroll element into view |
| Timeout waiting for selector | Lazy loading needs a visible window | Add `waitForSelector` with longer timeout, or trigger scroll via `page.evaluate()` |
| Screenshot shows different layout | Site has responsive breakpoints | Adjust viewport to match target device width |

#### Step 3: Confirm both pass

Re-run both commands one final time after all fixes:

```
node bin/<script-name>.mjs --headed
node bin/<script-name>.mjs
```

The script is done only when **both runs complete end-to-end with all validations passing**.

#### Common issues (both modes)

| Symptom | Likely cause | Fix |
|---|---|---|
| Timeout waiting for selector | Element loaded later than expected | Increase timeout or add a preceding wait |
| Strict mode violation (multiple matches) | Locator is too broad | Add a more specific selector or use `.first()` / `.nth()` |
| Element not visible | Mobile/desktop dual rendering | Use `page.evaluate()` to click |
| Click has no effect | React/framework swallows synthetic events | Dispatch native events via `page.evaluate()` |
| Access Denied on navigation | Bot detection | Switch to headed mode with anti-detection flags |

## Presenting the result

When the script passes in both headless and headed mode, provide the user with:

1. **How to run it**: both commands (`node bin/<name>.mjs` for CI/headless and `node bin/<name>.mjs --headed` for visual debugging).
2. **Test results**: confirm that the script passed in both headless and headed mode.
3. **Step summary**: a numbered list of what the script does.
4. **Key implementation details**: anti-detection measures, selector choices, validation logic.
5. **Limitations**: anything that might break if the site changes (fragile selectors, time-sensitive availability).

## Additional resources

- For the script template, see [templates/playwright-script.mjs](templates/playwright-script.mjs)
- For a detailed exploration reference, see [references/exploration-guide.md](references/exploration-guide.md)
