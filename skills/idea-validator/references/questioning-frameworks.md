# Questioning frameworks

Advanced techniques for deep problem analysis and requirements validation.

## Five Whys technique

Dig to root causes by asking "why" repeatedly. Stop when you hit a fundamental truth or constraint.

**Example:**
- Problem: "Users complain the app is slow"
- Why? "Pages take 3+ seconds to load"
- Why? "Too many database queries per page"
- Why? "We fetch related data inefficiently"
- Why? "The original developer didn't understand SQL joins"
- Why? "No code review process existed"

**Root cause:** Process problem, not a technical one.

**How to apply:**
- Start with the stated problem
- Ask "why" to each answer
- Watch for shifts from symptoms to causes
- Stop at actionable root causes
- Question if solving the root cause is feasible

**Warning signs:**
- Getting circular answers (hitting a true constraint)
- Answers becoming more vague (user doesn't know)
- Reaching organizational/political issues (might be real blocker)

## Jobs-to-be-Done (JTBD) framework

Understand what users are really trying to accomplish.

**Core question:** "When [situation], I want to [motivation], so I can [expected outcome]."

**Example:**
- Bad: "Users want a calendar view"
- Good: "When planning my week, I want to see all my tasks by day, so I can balance my workload and avoid overcommitting"

**How to apply:**
- Push past feature requests to underlying jobs
- Ask: "What are you trying to accomplish?"
- Ask: "What would success look like?"
- Ask: "What do you do instead today?"

**Key insights:**
- The job reveals the real need
- The situation reveals when it matters
- The outcome reveals how to measure success

**Red flags:**
- Can't articulate the job (might not be a real need)
- Multiple jobs in one request (scope creep)
- Job is actually "use this specific feature" (solution bias)

## Problem/Solution fit analysis

Validate if a solution actually matches the problem.

**Questions to ask:**

1. **Problem clarity:**
   - Can you state the problem in one sentence?
   - What's the frequency and severity?
   - Who experiences this problem?

2. **Current state:**
   - How do people solve this today?
   - What's the cost of current solutions?
   - Why haven't they solved it already?

3. **Proposed solution:**
   - Does this solve the stated problem?
   - Does it introduce new problems?
   - Is it the simplest solution?

4. **Validation:**
   - How will you know it worked?
   - What would users stop doing if this exists?
   - Would users pay for this?

**Fit test:**
- Strong fit: Solution directly addresses core problem with clear value
- Weak fit: Solution is tangentially related or solves peripheral issues
- No fit: Solution doesn't address problem or creates more problems

## User Story Validation

Test if a user story is actually valuable.

**Format:** "As a [role], I want [feature], so that [benefit]"

**Validation questions:**

1. **Role specificity:**
   - Is this a real role or a proxy for "any user"?
   - Do different roles need different solutions?
   
2. **Feature clarity:**
   - Is this a feature or a benefit in disguise?
   - Can you describe it without implementation details?
   
3. **Benefit validation:**
   - Is this a real benefit or assumed?
   - How do you measure this benefit?
   - What's the cost of not having it?

**Example critique:**

Story: "As a user, I want better search, so that I can find things faster"

Problems:
- "User" is too vague (who specifically?)
- "Better search" is implementation-focused and undefined
- "Find things faster" is unmeasurable
- No evidence this is actually a problem

Better story: "As a project manager reviewing past projects, I want to search by client name and date range, so that I can find relevant examples for proposals without manually scrolling through 200+ projects"

## Decision framework: build vs. don't build

Use this when deciding if something should be built at all.

**Build signals (+1 each):**
- Clear, specific problem statement
- Quantified frequency and impact
- Multiple users report the same issue
- Existing workarounds are expensive/painful
- Success criteria are measurable
- Solution is simple and focused

**Don't build signals (-1 each):**
- Vague problem description
- Can't quantify impact
- Only one person asked for it
- Easy workarounds exist
- Can't define success
- Solution is complex or sprawling

**Score:**
- 4+: Probably worth building
- 2-3: Needs more validation
- 0-1: Don't build yet
- Negative: Definitely don't build

## Forcing functions

Use these to cut through ambiguity:

**Resource constraint:**
"You have 1 day to solve this. What do you build?"
- Forces prioritization
- Reveals what's truly essential

**Paying customer:**
"If users had to pay $10/month for this, would they?"
- Tests real value proposition
- Separates nice-to-have from need-to-have

**Comparison test:**
"Would you rather have Feature X or Feature Y?"
- Forces trade-off thinking
- Reveals relative priorities

**Elimination test:**
"If you removed this feature, what breaks?"
- Tests necessity
- Identifies dependencies vs. nice-to-haves

**Swap test:**
"If solving this took 6 months, would you still do it?"
- Tests urgency vs. importance
- Reality-checks commitment

## When to use each framework

- **Five Whys**: When the stated problem seems like a symptom
- **JTBD**: When user asks for specific features without context
- **Problem/Solution fit**: When evaluating if a solution makes sense
- **User story validation**: When requirements are written but seem weak
- **Decision framework**: When deciding whether to proceed at all
- **Forcing functions**: When stuck in circular discussions or vague answers
