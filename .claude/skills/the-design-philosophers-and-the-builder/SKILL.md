---
name: "the-design-philosophers-and-the-builder"
description: >-
  Use this skill when designing software from scratch with a bounded
  Mealy-style workflow. It routes work through Socrates, Plato, Aristotle,
  Bacon, Hoare, Epictetus, Diogenes, and Builder 1986 using TOML handoffs,
  Markdown reports, and smallest-safe-slice implementation.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill when a user wants to design software from scratch, turn a vague idea into a buildable system, prevent user or agent drift, or force implementation through smallest safe build slices.

This is a bounded Mealy-style control system.

The governing rule is:

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Artifact Rule

Formal handoffs are TOML.

Long-form reasoning, analysis, reports, and postmortems are Markdown.

The TOML handoff is authoritative for routing.

Markdown is supporting documentation and should be linked from TOML.

## State Owners

- S1 Problem Examination: Socrates
- S1A Scoped Ideal Model: Plato
- S2 Structural Design: Aristotle
- S3 Pre-Build Validation Architecture: Bacon
- S4 Pre-Build Correctness Specification: Hoare
- S4A Pre-Build Operational Resilience Specification: Epictetus
- S5 Pre-Build Austerity Review: Diogenes
- S6A Builder Slice Planning: Builder 1986
- S7 Implementation: Builder 1986
- S8 Post-Build Reduction Review: Diogenes
- S9 Post-Build Empirical Review: Bacon
- S10 Post-Build Correctness Review: Hoare
- S11 Post-Build Operational Resilience Review: Epictetus
- S12 Admission Decision: Parent

## Agent Chain

Socrates bounds the real problem.

Plato defines the scoped ideal and hard product constraints.

Aristotle derives structure.

Bacon defines proof.

Hoare defines correctness.

Epictetus defines failure discipline.

Diogenes cuts excess before build.

Builder 1986 slices, costs, orders, and implements incrementally.

Diogenes cuts excess after build.

Bacon verifies evidence.

Hoare verifies correctness.

Epictetus verifies operational resilience.

The parent admits only if the state machine held.

## Routing Rules

If a user request changes the real problem, route to Socrates.

If it changes ideal form, value, platform, deployment, integration, trust model, data ownership, scale, or version-one boundary, route to Plato.

If it changes structure, route to Aristotle.

If it changes evidence or validation, route to Bacon.

If it changes invariants or correctness, route to Hoare.

If it changes failure behavior or operational tolerance, route to Epictetus.

If it adds complexity without traceable value, route to Diogenes.

If it changes implementation inside an approved slice, route to Builder.

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must slice it, cost it, order it, and implement it incrementally.

A slice is not done because code exists.

A slice is done only when it satisfies mapped validation, correctness, and operational obligations.

## Supporting Files

Use these supporting files when needed:

- `scripts/state_machine.py` contains the Python Mealy state machine.
- `templates/handoff.toml` contains the formal TOML handoff template.
- `docs/workflow.md` contains the full workflow explanation.

## Operating Instructions

When this skill triggers:

1. Determine the current state.
2. Classify the user's input against the current bounded artifact.
3. Emit only a valid event for the current state.
4. Produce a TOML handoff for formal transitions.
5. Link Markdown reports for long-form reasoning.
6. Refuse silent scope expansion.
7. Enforce Builder slice planning before implementation.

## Installation Notes

For Claude Code, place this folder at either:

- `%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\`
- `<repo>\.claude\skills\the-design-philosophers-and-the-builder\`

Restart Claude Code after changing skills.
