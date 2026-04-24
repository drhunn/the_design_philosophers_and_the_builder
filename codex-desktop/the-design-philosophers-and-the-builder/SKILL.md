---
name: "the-design-philosophers-and-the-builder"
description: >-
  Windows 11 Codex Desktop skill for designing software from scratch with a bounded Mealy-style workflow using philosopher agents, Builder 1986, TOML handoffs, and smallest-safe-slice implementation.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Codex Desktop on Windows 11 when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, preventing user or agent drift, or forcing implementation through smallest safe build slices.

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Install

Copy this whole folder to:

`%USERPROFILE%\.codex\skills\the-design-philosophers-and-the-builder\`

or project-local:

`<repo>\.codex\skills\the-design-philosophers-and-the-builder\`

## Bundled Files

- `agents/README.md`
- `agents/socrates.md`
- `agents/plato.md`
- `agents/aristotle.md`
- `agents/bacon.md`
- `agents/hoare.md`
- `agents/epictetus.md`
- `agents/diogenes.md`
- `agents/builder-1986.md`
- `scripts/state_machine.py`
- `templates/handoff.toml`

## Artifact Rule

Formal handoffs are TOML. Long-form prose is Markdown linked from TOML. The state machine consumes TOML, not Markdown.

## Agent Chain

Socrates bounds the problem. Plato defines the scoped ideal. Aristotle derives structure. Bacon defines proof. Hoare defines correctness. Epictetus defines failure discipline. Diogenes cuts excess. Builder 1986 slices and implements incrementally. Diogenes, Bacon, Hoare, and Epictetus review after build. Parent admits only if the state machine held.

## Routing Rules

If it changes the real problem, route to Socrates.
If it changes ideal form, value, platform, deployment, integration, trust, data ownership, scale, or v1 boundary, route to Plato.
If it changes structure, route to Aristotle.
If it changes evidence or validation, route to Bacon.
If it changes invariants or correctness, route to Hoare.
If it changes failure behavior or operational tolerance, route to Epictetus.
If it adds complexity without traceable value, route to Diogenes.
If it changes implementation inside an approved slice, route to Builder.

## Builder Constraint

Builder must not build the whole design as a lump. Builder must slice it, cost it, order it, implement incrementally, and pass mapped validation, correctness, and operational obligations per slice.

## Required Output Shape

For formal handoff, write TOML matching `templates/handoff.toml`. For long-form rationale, write Markdown and link it from the TOML handoff.
