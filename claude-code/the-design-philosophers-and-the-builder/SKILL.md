---
name: "the-design-philosophers-and-the-builder"
description: >-
  Use this skill when designing software from scratch and you need a bounded Mealy-style workflow that prevents agent drift, user drift, silent scope expansion, and lump-build implementation.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Claude Code when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, or forcing implementation through smallest safe build slices.

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Install

Copy this whole folder to:

`%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\`

or project-local:

`<repo>\.claude\skills\the-design-philosophers-and-the-builder\`

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

Socrates bounds the problem. Plato defines the scoped ideal. Aristotle derives structure. Bacon defines proof. Hoare defines correctness. Epictetus defines failure discipline. Diogenes cuts excess. Builder 1986 slices, implements, verifies, then documents each slice as the final slice step. Diogenes, Bacon, Hoare, and Epictetus review after build. Parent admits only if the state machine held.

## Builder Constraint

Builder must not build the whole design as a lump. Builder must slice it, cost it, order it, implement incrementally, and pass mapped validation, correctness, and operational obligations per slice. Documentation is the last part of each slice: after the slice passes its mapped obligations, Builder updates the slice documentation before the slice may emit `implementation_complete`.

## Required Output Shape

For formal handoff, write TOML matching `templates/handoff.toml`. For long-form rationale, write Markdown and link it from the TOML handoff.
