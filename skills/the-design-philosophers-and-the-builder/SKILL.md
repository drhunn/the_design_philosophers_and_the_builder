---
name: "the-design-philosophers-and-the-builder"
description: >-
  Windows 11 Codex Desktop skill for designing software from scratch with a
  bounded Mealy-style workflow using philosopher agents, Builder 1986, TOML
  handoffs, and smallest-safe-slice implementation.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Codex Desktop on Windows 11 when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, preventing user or agent drift, or forcing implementation through smallest safe build slices.

This skill is a bounded Mealy-style control system.

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Windows 11 Installation

Install this skill into one of these Codex Desktop skill locations:

- User skill location: `%USERPROFILE%\.codex\skills\the-design-philosophers-and-the-builder\SKILL.md`
- Project-local skill location: `<repo>\.codex\skills\the-design-philosophers-and-the-builder\SKILL.md`

Recommended PowerShell install from this repository:

```powershell
$SkillName = "the-design-philosophers-and-the-builder"
$Source = ".\skills\the-design-philosophers-and-the-builder"
$Dest = Join-Path $env:USERPROFILE ".codex\skills\$SkillName"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Copy-Item -Path "$Source\*" -Destination $Dest -Recurse -Force
Write-Host "Installed $SkillName to $Dest"
Write-Host "Restart Codex Desktop to reload skills."
```

## Bundled Files

This skill is self-contained. Use these local files when needed:

- `agents/README.md` summarizes all bundled agents.
- `agents/socrates.md` defines Socrates.
- `agents/plato.md` defines Plato.
- `agents/aristotle.md` defines Aristotle.
- `agents/bacon.md` defines Bacon.
- `agents/hoare.md` defines Hoare.
- `agents/epictetus.md` defines Epictetus.
- `agents/diogenes.md` defines Diogenes.
- `agents/builder-1986.md` defines Builder 1986.
- `scripts/state_machine.py` contains the Python state machine.
- `templates/handoff.toml` contains the formal TOML handoff template.

## Formal Artifact Rule

Formal state handoffs must be TOML.

Markdown is for linked long-form prose only.

The state machine consumes TOML, not Markdown.

Do not embed long reasoning in TOML. Link Markdown reports from TOML.

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

If it changes ideal form, value, platform, deployment, integration, trust model, data ownership, scale, or v1 boundary, route to Plato.

If it changes structure, route to Aristotle.

If it changes evidence or validation, route to Bacon.

If it changes invariants or correctness, route to Hoare.

If it changes failure behavior or operational tolerance, route to Epictetus.

If it adds complexity without traceable value, route to Diogenes.

If it changes implementation inside an approved slice, route to Builder.

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must slice it, cost it, order it, and implement incrementally.

A slice is not done because code exists.

A slice is done only when it satisfies mapped validation, correctness, and operational obligations.

## Codex Desktop Behavior

When this skill triggers, Codex should:

1. Determine the current state.
2. Classify new user input against the current bounded artifact.
3. Emit only valid events for the current state.
4. Produce TOML handoffs for formal transitions.
5. Use linked Markdown for long reports.
6. Refuse silent scope expansion.
7. Enforce Builder slice planning before implementation.
8. Route backward instead of guessing when a prior boundary is incomplete.

## Trigger Phrases

Use this skill when the user says things like:

- design software from scratch
- use the philosophers
- use the design philosophers
- run the Mealy state machine
- keep the design bounded
- prevent scope drift
- slice the implementation
- no lump builds
- use Socrates, Plato, Aristotle, Bacon, Hoare, Epictetus, Diogenes, and Builder

## Required Output Shape

For formal handoff, write TOML matching `templates/handoff.toml`.

For long-form rationale, write Markdown and link it from the TOML handoff.
