# Exploration guide

Detailed reference for the interactive exploration phase using `agent-browser`.

## Quick command reference

| Action | Command |
|---|---|
| Open a URL | `npx agent-browser open <url>` |
| Full page snapshot | `npx agent-browser snapshot` |
| Interactive elements only | `npx agent-browser snapshot -i` |
| Compact snapshot | `npx agent-browser snapshot -c` |
| Scoped to a CSS selector | `npx agent-browser snapshot -s "dialog"` |
| Click by ref | `npx agent-browser click @e5` |
| Fill text by ref | `npx agent-browser fill @e3 "text"` |
| Run JavaScript | `npx agent-browser eval "<js>"` |
| Wait for time or selector | `npx agent-browser wait 2000` |
| Take a screenshot | `npx agent-browser screenshot` |
| Close browser | `npx agent-browser close` |
| Find element and act | `npx agent-browser find text "Submit" click` |
| Get element attribute | `npx agent-browser get attr data-id @e1` |
| Set HTTP credentials | `npx agent-browser set credentials <user> <pass>` |

## Handling credentials during exploration

When the target site requires authentication (HTTP Basic Auth, login forms, API keys), use environment variables and **never read their values into the conversation**.

### HTTP Basic Auth

Set credentials before navigating to the protected resource:

```
# Set credentials (shell resolves variables at runtime)
npx agent-browser set credentials ${HTTP_USERNAME} ${HTTP_PASSWORD}

# Navigate to protected resource
npx agent-browser open "https://example.com/protected"
```

### Login forms

Fill fields using shell variables so values are resolved at runtime and never appear in tool output:

```
npx agent-browser fill @e3 "${LOGIN_EMAIL}"
npx agent-browser fill @e5 "${LOGIN_PASSWORD}"
```

### Key rules

- **Do not** run `echo`, `printenv`, or any command that prints secret values.
- **Do not** hardcode credentials in commands or scripts. Always use `${VAR_NAME}` in shell commands and `process.env.VAR_NAME` in JavaScript.
- If a variable is not set, commands will fail with an empty value. Instruct the user to export the required variables before starting the exploration session.

## Dealing with bot protection

Many production sites use CDN-level bot detection (Akamai, Cloudflare, PerimeterX). Symptoms include:

- "Access Denied" page immediately on load
- CAPTCHA challenges
- Empty or minimal page content

### Escalation strategy

Try each approach in order, stopping when the page loads successfully:

1. **Default headless**: `npx agent-browser open <url>`
2. **Headed mode**: close the session first, then relaunch with `--headed`
3. **Headed + anti-detection**: add `--args "--disable-blink-features=AutomationControlled"`
4. **Custom user agent**: add `--user-agent "Mozilla/5.0 ..."`
5. **Combined**: all flags together

Always close the existing session before changing launch flags:

```
npx agent-browser close
npx agent-browser --headed \
  --args "--disable-blink-features=AutomationControlled" \
  --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  open <url>
```

## Snapshot reading strategy

Snapshots can be large. Use these techniques to focus:

- **Start with `-i`** to see only interactive elements. This gives you the action points.
- **Use `-c`** (compact) to remove empty structural nodes when reading the full tree.
- **Scope with `-s`** when you know the relevant container: `snapshot -s "dialog"` or `snapshot -s "[class*=modal]"`.
- **Limit depth with `-d`**: `snapshot -d 3` for a high-level overview.

## Inspecting hidden state with eval

Snapshots show the accessibility tree but miss many attributes. Use `eval` to inspect:

### Check all buttons matching a pattern

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

### Find enabled instance among duplicates

Some sites render mobile and desktop variants of the same button. Only one is visible at any viewport width:

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

### Cookie consent banners

Most EU sites show a cookie banner on first visit. Common button names:

- "Accept cookies", "Accept all", "Accepter les cookies"
- "Allow all cookies", "I agree", "OK"

Dismiss early so it does not block clicks on underlying elements.

### Modals and overlays

When a modal opens, previous page refs become stale. Always re-snapshot after a modal appears. Modals often render inside a `dialog` element or a `div` with `role="dialog"`.

### Calendars and date pickers

Calendar grids typically use `role="gridcell"` with `aria-label` containing the full date string (e.g. "February 8, 2026"). Construct the expected label in code and match it.

If the desired date is not in the current month view, click "Next month" or "Previous month" and re-check.

### Quantity selectors (stepper controls)

E-commerce and ticketing sites use +/- buttons around a quantity display. The display is often a `[role="status"]` element. Find the containing row by text content and then locate the "Increase quantity" or "Decrease quantity" button within it.

### Dynamic availability

Slot or product availability is often stored in `data-*` attributes (e.g. `data-availability="available"`) rather than visible text. Always check these attributes via `eval` rather than relying solely on the snapshot.

## Recording exploration notes

After exploring the site, write a structured summary before generating the script. Include:

```
## Site exploration notes

**URL**: https://example.com/page
**Bot protection**: Headed mode required with custom UA
**Cookie banner**: "Accept all cookies" button

### Workflow steps

1. Click "Buy now" button (selector: `main button:has-text("Buy now")`)
   - Opens a modal dialog
   - Calendar grid appears with `[role="gridcell"]` cells

2. Select date: click gridcell with `aria-label="March 15, 2026"`
   - Time slots load via AJAX, wait for `.time-slot-btn`
   - Availability in `data-availability` attribute

3. Select first available time slot
   - Iterate `.time-slot-btn` elements
   - Click first with `data-availability="available"`

4. Confirm selection
   - "Set" button exists in two variants (mobile hidden, desktop visible)
   - Use `page.evaluate()` to click the enabled one

5. Pick ticket type
   - Row with text "Standard" contains +/- buttons
   - Click "Increase quantity" within that row

6. Validate summary
   - `.order-summary` panel shows item, quantity, total
   - `.summary-total` contains "€25"

### Edge cases
- Morning slots often sold out; script must iterate to find available ones
- "Set" button stays disabled until a valid time is selected
```

This structured summary is the blueprint for Phase 2.
