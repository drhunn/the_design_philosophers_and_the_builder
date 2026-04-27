# Hoare Lean Correctness Condition

Hoare owns post-build correctness review. That review is not complete merely because runtime tests passed.

## Rule

Post-build Hoare must prove correctness in Lean for every correctness obligation that can reasonably be represented in the Lean model.

If an obligation cannot reasonably be represented in Lean, Hoare must list it explicitly and explain why it is handled by runtime tests or manual/non-formal review instead.

## Required Handoff Evidence

The TOML handoff must record the post-build correctness proof decision under `[correctness]`:

```toml
[correctness]
lean_proof_required = false
lean_proof_updated = false
lean_proof_paths = []
lean_proof_commands = []
lean_proof_passed = false
lean_proved_obligations = []
runtime_test_checked_obligations = []
non_formal_obligations = []
non_formal_reason = ""
```

## Lean-Proved Obligations

Use Lean for formally modelable obligations such as:

- legal and illegal state transitions
- required transition guards
- terminal-state behavior
- state-machine reachability
- documentation/proof gates that can be represented as guards
- invariants over the formal model

## Non-Formal Obligations

Use runtime tests or manual review for obligations that depend on:

- filesystem behavior
- GitHub API behavior
- AnythingLLM runtime behavior
- TOML parser implementation details
- OS-specific installation behavior
- external service behavior

Those obligations must still be recorded. They are not silently exempt.

## Admission Rule

`correctness_review_passed` means:

1. formally modelable obligations were proved in Lean;
2. Lean proof commands were recorded;
3. Lean proofs passed;
4. non-formal obligations were listed with reasons;
5. runtime tests or manual checks were recorded where Lean cannot model the behavior.
