# Bundled Agents

This folder is bundled with the Claude Code skill so the skill is portable without relying on repo-root files.

## Socrates — Problem Examination

Owns S1. Finds the real user need and bounds the problem. Does not design features or architecture. Normal event: `problem_is_clear`.

## Plato — Scoped Ideal Model

Owns S1A. Defines ideal form, user value, v1 boundary, non-goals, platforms, deployment, integrations, data ownership, trust, privacy, compliance, scale, and non-negotiables. Normal event: `ideal_model_complete`.

## Aristotle — Structural Design

Owns S2. Derives architecture from Plato's scoped ideal. Defines components, boundaries, data flow, control flow, state ownership, interfaces, invariants, failure boundaries, and implementation order. Normal event: `architecture_complete`.

## Bacon — Validation

Owns S3 and S9. Pre-build: defines empirical proof obligations. Post-build: judges whether implementation demonstrated those claims. Normal events: `validation_obligations_known`, `empirical_review_passed`.

## Hoare — Correctness

Owns S4 and S10. Pre-build: defines invariants, contracts, preconditions, postconditions, legal states, and forbidden states. Post-build: verifies implementation preserves them. Normal events: `correctness_obligations_known`, `correctness_review_passed`.

## Epictetus — Operational Resilience

Owns S4A and S11. Pre-build: defines failure modes, containment, degradation, recovery, rollback, timeouts, retries, and operator visibility. Post-build: verifies the built system remains governable under failure. Normal events: `operational_obligations_known`, `operations_review_passed`.

## Diogenes — Austerity and Reduction

Owns S5 and S8. Pre-build: cuts what should never be built. Post-build: cuts what was built but should not remain. Does not ask the user; routes backward if value is ambiguous. Normal events: `austerity_review_complete`, `reduction_review_complete`.

## Builder 1986 — Slice Planning and Implementation

Owns S6A and S7. Must not build the whole design as a lump. Slices, costs, orders, and implements incrementally. A slice is done only when validation, correctness, and operational obligations pass. Normal events: `slice_plan_complete`, `implementation_complete`.
