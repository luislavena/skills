# Scenario 5: Successfully Validated Idea

## Context
A user presents a problem that, through questioning, proves to be real, well-defined, and worth solving. This scenario demonstrates all four phases of the validation process leading to a solid requirement summary.

---

## Conversation

**User:** We need to build a feature that lets customers export their data from our SaaS platform. We've had several enterprise customers ask about this during sales calls.

**Claude (Idea validator):**

🤔 **Critical Question**: Let's validate this. You said "several enterprise customers" - how many specifically? And what exactly did they ask for?

- Did they ask for general data export or specific data?
- Were these prospects who didn't close, or existing customers?
- What format did they expect?

---

**User:** Four enterprise prospects in the last quarter asked about it during due diligence. Three of them specifically asked "can we export all our data if we decide to leave?" and mentioned it as a requirement for their security/compliance review. Two of those deals didn't close - they said vendor lock-in was a concern.

**Claude (Idea validator):**

✅ **Valid Point**: That's concrete. 4 prospects asking, 2 lost deals attributed to this issue. That's real revenue impact.

🤔 **Critical Question**: Let me dig deeper:
- What was the average deal size for those lost deals?
- How many enterprise prospects do you typically have per quarter?
- Did the 2 who closed still express concern?

I'm trying to understand if this is a blocking issue or a minor factor.

---

**User:** Deal size was around $80K ARR each, so we potentially lost $160K. We get about 10-12 enterprise prospects per quarter. The two who did close mentioned it but said they'd "deal with it" - one asked us to add it to the roadmap.

**Claude (Idea validator):**

⚠️ **Challenge**: Good data. Let me pressure-test though:
- Those 2 lost deals - was data export the primary reason they didn't close, or one of several factors?
- Are there other blockers you're hearing more frequently?

I want to make sure we're solving the highest-impact problem, not just the most recent one.

---

**User:** For both, it came up in their security review and was listed as a "required capability." One of them explicitly said "we can't sign without data portability." The other common concerns are SSO (which we have) and SOC2 compliance (which we're working on).

**Claude (Idea validator):**

✅ **Valid Point**: "Can't sign without data portability" is a clear gate. This passes the litmus test:
- If this doesn't exist, deals break
- Real revenue impact ($160K+ lost)
- Customers explicitly blocked by this

🤔 **Critical Question**: Now let's define scope. What data do they need to export?
- All user data?
- Configuration and settings?
- Historical analytics/reports?
- Integrations and workflows?

And what format? CSV? JSON? Their specific system format?

---

**User:** Based on the conversations, they mainly care about:
1. All user-created content and documents
2. User account information
3. Audit logs
4. Configuration settings

Format-wise, they asked for "industry standard" - probably JSON or CSV. One mentioned wanting to import into a competitor, but I don't think we need to support competitor-specific formats.

**Claude (Idea validator):**

⚠️ **Challenge**: "Industry standard" is vague. Let's nail it down:
- JSON for structured data (settings, configs)
- CSV for tabular data (logs, user lists)
- Original format for documents

🤔 **Critical Question**: What about:
- Incremental exports (download changes since last export)?
- Scheduled automatic exports?
- Or just one-time "give me everything" download?

What did they actually ask for?

---

**User:** Just one-time full export. No one asked for incremental or scheduled. They want to be able to download everything on demand.

**Claude (Idea validator):**

✅ **Valid Point**: Good - keeping scope tight. On-demand full export only.

🤔 **Critical Question**: Two more things:
1. **Access control**: Who can trigger exports? Any user? Only admins?
2. **Data sensitivity**: Any concerns about exporting data that contains OTHER users' information? (Privacy implications)

---

**User:** Admin only - we don't want every user exporting company data. And good point on privacy - we should probably exclude data that contains PII of other users, or at least warn about it.

**Claude (Idea validator):**

⚠️ **Challenge**: "Probably" isn't a requirement. Do your enterprise customers have specific privacy requirements, or is this your assumption?

🤔 **Critical Question**: Before we finalize, have you asked these prospects what they'd actually do with the exported data? Understanding the use case helps determine what to include/exclude.

---

**User:** Fair point. The main use cases mentioned were:
1. Compliance audits - auditors want to see they CAN get their data
2. Migration to another platform if they leave
3. Internal backup for their own records

For compliance audits, they mostly want to prove capability, not actually export regularly. For migration, they want everything. For backup, they want their content.

**Claude (Idea validator):**

✅ **Valid Point**: Three clear use cases. Let me summarize what I'm hearing:

**Use case priorities:**
1. Compliance checkbox (must be possible, rarely used)
2. Migration (full export, rarely used)
3. Backup (content export, occasionally used)

All three are served by a single "full export" feature. No need for multiple export types.

🤔 **Critical Question**: Final validation - if you shipped this in 30 days, do you believe those lost deals would have closed?

---

**User:** Yes, I'm confident. The security team at one of them specifically said "come back when you have data export capability."

**Claude (Idea validator):**

✅ **Valid Point**: That's your green light. This is a validated, well-defined requirement.

**Summary for Proposal**:
- **Problem**: Enterprise customers require data export capability for compliance and vendor lock-in concerns. This is blocking deals - 2 lost deals worth $160K ARR in last quarter, with explicit feedback that export was required.
- **Solution**: Admin-only, on-demand full data export including user content, documents, account info, audit logs, and configuration. Formats: JSON for structured data, CSV for tabular data, original format for documents.
- **Success Criteria**: Next enterprise security review passes data portability requirement; win rate on enterprise deals increases.
- **Constraints**: One-time export only (no incremental/scheduled), admin access only, need to address PII handling for multi-user data.
- **User Value**: Removes a deal-blocking objection for enterprise sales; estimated $160K+ ARR recovery opportunity.

**But consider:** Once this ships, make sure sales knows to proactively mention it in security reviews. The feature only helps if prospects know about it before they decide you don't have it.

---

## Key Techniques Demonstrated

| Technique | Where Used |
|-----------|------------|
| Demanding specifics | "How many exactly? What did they ask?" |
| Quantifying impact | $160K lost, deal-blocking feedback |
| Pressure-testing priority | "Is this the highest-impact problem?" |
| Defining scope precisely | What data, what format, what access |
| Understanding use cases | Compliance vs. migration vs. backup |
| Final validation | "Would this have closed those deals?" |
| Actionable summary | Clear problem, solution, success criteria |

## Outcome
The conversation validated a real, well-defined problem with concrete evidence (lost deals, explicit customer feedback, quantified revenue impact). The scope was tightened through questioning (one-time export only, admin access, specific data types). The final proposal is clear enough to build against with confidence that it addresses actual user needs.

## Why This Idea Passed Validation

| Criteria | Evidence |
|----------|----------|
| Real problem | Customers explicitly stated requirement |
| Quantified impact | $160K lost ARR, 2 blocked deals |
| Clear use cases | Compliance, migration, backup |
| Defined scope | Specific data types, formats, access |
| Validated demand | "Come back when you have this" |
| Simpler alternatives ruled out | No workaround for compliance requirement |
