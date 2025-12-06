# Common anti-patterns

Red flags to watch for during idea validation. Call these out aggressively when you spot them.

## The "Everyone wants this" fallacy

**Pattern:** "All users want feature X"

**Reality check:**
- Have you talked to actual users?
- How many? 3? 300? 3000?
- Did you ask leading questions?
- Are you generalizing from power users?

**Challenge:**
"'Everyone' is not a number. How many users did you actually talk to? What specifically did they say?"

## Solution looking for a problem

**Pattern:** User arrives with a fully-formed solution but unclear problem

**Red flags:**
- Starts with "We should build..."
- Can't articulate the problem without describing the solution
- Gets defensive when asked "what problem does this solve?"

**Challenge:**
"You're describing HOW to build something. What problem are you actually solving? Start with the problem, not the solution."

## The "Because competitor has it" trap

**Pattern:** "We need this because [competitor] has it"

**Problems:**
- Different users, different needs
- Copying features blindly
- Cargo cult product development

**Challenge:**
"Who cares what [competitor] has? Do YOUR users need this? What evidence do you have?"

## Vague value propositions

**Pattern:** Benefits described with unmeasurable adjectives

**Common phrases:**
- "Better UX"
- "More intuitive"
- "Cleaner interface"
- "Improved experience"
- "Faster" (without metrics)

**Challenge:**
"Define 'better'. Better how? What specific metrics improve? By how much?"

## The "While we're at it" syndrome

**Pattern:** Scope creeps during discussion

**Red flags:**
- "And also we should..."
- "It would be cool if..."
- "We could add..."
- Original problem gets lost in feature list

**Challenge:**
"Whoa - now you're adding new requirements. Let's stick to the original problem. We can discuss other features AFTER we solve this one."

## Treating symptoms, not causes

**Pattern:** Solving surface-level issues while ignoring root causes

**Example:**
- Problem: "Users make typos in email addresses"
- Symptom solution: "Add spell check"
- Root cause: "Why are users manually typing emails instead of selecting from a list?"

**Challenge:**
"This is treating a symptom. What's the actual problem? Why does this situation arise in the first place?"

## The "Nice to have" that's not

**Pattern:** Feature labeled "nice to have" but treated as essential

**Red flags:**
- Can't quantify impact
- No clear use case
- "It would be convenient..."
- "Users might like..."

**Challenge:**
"That's nice to have, not need to have. What actually breaks if this doesn't exist? Give me a concrete scenario."

## Personal preference disguised as user need

**Pattern:** "Users want X" when it's really "I want X"

**Red flags:**
- Lack of user research
- Single anecdote presented as trend
- Can't name specific users
- Defensive when questioned

**Challenge:**
"Is this what users want, or what YOU want? Show me evidence. User interviews? Usage data? Anything?"

## Over-engineering syndrome

**Pattern:** Complex solution to simple problem

**Example:**
- Problem: "Need to share a document"
- Over-engineered: "Build real-time collaborative editing with version control, comments, and branching"
- Simple solution: Email the file

**Challenge:**
"This is way more complex than needed. What's wrong with [simple alternative]? Why can't you just [basic solution]?"

## The "Someday users will need it" fallacy

**Pattern:** Building for hypothetical future needs

**Phrases:**
- "As we scale..."
- "Eventually users will..."
- "When we get bigger..."
- "Future-proofing..."

**Challenge:**
"Solve today's problems today. You're speculating about the future. Show me current evidence this is needed, not hypotheticals."

## Analysis paralysis disguised as requirements

**Pattern:** Endless requirements gathering, no action

**Red flags:**
- 10+ requirements for a simple feature
- Can't prioritize
- "We need to consider..."
- Keeps finding new edge cases

**Challenge:**
"We're overthinking this. What's the MINIMUM you need to validate if this is worth building? Start there."

## Confusing activity with progress

**Pattern:** Lots of discussion but no clarity

**Signs:**
- Multiple meetings but no decisions
- Circular arguments
- Requirements doc grows but clarity doesn't
- Lots of "maybes" and "it depends"

**Challenge:**
"We've been talking for 20 minutes and I still don't understand the core problem. Give me one sentence: what breaks if this doesn't exist?"

## The "But it's easy to build" trap

**Pattern:** Justifying features based on implementation ease, not value

**Phrases:**
- "It's just a few lines of code"
- "Since we're already building X..."
- "This would be trivial to add"

**Challenge:**
"Easy to build doesn't mean worth building. What's the user value? Every feature has a maintenance cost."

## Assuming user behavior

**Pattern:** Making assumptions about what users will do

**Red flags:**
- "Users will obviously..."
- "People always..."
- "Nobody would..."
- Based on how YOU would use it

**Challenge:**
"You're assuming user behavior. Have you actually watched users do this? What data supports your assumption?"

## Feature parity theater

**Pattern:** Matching competitors feature-for-feature without strategy

**Problems:**
- Dilutes focus
- Copy what might be their mistakes
- Ignores your unique value proposition

**Challenge:**
"You're playing catch-up instead of innovating. What makes YOUR product different? Why would users choose you?"

## Death by a thousand cuts

**Pattern:** Many small features that individually seem reasonable but collectively bloat the product

**Signs:**
- "Just one more small thing..."
- Accumulation of rarely-used features
- Can't remove anything "just in case"

**Challenge:**
"Every feature is debt. This might seem small, but we've added 15 'small' features this month. What's the strategy here?"

## How to use this reference

When you spot any of these patterns:

1. **Name it explicitly:** "This is the [pattern name] anti-pattern"
2. **Explain why it's problematic:** Quick 1-2 sentence explanation
3. **Challenge with specific questions:** Use the provided challenges
4. **Demand evidence or clarity:** Force concrete answers

Remember: Your job is to protect the user from building the wrong thing, even if (especially if) they want to build it.
