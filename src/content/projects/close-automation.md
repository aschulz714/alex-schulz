---
title: Controlled Close Automation
blurb: An internal finance-operations cockpit, built in my current role, that turns recurring close tasks into validated, reviewable, and auditable workflows.
description: An internal system I designed and built in my current role — recurring journal-entry and close processes prepared, validated, approved, posted, and logged without removing human control. Described here in generalized form.
category: ai-automation
projectType: automation
year: 2026
tech:
  - Python
  - Streamlit
  - Pandas
  - SQLite
  - Schema contracts
  - API integration design
status: Internal prototype, built in my current role
role: Workflow designer, product architect, and builder
scale:
  - 20 close tasks organized across a six-day close
  - Two working journal-entry preparers and ten extensible workflow stubs
  - ERP posting, approval, and close-platform integrations modeled end to end
proof:
  - Versioned input schemas block malformed source files
  - Deterministic journal-entry preparation and balanced-line review
  - Idempotency prevents duplicate posting
  - Every preparation, posting, approval, and completion event enters an audit log
confidentiality: This system was built in my role at my current employer and belongs to them. This case study describes it in generalized form only — no employer data, code, screenshots, integrations, or process specifics are published, and the underlying system is not publicly available.
artifact:
  label: Internal workflow system
  detail: A four-view Streamlit application with a close checklist, journal-entry runner, period dashboard, and audit log.
caseStudy:
  question: How can a finance team automate recurring close work without sacrificing review, approvals, or auditability?
  data: A registry of recurring close tasks, source-system exports, versioned schema contracts, and journal-entry preparation rules.
  method: Separate deterministic preparation from posting, validate every input, preview entries before release, route approvals by policy, reject duplicate batches, and log the full lifecycle.
  signal: The valuable automation is not a single script; it is the control plane that makes many scripts safe, visible, and reusable.
  why: It shows how domain knowledge, software design, and automation controls combine in a system that a real operations team could adopt.
featured: true
featuredRank: 1
---

## The problem

Recurring close work often starts as a collection of spreadsheets, exports, scripts, checklists, and manual journal entries. Individual tasks may be partially automated, but the overall process still depends on memory: which file to run, which period to select, who must review the result, whether a batch has already posted, and where the evidence lives.

The project asks what happens when those isolated scripts are treated as components in a controlled operating system.

## The system

The system presents twenty recurring tasks in one close cockpit. A preparer can open an eligible task, validate a source export, generate the proposed journal entry, inspect totals and line detail, and then send the approved payload to a modeled ERP endpoint. The close checklist updates from the same state rather than from a second manual process.

Four views make the lifecycle visible:

1. **Close checklist** -- task ownership, timing, status, and links into automated runs.
2. **Journal-entry runner** -- source validation, preparation, balancing, approval preview, and posting.
3. **Period dashboard** -- batches, states, pending approvals, and completed work.
4. **Audit log** -- an append-only record of the actions that changed the process state.

## Architecture

```text
Source export
    |
Versioned schema validation
    |
Deterministic JE preparer
    |
Human review of totals and lines
    |
Approval policy
    |
Idempotent ERP posting adapter
    |
Close-platform update + audit log
```

The prototype uses local mocks for the ERP and close-management APIs, allowing the contracts, failure behavior, and user journey to be tested without production credentials.

## Controls designed into the workflow

- Invalid file shapes fail before preparation.
- Proposed entries must balance before posting.
- Unknown business partners are surfaced instead of silently mapped.
- Batch identifiers prevent accidental duplicate posting.
- High-value entries can be routed to an additional approval state.
- Manual tasks remain visible and can be completed with an external entry reference.
- Every state-changing action is recorded with a timestamp and actor.

## Where the AI belongs

The core of this demo is deliberately deterministic. Posting, balancing, idempotency, and approval routing are rules with defined correct answers, so no model is allowed to improvise them. That is a design position, not a limitation: the first job in finance automation is deciding which steps must be deterministic and which genuinely require judgment.

AI belongs at the edges, and the control plane is built to receive it: unmapped business partners become triage queues for suggested matches, proposed account mappings arrive as reviewable candidates rather than silent writes, and variance narratives can be drafted from posted results. Each of those enters the same validation, approval, and audit path as any other proposal — which is exactly what makes model assistance safe to add.

## What this demonstrates

The project is intentionally broader than an accounting script. It shows process discovery, reusable workflow architecture, state management, integration contracts, controls, and an interface designed around real operator decisions. The same pattern applies to other document-heavy and approval-heavy operational processes.
