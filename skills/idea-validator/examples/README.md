# Idea Validator: Example Scenarios Index

This collection contains 9 example scenarios demonstrating the Idea Validator skill in action. Each scenario showcases different validation techniques, anti-patterns to catch, and conversation phases.

---

## Quick Reference

| Scenario | Primary Technique | Outcome |
|----------|-------------------|---------|
| [01: Challenging Vagueness](./scenario-01-challenging-vagueness.md) | Demanding specifics | Productivity app → Behavior change |
| [02: Solution Bias](./scenario-02-solution-bias.md) | Redirecting to WHAT/WHY | Microservices platform → Simple MVP |
| [03: Feature Creep](./scenario-03-feature-creep.md) | Stopping scope inflation | Snippet tool → Offboarding checklist |
| [04: Cargo Cult](./scenario-04-cargo-cult.md) | Challenging "competitors have it" | AI recommendations → Shipping fix |
| [05: Validated Idea](./scenario-05-validated-idea.md) | Full validation process | Data export → Approved with clear scope |
| [06: Symptoms vs. Root Cause](./scenario-06-symptoms-vs-root-cause.md) | Five Whys technique | Alert system → Observability platform |
| [07: Vague Benefits](./scenario-07-vague-benefits.md) | Forcing measurable outcomes | Dashboard redesign → Onboarding improvement |
| [08: When to Back Off](./scenario-08-when-to-back-off.md) | Recognizing solid research | Multi-language → Approved as-is |
| [09: Manual Data Maintenance](./scenario-09-manual-data-maintenance.md) | Exposing maintenance burden | Complex CMS → Google embed |

---

## Scenarios by Signal Type

### ⚠️ Challenge (Questioning Vague Claims)
- **Scenario 01**: "That's too vague. Give me specifics."
- **Scenario 02**: "You're describing HOW, not WHAT"
- **Scenario 07**: "'Intuitive' and 'cleaner' are subjective terms"
- **Scenario 09**: "This isn't data - it's guesswork presented as data"

### 🤔 Critical Question (Probing Deeper)
- **Scenario 04**: "How do you know YOUR users want this?"
- **Scenario 05**: "What format? Who can trigger exports?"
- **Scenario 06**: "Why does the service need restarting?"

### ❌ Red Flag (Fundamental Problems)
- **Scenario 01**: "Feeling disorganized is not a problem statement"
- **Scenario 03**: "You just added TWO more features"
- **Scenario 07**: "5-6 vague comments is not a signal to redesign"
- **Scenario 09**: "In 6 months, will this CMS be maintained or forgotten?"

### ✅ Valid Point (Acknowledging Good Reasoning)
- **Scenario 05**: "Real revenue impact, explicit customer feedback"
- **Scenario 08**: "You've done your homework"

---

## Scenarios by Anti-Pattern

### Solution Bias
User arrives with a solution, not a problem.
→ **See Scenario 02**

### Feature Creep
Scope keeps expanding during validation.
→ **See Scenario 03**

### Cargo Cult Requirements
"Because competitors have it."
→ **See Scenario 04**

### Vague Benefits
"Better UX," "more intuitive," "cleaner."
→ **See Scenario 07**

### Symptoms vs. Root Cause
Treating symptoms instead of underlying problem.
→ **See Scenario 06**

### Manual Data Maintenance
Building systems that require ongoing manual updates that will inevitably be neglected.
→ **See Scenario 09**

---

## Scenarios by Conversation Phase

### Phase 1: Initial Challenge
Demanding concrete examples and specifics from vague presentations.
→ **See Scenario 01, 02**

### Phase 2: Deep Questioning
Questioning frequency, severity, demanding evidence, looking for simpler alternatives.
→ **See Scenario 03, 04, 06**

### Phase 3: Options
Presenting alternatives from simplest to most complex.
→ **See Scenario 02, 06, 07**

### Phase 4: Requirements
Forcing clarity on minimum viable requirements, creating structured summary.
→ **See Scenario 05, 08**

---

## Scenarios by Outcome Type

### Idea Rejected / Pivoted
Original idea was not validated; redirected to different solution.
- Scenario 01: App → Behavior change
- Scenario 03: Custom tool → Process checklist
- Scenario 04: AI feature → Shipping improvement
- Scenario 06: Alerts → Observability
- Scenario 07: Redesign → Onboarding
- Scenario 09: Complex CMS → Google embed (existing solution)

### Idea Validated with Scope Change
Core problem validated, but solution refined.
- Scenario 02: Platform → Simple personal MVP
- Scenario 05: Full feature → Scoped data export

### Idea Validated as Presented
Original idea passed validation with evidence.
- Scenario 08: Multi-language support approved

---

## Key Questioning Techniques Demonstrated

| Technique | Best Example |
|-----------|--------------|
| Demanding quantification | Scenario 01, 07 |
| Five Whys | Scenario 06 |
| Comparing costs/ROI | Scenario 04 |
| Simpler alternatives | Scenario 01, 02, 03, 09 |
| Segmenting users | Scenario 07 |
| Revenue impact analysis | Scenario 04, 05 |
| Edge case probing | Scenario 05, 08 |
| Root cause analysis | Scenario 06 |
| Exposing maintenance burden | Scenario 09 |
| Predicting system decay | Scenario 09 |
| Revealing existing solutions | Scenario 09 |

---

## Usage Notes

These scenarios are designed to:
1. **Train**: Show examples of effective validation conversations
2. **Reference**: Provide templates for common situations
3. **Calibrate**: Demonstrate when to push harder vs. back off

Each scenario includes:
- Full conversation transcript
- Technique annotations
- Summary table of methods used
- Outcome explanation

---

## Summary Format Template

All successful validations conclude with:

```
**Summary for Proposal**:
- Problem: [One sentence stating the real problem and its frequency/impact]
- Solution: [Minimum viable approach that solves it]
- Success Criteria: [How you'll know it works]
- Constraints: [Important limitations or edge cases]
- User Value: [Concrete benefit, not vague "improvements"]

**But consider:** [Alternative perspective or potential root cause]
```

The "But consider" is omitted only when the idea is fully validated with no remaining concerns (Scenario 08).
