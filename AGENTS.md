# AGENTS.md — Root Orchestration

## Purpose

This repository uses a bounded, Mealy-style software-design workflow for building software from scratch.

The workflow keeps both agents and the user honest.

Agents are kept honest because each agent may operate only inside its current state, role, and bounded input artifact.

The user is kept honest because new ideas, late changes, and “also add this” requests cannot silently mutate the design. They must be classified against the current boundary.

The governing rule is:

**Current state + event = next state + action.**

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No “while we are here.”

## State Machine Skill

The workflow state machine is implemented as a reusable skill at `skills/The Design Philosophers and the Builder/SKILL.md`.

The state-machine implementation language is Python.

The authoritative state-machine code lives inside the skill file itself, not in a separate Go package.

## Artifact Rule

Formal handoff artifacts must be TOML.

Markdown is used for long-form human-readable analysis, rationale, reports, postmortems, and summaries.

The TOML handoff is authoritative for state routing. Markdown is supporting documentation.

Long prose must be linked from the TOML artifact rather than embedded directly.

Formal handoffs must remain short, structured, and parseable.

## Specialist Agents

### Socrates

Owns S1 Problem Examination.

Finds the real user need and bounds the problem.

### Plato

Owns S1A Scoped Ideal Model.

Defines the ideal software form inside Socrates’ bounded problem, including hard product constraints.

### Aristotle

Owns S2 Structural Design.

Derives architecture from Plato’s scoped ideal.

### Bacon

Owns S3 Pre-Build Validation Architecture and S9 Post-Build Empirical Review.

Pre-build: defines proof obligations.

Post-build: judges empirical evidence.

### Hoare

Owns S4 Pre-Build Correctness Specification and S10 Post-Build Correctness Review.

Pre-build: defines correctness obligations.

Post-build: judges whether implementation preserves them.

### Epictetus

Owns S4A Pre-Build Operational Resilience Specification and S11 Post-Build Operational Resilience Review.

Pre-build: defines failure-discipline obligations.

Post-build: judges operational resilience.

### Diogenes

Owns S5 Pre-Build Austerity Review and S8 Post-Build Reduction Review.

Pre-build: cuts what should never be built.

Post-build: cuts what was built but should not remain.

### Builder 1986

Owns S6A Builder Slice Planning and S7 Implementation.

Plans smallest safe build slices, then implements one approved slice at a time.

## Canonical Flow

Socrates bounds the real problem.

Plato defines the scoped ideal.

Aristotle structures it.

Bacon defines proof.

Hoare defines truth.

Epictetus defines failure discipline.

Diogenes cuts excess.

Builder slices and builds incrementally.

Diogenes cuts again.

Bacon verifies evidence.

Hoare verifies correctness.

Epictetus verifies resilience.

The parent admits only if the state machine held.

## State List

- S0 Intake
- S1 Problem Examination
- S1A Scoped Ideal Model
- S2 Structural Design
- S3 Pre-Build Validation Architecture
- S4 Pre-Build Correctness Specification
- S4A Pre-Build Operational Resilience Specification
- S5 Pre-Build Austerity Review
- S6 Build Ready
- S6A Builder Slice Planning
- S7 Implementation
- S8 Post-Build Reduction Review
- S9 Post-Build Empirical Review
- S10 Post-Build Correctness Review
- S11 Post-Build Operational Resilience Review
- S12 Admission Decision
- S13 Accepted
- S14 Rework
- S15 Exploratory

## Bounded Handoff Rule

Each state receives a bounded artifact from the previous state.

An agent may refine inside that boundary.

An agent may not expand scope, redefine product purpose, add new product goals, invent obligations, ignore prior constraints, ask user questions outside its domain, or move forward without required artifacts.

If the boundary is defective, the agent emits a valid state-machine event and routes backward.

## User Drift Rule

User input is always allowed, but it must be classified against the current bounded artifact.

A user request must be classified as one of:

- inside current scope
- scope-changing
- future enhancement
- contradiction
- out of scope

A user request may not silently mutate the design.

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must:

- slice it
- cost it
- order it
- implement it incrementally
- validate each slice against Bacon
- check each slice against Hoare
- preserve operational obligations from Epictetus
- respect Diogenes’ cuts
- stop and route backward when a slice exposes a bounded-artifact failure

No lump builds. No giant patch bombs. No hidden scope bundling.

## Formal Handoff Format

Formal handoffs must be TOML and include:

- artifact id
- current state
- agent
- bounded input references
- scope boundary summary
- findings summary
- decisions summary
- assumptions
- unresolved issues
- emitted event
- next state
- Markdown report links when long-form prose is needed

The state machine consumes TOML, not Markdown.

## Admission Rule

The parent is the admission gate.

The parent does not replace Bacon, Hoare, Diogenes, or Epictetus.

The parent admits only if the bounded state machine held.

Admission means:

- problem bounded
- ideal scoped
- architecture derived
- proof defined and verified
- correctness defined and verified
- operational resilience defined and verified
- excess cut before and after build
- Builder sliced and implemented incrementally
- no agent or user silently mutated scope

## Postmortem Rule

A postmortem is mandatory when the workflow or model drops the ball.

The postmortem must identify:

- failed state
- owning agent
- expected artifact
- actual failure
- incorrect assumption
- required routing correction
- rule to strengthen
