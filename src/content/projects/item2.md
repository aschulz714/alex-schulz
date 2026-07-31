---
title: Item2
blurb: An AI-assisted asset graph that extracts physical facilities from SEC filings, geocodes them, matches authority records, and preserves evidence.
description: Item2 turns public-company filings into a verified, geocoded database of the physical assets companies own and operate.
category: ai-automation
projectType: data-system
year: 2026
tech:
  - Python
  - FastAPI
  - PostgreSQL / PostGIS
  - Alembic
  - OpenAI / Anthropic
  - Docker
status: Active build
role: Founder, product architect, and AI-directed developer
scale:
  - SEC filings to a versioned physical-asset graph
  - Multi-provider geocoding and authority-record matching
  - Human review, provenance, and change detection
proof:
  - Tested Python package with CLI and FastAPI review interface
  - Alembic migration chain and fresh-database verification
  - Central guards protecting human-reviewed geometry
  - Git-based operating rules for agent planning, testing, and rollback
artifact:
  label: Applied AI data platform
  detail: A Python and PostGIS system for extracting, resolving, reviewing, and maintaining public-company facility data.
caseStudy:
  question: Can scattered facility disclosures be converted into a trustworthy asset-level database?
  data: SEC 10-K filings, facility descriptions, geocoding providers, public authority registries, and human review evidence.
  method: Parse filings, use LLMs for structured extraction, geocode through a provider waterfall, match authority records, enforce review guards, and record provenance at every stage.
  signal: The difficult product is not extraction alone—it is preserving evidence, resolving ambiguity, and preventing automated stages from overwriting reviewed truth.
  why: It demonstrates applied AI inside a controlled data pipeline rather than AI as a standalone interface.
links:
  demo: https://item2.io
featured: true
featuredRank: 3
---

## What it does

Item2 extracts the physical facilities disclosed in public-company filings and turns them into a versioned asset graph. A candidate begins with filing evidence, passes through structured LLM extraction and a multi-provider geocoding waterfall, can be matched against authority registries, and remains subject to human review before it becomes trusted data.

## Why it matters

Facility information is scattered across prose, exhibits, registries, addresses, and inconsistent naming. Extraction is only the first step. A useful product must preserve where each fact came from, distinguish approximate from precise locations, prevent automated repairs from overwriting reviewed truth, and show what changed between filings.

## Architecture and controls

- SEC access goes through one rate-limited client with caching and fail-fast behavior.
- LLM output becomes structured candidate data rather than final truth.
- Geocoding providers form an explicit waterfall with recorded provenance.
- Authority matches can add evidence, but location conflicts veto unsafe updates.
- Central database guards protect human-reviewed geometry.
- Alembic migrations rebuild the database from an empty state and are tested for model drift.
- Git records the implementation history, while project rules require plans, tests, and rollback paths for non-trivial agent work.

## What I am learning

AI can accelerate extraction, code generation, debugging, and research, but the durable product is the surrounding evidence system: schemas, provenance, review states, guards, tests, and a clear boundary between machine suggestion and human decision.
