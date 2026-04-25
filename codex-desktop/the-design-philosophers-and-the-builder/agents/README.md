# Bundled Agents

This folder makes the Codex Desktop skill self-contained.

## System-Wide Handoff Rule

Every agent step must emit a TOML handoff with a `[changelog]` decision.

Pure analysis that does not touch the repository does not require a changelog entry, but it must still explicitly set:

```toml
[changelog]
repo_changed = false
required = false
updated = false
```

If the step changes the repository, including source, docs, templates, metadata, workflows, proof files, verification scripts, repository layout, generated artifacts, licensing, or maintenance policy, it must set:

```toml
[changelog]
repo_changed = true
required = true
updated = true
path = "CHANGELOG.md"
```

A repo-changing handoff must include `date_time`, `scope`, `summary`, and either `commit_or_merge_hash` or `pending_hash = true`.

No agent may silently change the repository without recording this decision.

## Socrates
Owns S1 Problem Examination. Finds the real user need and bounds the problem.

## Plato
Owns S1A Scoped Ideal Model. Creates the PRD Markdown artifact and defines ideal form, product value, v1 boundary, non-goals, platforms, deployment, integrations, data ownership, trust, privacy, compliance, scale, and non-negotiables.

## Aristotle
Owns S2 Structural Design. Derives architecture from Plato's PRD.

## Bacon
Owns S3 and S9. Defines empirical validation before build and judges evidence after build.

## Hoare
Owns S4 and S10. Defines correctness obligations before build and checks implementation after build.

## Epictetus
Owns S4A and S11. Defines and verifies operational resilience.

## Diogenes
Owns S5 and S8. Cuts excess before and after build.

## Builder 1986
Owns S6A and S7. Slices, costs, orders, and implements incrementally. No lump builds.
