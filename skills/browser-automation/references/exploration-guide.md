# Exploration guide

Details for the exploration phase with `agent-browser`.

## Command reference

**Important:** Run all CLI commands with the package runner of the project:
`npx agent-browser`, `pnpm dlx agent-browser`, or `bunx --bun agent-browser`.
The examples use `npx agent-browser`. Replace it with the correct runner.

| Action | Command |
|---|---|
| Open a URL | `npx agent-browser open <url>` |
| Full page snapshot | `npx agent-browser snapshot` |
| Interactive elements only | `npx agent-browser snapshot -i` |
| Compact snapshot | `npx agent-browser snapshot -c` |
| Limit to a CSS selector | `npx agent-browser snapshot -s "dialog"` |
| Click a ref | `npx agent-browser click @e5` |
| Fill text in a ref | `npx agent-browser fill @e3 "text"` |
| Run JavaScript | `npx agent-browser eval "<js>"` |
| Wait for a time or a selector | `npx agent-browser wait 2000` |
| Take a screenshot | `npx agent-browser screenshot` |
| Close the browser | `npx agent-browser close` |
| Find an element and act on it | `npx agent-browser find text "Submit" click` |
| Read an element attribute | `npx agent-browser get attr data-id @e1` |
| Set HTTP credentials | `npx agent-browser set credentials <user> <pass>` |

## Credentials during exploration

Some sites need authentication (HTTP Basic Auth, login forms, API keys). Use
environment variables, and never read their values into the conversation.

### HTTP Basic Auth

Set the credentials before you open the protected page:

```
# Set the credentials (the shell replaces the values at runtime)
npx agent-browser set credentials ${HTTP_USERNAME} ${HTTP_PASSWORD}

# Open the protected page
npx agent-browser open "https://example.com/protected"
```

### Login forms

Fill the fields with shell variables. The shell replaces the values at runtime,
and they do not appear in the tool output:

```
npx agent-browser fill @e3 "${LOGIN_EMAIL}"
npx agent-browser fill @e5 "${LOGIN_PASSWORD}"
```

### Key rules

- Do not run `echo`, `printenv`, or any command that prints a secret value.
- Do not write credentials in commands or scripts. Use `${VAR_NAME}` in shell
  commands and `process.env.VAR_NAME` in JavaScript.
- A variable that is not set makes the command fail with an empty value. Tell
  the user to export the necessary variables before the session starts.

## Bot protection

Many production sites use bot detection in the CDN (Akamai, Cloudflare,
PerimeterX). The symptoms are:

- An "Access Denied" page immediately after load
- A CAPTCHA challenge
- An empty page, or a page with very little content

### How to escalate

Try each step in order. Stop when the page loads:

1. **Default headless**: `npx agent-browser open <url>`
2. **Headed mode**: close the session first, then start again with `--headed`
3. **Headed plus anti-detection**: add
   `--args "--disable-blink-features=AutomationControlled"`
4. **Custom user agent**: add `--user-agent "Mozilla/5.0 ..."`
5. **All together**: use all the flags

Always close the open session before you change the launch flags:

```
npx agent-browser close
npx agent-browser --headed \
  --args "--disable-blink-features=AutomationControlled" \
  --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  open <url>
```

## How to read a snapshot

A snapshot can be large. Use these options to reduce it:

- **Start with `-i`**, to see only the interactive elements. These are the
  action points.
- **Use `-c`** (compact), to remove empty structural nodes from the full tree.
- **Limit with `-s`** when you know the container: `snapshot -s "dialog"` or
  `snapshot -s "[class*=modal]"`.
- **Limit the depth with `-d`**: `snapshot -d 3` for an overview.

## Read hidden state with eval

A snapshot shows the accessibility tree, but it hides many attributes. Use
`eval` to read them.

### Check the buttons that match a pattern

```
npx agent-browser eval "
  const btns = document.querySelectorAll('.time-btn');
  JSON.stringify([...btns].map(b => ({
    text: b.textContent.trim(),
    available: b.getAttribute('data-availability'),
    disabled: b.disabled
  })));
"
```

### Find the enabled copy of a duplicated element

Some sites render a mobile variant and a desktop variant of the same button.
Only one is visible at each viewport width:

```
npx agent-browser eval "
  const btns = document.querySelectorAll('button');
  const target = [...btns].find(b =>
    b.textContent.trim() === 'Submit' && !b.disabled
  );
  JSON.stringify({
    found: !!target,
    visible: target?.offsetParent !== null,
    class: target?.className
  });
"
```

### Read a summary or confirmation panel

```
npx agent-browser eval "
  const el = document.querySelector('.order-summary');
  if (!el) 'not found';
  else JSON.stringify({
    items: [...el.querySelectorAll('.line-item')].map(li => li.textContent.trim()),
    total: el.querySelector('.total')?.textContent.trim()
  });
"
```

## Common page patterns

### Cookie banners

Most EU sites show a cookie banner on the first visit. Usual button names:

- "Accept cookies", "Accept all", "Accepter les cookies"
- "Allow all cookies", "I agree", "OK"

Close the banner early, because it can block clicks on the elements below it.

### Modals and overlays

When a modal opens, the old refs become invalid. Always take a new snapshot
after a modal appears. A modal is often a `dialog` element, or a `div` with
`role="dialog"`.

### Calendars and date pickers

A calendar grid usually uses `role="gridcell"`, with the full date in the
`aria-label` (Eg. "February 8, 2026"). Build the same label in code and match
it.

If the date is not in the month on screen, click "Next month" or "Previous
month", then check again.

### Quantity selectors (steppers)

Shops and ticket sites use + and - buttons around a quantity. The quantity is
often an element with `[role="status"]`. Find the row by its text, then find the
"Increase quantity" or "Decrease quantity" button in that row.

### Dynamic availability

Sites often keep the availability of a slot or a product in a `data-*`
attribute (Eg. `data-availability="available"`), not in visible text. Always
read these attributes with `eval`, not only from the snapshot.

### Iframes

Many sites put important parts in an iframe: payment forms (Stripe,
Braintree), chat widgets (Intercom, Zendesk), consent managers, and embedded
content (maps, videos). Find and record the iframes during the exploration,
because the script needs special code for them.

**Signs that an element is inside an iframe:**

- The snapshot shows an `iframe` element, but the content you expect is missing
- A click opens a modal that does not appear in the next snapshot
- The element has a different origin in the browser DevTools

**How to find the iframes:**

List all the iframes on the page and their sources:

```
npx agent-browser eval "
  const frames = document.querySelectorAll('iframe');
  JSON.stringify([...frames].map(f => ({
    id: f.id,
    name: f.name,
    src: f.src,
    visible: f.offsetParent !== null
  })));
"
```

**Same-origin iframes:**

For an iframe from the same origin, read its content with `eval`:

```
npx agent-browser eval "
  const frame = document.querySelector('iframe#booking-widget');
  const doc = frame?.contentDocument;
  if (!doc) 'cross-origin or not loaded';
  else JSON.stringify({
    buttons: [...doc.querySelectorAll('button')].map(b => b.textContent.trim()),
    inputs: [...doc.querySelectorAll('input')].map(i => i.name || i.id)
  });
"
```

**Cross-origin iframes:**

Browser security blocks `eval` on a cross-origin iframe (Eg. a `stripe.com`
iframe on your site). During the exploration, record:

- The iframe selector (id, name, or CSS selector)
- The action that makes the iframe appear
- The elements you expect inside it, from the site documentation or from what
  you see

The script uses `frameLocator()`, which works with cross-origin iframes.

**How to record an iframe in the notes:**

```
### Iframe: Payment form
- Selector: `iframe[name="stripe-frame"]`
- Origin: cross-origin (stripe.com)
- Appears after: a click on "Proceed to payment"
- Contains: card number, expiry, CVC fields
- Submit button: inside the iframe, text "Pay now"
```

Phase 2 needs this information for `page.frameLocator()`.

## Exploration notes

After the exploration, write a structured summary before you write the script.
Include:

```
## Site exploration notes

**URL**: https://example.com/page
**Bot protection**: headed mode and a custom user agent are necessary
**Cookie banner**: "Accept all cookies" button

### Workflow steps

1. Click the "Buy now" button (selector: `main button:has-text("Buy now")`)
   - Opens a modal dialog
   - A calendar grid appears, with `[role="gridcell"]` cells

2. Select the date: click the gridcell with `aria-label="March 15, 2026"`
   - The time slots load with AJAX, wait for `.time-slot-btn`
   - The availability is in the `data-availability` attribute

3. Select the first available time slot
   - Read the `.time-slot-btn` elements
   - Click the first one with `data-availability="available"`

4. Confirm the selection
   - The "Set" button has two variants (mobile hidden, desktop visible)
   - Use `page.evaluate()` to click the enabled one

5. Select the ticket type
   - The row with the text "Standard" has the + and - buttons
   - Click "Increase quantity" in that row

6. Check the summary
   - The `.order-summary` panel shows the item, the quantity, and the total
   - `.summary-total` contains "€25"

### Edge cases
- Morning slots are often sold out, the script must look for an available one
- The "Set" button stays disabled until a valid time is selected
```

This summary is the plan for Phase 2.
