---
name: "the-design-philosophers-and-the-builder"
description: >-
  Use this skill when designing software from scratch and you need a bounded Mealy-style workflow that prevents agent drift, user drift, silent scope expansion, silent repo changes, lump-build implementation, missing collision-free Feature Branch Workflow backed by flat Git worktrees, missing one-task-at-a-time worktree slicing, missing Plato PRD Markdown output, missing fixed action-to-agent dispatch/loading with a global preamble, and missing one-patch-at-a-time post-build patch discipline.
---

# The Design Philosophers and the Builder

## Purpose

Use this skill in Claude Code when designing software from scratch, turning a vague idea into a buildable system, reviewing scope changes, forcing implementation through smallest safe build slices, enforcing Feature Branch Workflow backed by flat Git worktrees, slicing work inside each worktree into one task at a time, loading the correct bundled agent prompt from a state-machine action, requiring every handoff to explicitly decide whether the repo changed, requiring Plato to create a PRD Markdown file before Aristotle designs architecture, or requiring post-build security review and one-patch-at-a-time patching.

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No silent repo changes. No "while we are here."

## Install

Copy this whole folder to:

`%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\`

or project-local:

`<repo>\.claude\skills\the-design-philosophers-and-the-builder\`

## Runtime Requirements

The Markdown agents and TOML templates are plain text. Running `scripts/state_machine.py` directly requires Python 3.11 or newer because it uses the standard-library `tomllib` module. `scripts/dispatcher.py` is a fixed-map loader and should be run with the same supported package Python runtime.

## Bundled Files

- `agents/README.md`
- `agents/global.md`
- `agents/socrates.md`
- `agents/plato.md`
- `agents/aristotle.md`
- `agents/bacon.md`
- `agents/hoare.md`
- `agents/epictetus.md`
- `agents/diogenes.md`
- `agents/builder-1986.md`
- `scripts/state_machine.py`
- `scripts/dispatcher.py`
- `templates/handoff.toml`
- `templates/prd.md`

## Global Agent Preamble

`agents/global.md` is prepended to every loaded agent prompt by `scripts/dispatcher.py`.

That preamble requires every handoff to explicitly set `[changelog].repo_changed` to `true` or `false`. Pure analysis may set `repo_changed = false`. Repository-changing steps must update `CHANGELOG.md` and provide changelog evidence or mark the hash pending.

## Artifact Rule

Formal handoffs are TOML. Long-form prose is Markdown linked from TOML. The state machine consumes TOML, not Markdown.

Plato must create or update a PRD Markdown file before emitting `ideal_model_complete`. The normal PRD path is `docs/product/prd.md`, and that path must be linked from `[markdown_links].prd` in the TOML handoff.

Every TOML handoff must include a `[changelog]` section. That section prevents silent repo changes by forcing the current step to say whether it touched the repository.

## Agent Chain

Socrates bounds the problem. Plato creates the PRD-level product artifact as Markdown and links it from the TOML handoff. Aristotle derives structure from that PRD. Bacon defines proof. Hoare defines correctness. Epictetus defines failure discipline. Diogenes cuts excess. Builder 1986 creates or initializes the GitHub repo, recursively identifies features and sub-features, creates collision-free branches and flat Git worktree checkout folders, uses the Feature Branch Workflow, slices each worktree into one task at a time, implements, verifies, then documents each task slice as the final task step. Every agent step must make a changelog decision. After the built system exists, Builder 1986 performs a post-build security review, creates a needed patch list in sensible order, and applies each patch one patch-task at a time with its own branch/worktree context, Bacon validation, Hoare correctness, Epictetus operational checks, Diogenes cut checks, targeted tests, affected regression tests, documentation update, and changelog decision. Diogenes, Bacon, Hoare, and Epictetus review after patching. Parent admits only if the state machine held.

## Action Dispatcher Loader

The state machine emits action names such as `run_socrates`, `run_hoare_prebuild`, and `run_builder_task_slice_planning`. `scripts/dispatcher.py` maps those fixed action names to bundled agent Markdown files and prepends `agents/global.md` before returning loaded agent content.

Examples:

- `run_socrates` -> `agents/global.md` + `agents/socrates.md`
- `run_plato` -> `agents/global.md` + `agents/plato.md`
- `run_aristotle` -> `agents/global.md` + `agents/aristotle.md`
- `run_bacon_prebuild` -> `agents/global.md` + `agents/bacon.md`
- `run_hoare_prebuild` -> `agents/global.md` + `agents/hoare.md`
- `run_epictetus_prebuild` -> `agents/global.md` + `agents/epictetus.md`
- `run_diogenes_prebuild` -> `agents/global.md` + `agents/diogenes.md`
- `run_builder_task_slice_planning` -> `agents/global.md` + `agents/builder-1986.md`

Controller actions such as `check_build_package`, `make_admission_decision`, `accept_feature`, and `require_postmortem` do not load agent files.

The dispatcher uses a fixed action-to-file map. It does not accept arbitrary file paths from user input.

## Builder Constraint

Builder must not build the whole design as a lump. Builder must create or initialize the GitHub repository, recursively identify and list sub-features for every feature, create collision-free branches, create flat sibling Git worktree checkout folders, and use the branches and Git worktree checkout folders as the Feature Branch Workflow.

Builder must not create parent and child refs in the same Git namespace. Use branch names like `feature/<feature-slug>`, `subfeature/<feature-slug>--<sub-feature-path-slug>`, `task/<feature-slug>--<sub-feature-path-slug>--<task-slug>`, and `patch/<feature-slug>--<sub-feature-path-slug>--<patch-id>`.

Builder must not nest Git worktrees inside other Git worktrees. Use flat sibling paths like `../worktrees/<repo-slug>/feature--<feature-slug>/`, `../worktrees/<repo-slug>/subfeature--<feature-slug>--<sub-feature-path-slug>/`, `../worktrees/<repo-slug>/task--<feature-slug>--<sub-feature-path-slug>--<task-slug>/`, and `../worktrees/<repo-slug>/patch--<feature-slug>--<sub-feature-path-slug>--<patch-id>/`.

Builder must use the correct Feature Branch Workflow when working on the project. Builder must not code on `main`, skip branches, skip Git worktrees, or flatten the recursive feature tree for convenience.

Inside each Git worktree, Builder must slice work into one task at a time. Builder must identify the next single task, confirm it belongs to the active feature or sub-feature, implement only that task, run mapped Bacon validation, check mapped Hoare correctness, check mapped Epictetus operational behavior, confirm Diogenes cuts were not reintroduced, run mapped tests, document the task, emit `task_slice_complete`, and only then start the next task.

Builder must not batch patches. After implementation is complete, Builder must run a post-build security review, produce a needed patch list in sensible order, then patch one patch at a time in the correct branch and Git worktree checkout folder. Each patch is one patch task: one bounded task slice, one branch/worktree context, one validation cycle, one test cycle, one documentation update, and one changelog decision. Each patch must run its own mapped Bacon validation, mapped Hoare correctness checks, mapped Epictetus operational checks, Diogenes cut checks, targeted tests, affected regression tests, and patch documentation before moving on.

## Required Output Shape

For formal handoff, write TOML matching `templates/handoff.toml`. For Plato PRDs and other long-form rationale, write Markdown and link it from the TOML handoff.
