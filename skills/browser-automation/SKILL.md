---
name: browser-automation
description: Explore a website with agent-browser, then write a tested Playwright script that repeats the flow. Use when users want to automate a web interaction, create a browser script, scrape a site, or fill a form with code. Triggers include "automate this site", "automate fill this form", "navigate to and do", or any request about browser workflow automation.
---

# Browser automation

This skill automates a browser workflow in two phases. Phase 1 explores the
target site. Phase 2 writes a Playwright script that repeats the flow.

Do not skip Phase 1. The exploration gives the script the selectors and the
timing it needs.

**Important:** Run all CLI commands with the package runner of the project:
`npx agent-browser`, `pnpm dlx agent-browser`, or `bunx --bun agent-browser`.
The examples use `npx agent-browser`. Replace it with the correct runner.

## Phase 1: Explore the site

Use `agent-browser` to walk through the site. Record the page structure, the
selectors, the data attributes, the timing, and the edge cases before you write
code.

If there is more than one option, ask the user which one to use.

**Important:** Show the summary to the user and wait for approval before
Phase 2. The user can change the flow, correct an assumption, or add a step
before you write code.

### 1.1 Open the page

```
npx agent-browser open <url>
```

Some sites block headless access (CDN bot protection, Akamai, Cloudflare). If
this happens, try again in headed mode, with the flags against bot detection,
example:

```
npx agent-browser close
npx agent-browser --headed --args "--disable-blink-features=AutomationControlled" \
  --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  open <url>
```

### 1.2 Find the page structure

Take a snapshot after each change of state:

```
npx agent-browser snapshot        # full accessibility tree
npx agent-browser snapshot -i     # interactive elements only
npx agent-browser snapshot -c     # compact (removes empty nodes)
```

For each step of the workflow the user wants:

1. **Find the interactive elements** and their refs (`@e1`, `@e2`, ...).
2. **Write down the selectors.** Note the CSS classes, the `data-*` attributes,
   the ARIA roles, and the text. Prefer stable attributes (`data-*`, `role`,
   `aria-label`) and avoid weak ones (nth-child, generated class names).
3. **Look for hidden state.** Use `eval` to read attributes that the snapshot
   does not show (Eg. `data-availability`, `disabled`, `aria-pressed`).
4. **Remove obstacles.** Close cookie banners and modals, and accept terms
   first.

### 1.3 Interact and observe

Click, fill, and navigate with the refs from the snapshot:

```
npx agent-browser click @e5
npx agent-browser fill @e3 "some text"
npx agent-browser select @e7 "option-value"
```

Take a new snapshot after each interaction. A page transition makes the old
refs invalid.

If a click times out, or the button is hidden (mobile and desktop variants),
use JavaScript instead:

```
npx agent-browser eval "document.querySelector('selector').click()"
```

### 1.4 Write down what you found

Before Phase 2, write a **Site exploration notes** block for yourself. It
records:

- **URL and bot protection** found (headed mode, custom user agent, and so on)
- **Steps of the flow**, with the action and the page state after it
- **Selectors** used at each step, and the reason for each choice
- **Dynamic data** (availability attributes, elements loaded by JavaScript,
  content that depends on timing)
- **Edge cases** (sold out slots, hidden buttons, double mobile and desktop
  elements)
- **Validation points** (summary panels, confirmation text, status messages)

These notes are the source of truth for the script.

## Credentials and environment variables

The user can ask to keep credentials in environment variables (Eg. HTTP Basic
Auth user names, passwords, API keys). Obey these rules:

1. **Never read the value of a variable into the conversation.** Do not run
   `echo $VAR`, `printenv VAR`, or any command that prints the secret in the
   tool output.
2. **Use shell variables in commands.** Write `${VAR_NAME}`, so the shell
   replaces the value at runtime:

   ```
   # Set the credentials before navigation
   npx agent-browser set credentials ${HTTP_USERNAME} ${HTTP_PASSWORD}

   # Open the protected page
   npx agent-browser open "https://example.com/protected"
   ```

3. **Use `process.env` in the script.** Read the credentials at runtime:

   ```js
   const username = process.env.HTTP_USERNAME;
   const password = process.env.HTTP_PASSWORD;
   if (!username || !password) {
     throw new Error("Missing required environment variables: HTTP_USERNAME, HTTP_PASSWORD");
   }
   ```

4. **List the variables.** Add a "Required environment variables" section to
   the script header. List each variable the script needs. Do not add values or
   examples, because they can leak the secret.
5. **Show how to pass them.** When you present the result, show the command:

   ```
   HTTP_USERNAME=<value> HTTP_PASSWORD=<value> node bin/script.mjs
   ```

   You can also tell the user to export the variables first.

## Phase 2: Write the script

Turn the exploration notes into a standalone Playwright script.

### 2.1 Start from the template

Use [templates/playwright-script.mjs](templates/playwright-script.mjs) as the
start. The template has:

- Launch flags and a custom user agent against bot detection
- Cookie banner dismissal
- Step comments
- Error handling with a screenshot
- A `--headed` flag, to watch the browser

#### Fill in the placeholders

Fill each placeholder, so the script explains itself. The header must give full
context to the next reader.

| Placeholder | What to write |
|---|---|
| `{{SCRIPT_DESCRIPTION}}` | One line about what the script does (Eg. "Books a time slot on example.com and checks the cart"). Keep it below 80 characters. |
| `{{SCRIPT_NAME}}` | The file name, without the `.mjs` extension. It must match the file you create (Eg. `book-timeslot` for `bin/book-timeslot.mjs`). |
| `{{ORIGINAL_REQUEST}}` | The words of the user, quoted or very close to it. Wrap at 72 characters, with leading spaces to stay inside the comment block. |
| `{{FLOW_MODIFICATIONS}}` | The changes the user asked for after the exploration summary (steps added, steps removed, parameters changed). Write "None" if the user approved the flow as it was. |
| `{{WORKFLOW_SUMMARY}}` | A numbered list of the main steps (Eg. "1. Open the booking page, 2. Select date and time, 3. Add to cart, 4. Check the summary"). One step per line, indented inside the comment block. |
| `{{REQUIRED_ENV_VARS}}` | The environment variables the script needs at runtime (Eg. `HTTP_USERNAME`, `HTTP_PASSWORD`). Write "None" if it needs none. Never write values or examples that can leak a secret. |
| `{{GENERATED_DATE}}` | Today's date, in YYYY-MM-DD format. |
| `{{TARGET_URL}}` | The URL to automate. Use the same value in the header comment and in the `TARGET_URL` constant. |

This block is the quick reference when someone opens the script later. Keep
each field short, but complete enough to show the intent without a read of the
code.

**Step comments:** The template has numbered step sections with placeholder
comments (Eg. `Step 2: {{STEP_2_DESCRIPTION}}`). Replace each one with a short
description of the action (Eg. "Select the date in the calendar"). Add or
remove step sections to match the flow from Phase 1.

**Check before you test:** Search the script for `{{`. No placeholder can
remain.

#### Adapt the template to the flow

Every script must:

1. Accept a `--headed` flag, so the user can watch the browser.
2. Print each step to the console, with a clear description.
3. Use stable selectors (data attributes, ARIA roles, text).
4. Wait for what the exploration found, not for an arbitrary time.
5. Check the result before the next step.

### 2.2 Selector preference, in order

1. **Data attributes**: `[data-availability="available"]`, `[data-cart-step-btn]`
2. **ARIA roles and labels**: `getByRole('button', { name: 'Increase quantity' })`
3. **CSS classes of the component**: `.sidebar__hours-btn`, `.list-cart__price-label`
4. **Text content**, with a Playwright locator: `locator('li', { hasText: 'Full Rate' })`
5. **`page.evaluate()`** as the last option, for hidden elements or React state
   that ignores synthetic events.

### 2.3 Iframes

Many sites put important parts in an iframe: payment forms (Stripe,
Braintree), chat widgets, consent managers, and other third-party widgets. A
usual Playwright locator does not see the content of an iframe. Use
`frameLocator()` first, to go into the iframe.

#### Basic pattern

```js
// Find the iframe with its selector, then use the elements inside it
const paymentFrame = page.frameLocator('iframe[name="payment-form"]');
await paymentFrame.locator('#card-number').fill('4242424242424242');
await paymentFrame.locator('#expiry').fill('12/30');
await paymentFrame.locator('#cvc').fill('123');
await paymentFrame.getByRole('button', { name: 'Pay' }).click();
```

#### Key points

- `frameLocator()` gives a locator limited to the content of the iframe
- All the usual locator methods work inside the frame (`.locator()`,
  `.getByRole()`, `.fill()`, `.click()`)
- Playwright handles cross-origin iframes. No special permission is necessary
- For an iframe inside an iframe, chain the calls:
  `page.frameLocator('#outer').frameLocator('#inner')`

#### Common iframe cases

| Case | Usual selector | Notes |
|---|---|---|
| Payment form (Stripe) | `iframe[name*="stripe"]` | One iframe for each field: card number, expiry, CVC |
| Chat widget | `iframe[title*="chat"]` | Often appears after a delay |
| Consent manager | `iframe[src*="consent"]` | Can block the main page |
| Embedded map | `iframe[src*="maps"]` | Usually read only, interaction is rare |

#### Wait for the iframe content

If the iframe loads its content later, wait for an element inside it first:

```js
const frame = page.frameLocator('iframe#checkout');
await frame.locator('#card-number').waitFor({ state: 'visible', timeout: 10000 });
await frame.locator('#card-number').fill(cardNumber);
```

### 2.4 Timing

Do not use `waitForTimeout` as the main wait. Prefer:

- `waitForSelector` for an element that appears after navigation or an AJAX
  call
- `waitForFunction` for a condition in JavaScript state (button enabled,
  attribute changed)
- `waitForTimeout` only as a small delay after a confirmed change of state

If the exploration found two variants of a button (mobile hidden, desktop
visible), use `page.evaluate()` to click the enabled one. Do not fight the
visibility checks.

### 2.5 Add validation steps

After the main flow, add checks on the final state. Read the summary or
confirmation elements and compare the values with the expected result. For
example:

- Read the summary panel and check the item name, the quantity, and the total.
- Confirm the confirmation message appeared.
- Confirm the "proceed" button is enabled.

Collect all the differences in an array, then throw one error with all of them.
The user sees every failure at the same time.

### 2.6 Test in both modes

The script must pass in headless mode and in headed mode. Some sites behave
differently when a visible window is present (bot detection, rendering that
depends on the viewport, lazy loading). One mode is not enough.

#### Step 1: Test headed mode first

Start in headed mode, to see each step:

```
node bin/<script-name>.mjs --headed
```

Fix every failure before you continue. Headed mode is easier to debug, because
you see what the browser does.

#### Step 2: Test headless mode

When headed mode passes, run the script without the flag:

```
node bin/<script-name>.mjs
```

If headless mode fails but headed mode passes, the cause is usually one of
these:

| Symptom in headless mode | Probable cause | Fix |
|---|---|---|
| Access Denied or blank page | Bot detection finds the headless browser | Confirm the anti-detection args and the custom user agent are in the script |
| Element not visible, or click intercepted | Viewport too small for the element | Increase the viewport size, or scroll the element into view |
| Timeout on a selector | Lazy loading needs a visible window | Add `waitForSelector` with a longer timeout, or scroll with `page.evaluate()` |
| Screenshot shows a different layout | The site has responsive breakpoints | Set the viewport to the target device width |

#### Step 3: Confirm both modes

Run both commands one more time after the fixes:

```
node bin/<script-name>.mjs --headed
node bin/<script-name>.mjs
```

The script is complete only when both runs go from start to end, and all the
validations pass.

#### Common problems, in both modes

| Symptom | Probable cause | Fix |
|---|---|---|
| Timeout on a selector | The element loads later than expected | Increase the timeout, or add a wait before it |
| Strict mode violation (more than one match) | The locator is too wide | Use a more specific selector, or `.first()` / `.nth()` |
| Element not visible | Mobile and desktop variants of the same element | Click with `page.evaluate()` |
| Click does nothing | The framework ignores synthetic events | Send native events with `page.evaluate()` |
| Access Denied on navigation | Bot detection | Use headed mode with the anti-detection flags |

## Present the result

When the script passes in both modes, give the user:

1. **How to run it**: both commands (`node bin/<name>.mjs` for CI or headless,
   `node bin/<name>.mjs --headed` to watch it).
2. **Test results**: confirm the script passed in headless and in headed mode.
3. **Steps**: a numbered list of what the script does.
4. **Main decisions**: measures against bot detection, selector choices,
   validation logic.
5. **Limits**: what can break if the site changes (weak selectors, availability
   that depends on time).

## More resources

- For the script template, see [templates/playwright-script.mjs](templates/playwright-script.mjs)
- For exploration details, see [references/exploration-guide.md](references/exploration-guide.md)
