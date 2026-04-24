---
name: "the-design-philosophers-and-the-builder"
description: >-
  Windows 11 Codex Desktop skill for designing software from scratch with a bounded Mealy-style workflow using philosopher agents, Builder 1986, Feature Branch Workflow backed by Git worktrees, one-task-at-a-time worktree slicing, one-patch-at-a-time patch discipline, TOML handoffs, security review, patch planning, and smallest-safe-slice implementation.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Codex Desktop on Windows 11 when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, preventing user or agent drift, forcing implementation through smallest safe build slices, enforcing Feature Branch Workflow backed by Git worktrees, slicing work inside each worktree into one task at a time, or requiring post-build security review and one-patch-at-a-time patching.

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

Socrates bounds the problem. Plato defines the scoped ideal. Aristotle derives structure. Bacon defines proof. Hoare defines correctness. Epictetus defines failure discipline. Diogenes cuts excess. Builder 1986 creates or initializes the GitHub repo, recursively identifies features and sub-features, creates matching branches and Git worktree checkout folders, uses the Feature Branch Workflow, slices each worktree into one task at a time, implements, verifies, then documents each task slice as the final task step. After the built system exists, Builder 1986 performs a security review, creates a needed patch list in sensible order, and applies each security patch one patch-task at a time with its own branch/worktree context, Bacon validation, Hoare correctness, Epictetus operational checks, Diogenes cut checks, targeted security tests, affected regression tests, and documentation update. Diogenes, Bacon, Hoare, and Epictetus review after security patching. Parent admits only if the state machine held.

## Routing Rules

If it changes the real problem, route to Socrates.
If it changes ideal form, value, platform, deployment, integration, trust, data ownership, scale, or v1 boundary, route to Plato.
If it changes structure, route to Aristotle.
If it changes evidence or validation, route to Bacon.
If it changes invariants or correctness, route to Hoare.
If it changes failure behavior or operational tolerance, route to Epictetus.
If it adds complexity without traceable value, route to Diogenes.
If it changes repository setup, recursive feature decomposition, branch workflow, Git worktree workflow, worktree task slicing, implementation, slice planning, post-build security review, security patch planning, or security patch implementation inside the approved scope, route to Builder.

## Builder Constraint

Builder must not build the whole design as a lump. Builder must create or initialize the GitHub repository, recursively identify and list sub-features for every feature, create a branch for each feature, create a sub-branch for each sub-feature, create a Git worktree checkout folder for each feature branch, create a Git worktree checkout folder for each sub-feature branch, and use the branches and Git worktree checkout folders as the Feature Branch Workflow.

Builder must use the correct Feature Branch Workflow when working on the project. Builder must not code on `main`, skip branches, skip Git worktrees, or flatten the recursive feature tree for convenience.

Inside each Git worktree, Builder must slice work into one task at a time. Builder must identify the next single task, confirm it belongs to the active feature or sub-feature, implement only that task, run mapped Bacon validation, check mapped Hoare correctness, check mapped Epictetus operational behavior, confirm Diogenes cuts were not reintroduced, run mapped tests, document the task, and only then start the next task.

Builder must not batch security patches. After implementation is complete, Builder must run a security review, produce a needed security patch list in sensible order, then patch one patch at a time in the correct branch and Git worktree checkout folder. Each patch is one patch task: one bounded task slice, one branch/worktree context, one validation cycle, one test cycle, and one documentation update. Each patch must run its own mapped Bacon validation, mapped Hoare correctness checks, mapped Epictetus operational checks, Diogenes cut checks, targeted security tests, affected regression tests, and patch documentation before moving on. Builder may emit `security_patches_complete` only after every required patch has passed those gates and documentation is updated.

## Required Output Shape

For formal handoff, write TOML matching `templates/handoff.toml`. For long-form rationale, write Markdown and link it from the TOML handoff.
