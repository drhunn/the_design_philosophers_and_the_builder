---
name: "the-design-philosophers-and-the-builder"
description: >-
  Use this skill when designing software from scratch and you need a bounded
  Mealy-style workflow that prevents agent drift, user drift, silent scope
  expansion, and lump-build implementation. Routes work through Socrates,
  Plato, Aristotle, Bacon, Hoare, Epictetus, Diogenes, and Builder 1986 using
  TOML handoffs.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Claude Code when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, or forcing implementation through smallest safe build slices.

This is a bounded Mealy-style control system.

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Claude Code Installation

Install as a project skill:

`.claude/skills/the-design-philosophers-and-the-builder/SKILL.md`

Or install as a user skill on Windows 11:

`%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\SKILL.md`

Recommended PowerShell install from this repository:

```powershell
$SkillName = "the-design-philosophers-and-the-builder"
$Source = ".\.claude\skills\$SkillName"
$Dest = Join-Path $env:USERPROFILE ".claude\skills\$SkillName"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Copy-Item -Path "$Source\*" -Destination $Dest -Recurse -Force
Write-Host "Installed $SkillName to $Dest"
Write-Host "Restart Claude Code to reload skills."
```

## State Machine Source

The Python state-machine implementation is in:

`scripts/state_machine.py`

The TOML handoff template is in:

`templates/handoff.toml`

Use those files as the authoritative machine-readable implementation and handoff shape.

## Formal Artifact Rule

Formal state handoffs must be TOML.

Markdown is for linked long-form prose only.

The state machine consumes TOML, not Markdown.

Do not embed long reasoning in TOML. Link Markdown reports from TOML.

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

## Claude Code Behavior

When this skill triggers, Claude should:

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
