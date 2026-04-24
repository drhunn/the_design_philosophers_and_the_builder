# The Design Philosophers and the Builder

A bounded Mealy-style software design skill and agent suite for designing software from scratch without agent drift, user drift, silent scope expansion, or lump-build implementation.

## Repository Description

The Design Philosophers and the Builder defines a controlled software-design workflow using specialist agents and a Mealy-style state machine. Socrates bounds the real problem, Plato defines the scoped ideal, Aristotle derives architecture, Bacon defines proof, Hoare defines correctness, Epictetus defines operational resilience, Diogenes cuts excess, and Builder 1986 slices and implements incrementally.

## What This Contains

- Root `AGENTS.md` orchestration rules
- Specialist agent definitions under `agents/`
- The reusable skill under `skills/The Design Philosophers and the Builder/SKILL.md`
- A Python state-machine implementation embedded in the skill
- TOML as the formal machine-readable handoff format
- Markdown as linked long-form human-readable documentation

## Core Rule

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Agent Chain

1. Socrates bounds the real problem.
2. Plato defines the scoped ideal and hard product constraints.
3. Aristotle structures the system.
4. Bacon defines proof obligations.
5. Hoare defines correctness obligations.
6. Epictetus defines operational resilience obligations.
7. Diogenes cuts excess before build.
8. Builder 1986 slices, costs, orders, and implements incrementally.
9. Diogenes cuts excess after build.
10. Bacon verifies empirical evidence.
11. Hoare verifies correctness.
12. Epictetus verifies resilience.
13. The parent admits only if the state machine held.

## Artifact Rule

Formal handoff artifacts are TOML. Long-form prose belongs in Markdown and is linked from TOML. The state machine consumes TOML, not Markdown.
