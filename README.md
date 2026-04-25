# The Design Philosophers and the Builder

A bounded Mealy-style software-design workflow for designing software from scratch without agent drift, user drift, silent scope expansion, silent repository changes, missing PRD handoff, missing changelog traceability, lump-build implementation, invalid Git branch refs, nested Git worktrees, loose worktree task slicing, or loose patching.

This repository packages the same workflow for three runtimes:

- Codex Desktop
- Claude Code
- AnythingLLM

Each runtime package is self-contained and can be copied independently.

## Hard Rules

- Do not create parent and child refs in the same Git namespace.
- Do not nest Git worktrees inside other Git worktrees.
- Do not code directly on `main`.
- Every loaded agent prompt must include the global agent preamble from `agents/global.md`.
- Every formal handoff must explicitly set `[changelog].repo_changed` to `true` or `false`.
- Pure analysis that does not touch the repository may set `repo_changed = false` and does not require a changelog entry.
- Any repository-changing step must update `CHANGELOG.md` or mark the changelog hash as pending in the handoff.
- Changelog-only maintenance commits that replace `PENDING` with a known commit or merge hash do not require their own changelog entry.
- Plato must create or update a PRD Markdown file before Aristotle designs architecture.
- The PRD path must be linked from `[markdown_links].prd` in the TOML handoff.
- Every meaningful repository change must be recorded in `CHANGELOG.md`, including repository-level changes, not just source-code changes.
- Changelog entries must include date/time, summary, scope, and commit or merge hash.
- Do not batch task slices.
- Do not batch patches.
- Do not move to the next task or patch before documentation is updated.
- Do not install only the main skill file. Copy the whole runtime package.
- Each runtime package carries its own `LICENSE` file.

## Canonical Runtime Packages

Use these folders as the canonical installable packages:

```text
codex-desktop/the-design-philosophers-and-the-builder/
claude-code/the-design-philosophers-and-the-builder/
anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder/
```

Do not install only the main skill file. Copy the whole runtime folder so agents, templates, scripts, license, and local references remain available.

## Codex Desktop

Installable package:

```text
codex-desktop/the-design-philosophers-and-the-builder/
```

Copy the whole folder to:

```text
%USERPROFILE%\.codex\skills\the-design-philosophers-and-the-builder\
```

or project-local:

```text
<repo>\.codex\skills\the-design-philosophers-and-the-builder\
```

## Claude Code

Installable package:

```text
claude-code/the-design-philosophers-and-the-builder/
```

Copy the whole folder to:

```text
%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\
```

or project-local:

```text
<repo>\.claude\skills\the-design-philosophers-and-the-builder\
```

## AnythingLLM

Installable plugin package:

```text
anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder/
```

Copy the whole folder into AnythingLLM's custom agent skills directory and enable it in AnythingLLM's agent skill settings.

The AnythingLLM base state machine is embedded in `handler.js`. The plugin entrypoint is `handler-with-global.js`, which delegates to `handler.js` and overrides action loading so `agents/global.md` is prepended to every loaded agent prompt.

## Global Agent Preamble

Each runtime package contains:

```text
agents/global.md
```

The dispatcher/loader prepends that file to every loaded agent prompt.

This global preamble is the system-wide control surface for rules that every agent step must obey. It currently requires every handoff to explicitly decide whether the repository changed:

```toml
[changelog]
repo_changed = false
```

Pure analysis sets `repo_changed = false`. A step that changes the repository sets `repo_changed = true`, updates `CHANGELOG.md`, and records date/time, scope, summary, and either a commit or merge hash or `pending_hash = true`.

This is not a Builder-only rule. It applies to Socrates, Plato, Aristotle, Bacon, Hoare, Epictetus, Diogenes, Builder, patching, proof work, documentation work, workflow changes, metadata changes, templates, and verifier changes.

## Agent Chain

1. Socrates bounds the real problem.
2. Plato creates the PRD-level product artifact as Markdown and links it from the TOML handoff.
3. Aristotle derives the structure from Plato's PRD.
4. Bacon defines proof obligations.
5. Hoare defines correctness obligations.
6. Epictetus defines operational resilience obligations.
7. Diogenes cuts excess before build.
8. Builder 1986 creates or initializes the GitHub repository.
9. Builder 1986 recursively identifies features and sub-features.
10. Builder 1986 creates collision-free branches and flat Git worktree checkout folders for the Feature Branch Workflow.
11. Builder 1986 slices each Git worktree into one task at a time.
12. Builder 1986 implements, validates, checks, tests, documents each task slice, and records the changelog decision before starting the next task.
13. Builder 1986 performs a post-build security review.
14. Builder 1986 creates a needed patch list in sensible order.
15. Builder 1986 patches one patch-task at a time, and each patch-task must pass Bacon validation, Hoare correctness, Epictetus operational checks, Diogenes cut checks, targeted tests, affected regression tests, documentation, and changelog-decision requirements before the next patch starts.
16. Diogenes cuts excess after patching.
17. Bacon verifies evidence.
18. Hoare verifies correctness.
19. Epictetus verifies resilience.
20. The parent admits only if the state machine held.

## Plato PRD Markdown Output

Plato owns the PRD-level product artifact for the bounded problem Socrates handed forward.

Plato must create or update a PRD Markdown file before emitting `ideal_model_complete`.

Normal PRD path:

```text
docs/product/prd.md
```

Package-local template:

```text
templates/prd.md
```

The PRD path must be linked from the TOML handoff:

```toml
[markdown_links]
prd = ["docs/product/prd.md"]
```

Aristotle must derive architecture from the PRD. If PRD content is missing, ambiguous, or contradictory, Aristotle routes back to Plato instead of guessing.

## Changelog Rule

`CHANGELOG.md` is part of the repository control surface.

Every meaningful repository change must be recorded there, including:

- source-code changes
- documentation changes
- workflow and CI changes
- package metadata changes
- proof-model changes
- verification-script changes
- template changes
- licensing changes
- repository layout changes
- maintenance-policy changes

Each changelog entry must include:

- date and time
- scope
- summary
- commit or merge hash

A commit cannot know its own final hash before it is created. If needed, a later changelog-maintenance commit may replace a `PENDING` marker with the known commit or merge hash. That changelog-only maintenance commit is not itself a meaningful repository change for changelog-entry purposes and does not require a new changelog entry.

The CI changelog policy verifier enforces this distinction:

- pull requests with meaningful repository changes must include `CHANGELOG.md`
- normal pull requests may use `PENDING` when the final merge hash is unknowable
- changelog-only maintenance pull requests may only replace `PENDING` with a 40-character hash

## Builder Feature Branch Workflow

Builder must not start implementation until the Feature Branch Workflow exists.

Builder must:

1. Create or initialize the GitHub repository.
2. Identify every feature.
3. Recursively identify and list sub-features for each feature.
4. Create a collision-free branch for each feature.
5. Create a collision-free branch for each sub-feature.
6. Create flat sibling Git worktree checkout folders for each feature and sub-feature branch.
7. Use the branches and Git worktree checkout folders to create the Feature Branch Workflow.
8. Use the correct Feature Branch Workflow when working on the project.

## Branch Naming Rule

Do not create parent and child refs in the same Git namespace. Git cannot safely hold both `feature/foo` and `feature/foo/bar` as branches.

Use flat branch names after a top-level namespace:

```text
feature/<feature-slug>
subfeature/<feature-slug>--<sub-feature-path-slug>
task/<feature-slug>--<sub-feature-path-slug>--<task-slug>
patch/<feature-slug>--<sub-feature-path-slug>--<patch-id>
```

Examples:

```text
feature/state-machine
subfeature/state-machine--transition-table
subfeature/state-machine--transition-table--guard-checks
task/state-machine--transition-table--guard-checks--reject-invalid-transition
patch/state-machine--transition-table--guard-checks--P001
```

Builder must not code directly on `main`, skip branches, or flatten the recursive feature tree for convenience.

## Git Worktree Checkout Rule

Do not nest Git worktrees inside other Git worktrees.

Use flat sibling checkout folders:

```text
../worktrees/<repo-slug>/feature--<feature-slug>/
../worktrees/<repo-slug>/subfeature--<feature-slug>--<sub-feature-path-slug>/
../worktrees/<repo-slug>/task--<feature-slug>--<sub-feature-path-slug>--<task-slug>/
../worktrees/<repo-slug>/patch--<feature-slug>--<sub-feature-path-slug>--<patch-id>/
```

Command shape:

```text
git worktree add ../worktrees/<repo-slug>/feature--<feature-slug> feature/<feature-slug>
git worktree add ../worktrees/<repo-slug>/subfeature--<feature-slug>--<sub-feature-path-slug> subfeature/<feature-slug>--<sub-feature-path-slug>
git worktree add ../worktrees/<repo-slug>/task--<feature-slug>--<sub-feature-path-slug>--<task-slug> task/<feature-slug>--<sub-feature-path-slug>--<task-slug>
git worktree add ../worktrees/<repo-slug>/patch--<feature-slug>--<sub-feature-path-slug>--<patch-id> patch/<feature-slug>--<sub-feature-path-slug>--<patch-id>
```

Builder must verify the active checkout with `git branch --show-current` or equivalent before modifying files.

## Workflow vs. Git Worktree

Workflow means the rules for creating, using, validating, documenting, and merging branches and worktrees.

Git worktree means the real checkout folder created by Git for one branch.

Branch means the Git history line.

Task slice means one bounded unit of work inside the active Git worktree.

Patch task means one bounded corrective or security patch handled as one task slice inside the correct Git worktree.

Builder must not confuse these terms.

## Builder Worktree Task Slicing Rule

A Git worktree is not permission to do a lump build.

Inside each Git worktree, Builder must slice work into one task at a time.

Each task must be completed in this order:

1. Confirm the correct feature, sub-feature, or task branch is active.
2. Confirm the matching Git worktree checkout folder is active.
3. Identify the next single task.
4. Confirm the task belongs to the active feature or sub-feature.
5. Implement only that task.
6. Run the mapped Bacon validation.
7. Check the mapped Hoare correctness obligations.
8. Check the mapped Epictetus operational obligations.
9. Confirm Diogenes' cuts were not reintroduced.
10. Run the mapped tests for that task.
11. Update documentation for the completed task slice.
12. Record the changelog decision in the handoff.
13. Emit `task_slice_complete` only after documentation and changelog decision are updated.
14. Start the next task only after documentation and changelog decision are updated.

Documentation and changelog decision are part of the task slice, not afterthoughts outside the slice.

## Builder Post-Build Patch Rule

Builder must not batch patches.

After the system is built, Builder must complete this sequence before post-build Diogenes, Bacon, Hoare, and Epictetus reviews:

1. Perform a post-build security review of the implemented system.
2. Produce a needed patch list in sensible order.
3. Assign one patch task id to the current patch.
4. Apply one patch at a time in the correct branch and Git worktree checkout folder.
5. Confirm the patch belongs to the active feature or sub-feature.
6. Treat the patch as one task slice inside that worktree.
7. Touch only the files required for that patch.
8. Run the mapped Bacon validation.
9. Check the mapped Hoare correctness obligations.
10. Check the mapped Epictetus operational obligations.
11. Confirm Diogenes' cuts were not reintroduced.
12. Run targeted tests.
13. Run affected regression tests.
14. Update patch documentation.
15. Record the changelog decision in the handoff.
16. Emit `patch_task_complete` only after documentation and changelog decision are updated.
17. Move to the next patch only after documentation and changelog decision are updated.
18. Emit `all_patch_tasks_complete` only after every required patch is patched, validated, checked, tested, documented, and assigned a changelog decision.

One patch means one task slice, one branch/worktree context, one validation cycle, one test cycle, one documentation update, and one changelog decision.

A patch branch merges into its affected task branch, sub-feature branch, or feature branch. A patch branch must not merge directly to `main` unless the affected branch is `main` and the patch is explicitly approved as a mainline hotfix.

Patch order is based on exploitability or user impact, blast radius, privilege impact, data exposure risk, dependency order, testability, and operational risk.

## State-Machine Builder Flow

The enforced Builder portion of the state machine is:

```text
S6_BUILD_READY
S6B_BUILDER_FEATURE_WORKTREE_WORKFLOW
S6C_BUILDER_TASK_SLICE_PLANNING
S7_TASK_SLICE_IMPLEMENTATION
S6C_BUILDER_TASK_SLICE_PLANNING  # loop until all task slices complete
S7A_BUILDER_SECURITY_REVIEW
S7B_PATCH_PLANNING
S7C_PATCH_TASK_PLANNING
S7D_PATCH_TASK_IMPLEMENTATION
S7C_PATCH_TASK_PLANNING          # loop until all patch tasks complete
S8_POST_BUILD_REDUCTION_REVIEW
S9_POST_BUILD_EMPIRICAL_REVIEW
S10_POST_BUILD_CORRECTNESS_REVIEW
S11_POST_BUILD_OPERATIONAL_RESILIENCE_REVIEW
S12_ADMISSION_DECISION
S13_ACCEPTED
```

## Action Dispatcher Loader

The state machine emits action names such as `run_socrates`, `run_hoare_prebuild`, and `run_builder_task_slice_planning`. The dispatcher/loader maps those fixed action names to bundled agent Markdown files and prepends `agents/global.md` to every loaded agent prompt.

Codex and Claude packages include:

```text
scripts/dispatcher.py
```

AnythingLLM exposes equivalent operations through `handler-with-global.js`:

```text
resolve_actions
load_actions
dispatch_and_load
```

The loader uses a fixed action-to-file map. It does not accept arbitrary file paths from user input.

Examples:

```text
run_socrates -> agents/global.md + agents/socrates.md
run_plato -> agents/global.md + agents/plato.md
run_aristotle -> agents/global.md + agents/aristotle.md
run_bacon_prebuild -> agents/global.md + agents/bacon.md
run_hoare_prebuild -> agents/global.md + agents/hoare.md
run_epictetus_prebuild -> agents/global.md + agents/epictetus.md
run_diogenes_prebuild -> agents/global.md + agents/diogenes.md
run_builder_task_slice_planning -> agents/global.md + agents/builder-1986.md
```

Controller actions such as `check_build_package`, `make_admission_decision`, `accept_feature`, and `require_postmortem` intentionally do not load agent files.

## Lean Proof Checks

The repository includes a Lean 4 proof project under:

```text
proofs/lean/
```

The current proof model is:

```text
proofs/lean/TheDesignPhilosophers/StateMachine.lean
```

It proves selected correctness properties of the finite state-machine model:

- the happy path reaches `S13_ACCEPTED`
- `S13_ACCEPTED` is terminal
- task completion requires task documentation
- patch completion requires patch documentation
- invalid direct patch completion from patch planning is rejected
- selected invalid events are rejected

The Lean proof checks the formal model. It does not prove Python runtime behavior, JavaScript runtime behavior, TOML parser behavior, GitHub behavior, filesystem behavior, or AnythingLLM behavior. A future conformance bridge should generate the Lean model from the implementation or generate implementation tests from the Lean model.

GitHub Actions runs the Lean proof workflow on push and pull request. To run it locally, install Lean/Lake and run:

```powershell
cd proofs\lean
lake build
```

## Artifact Rule

Formal handoff artifacts are TOML.

Markdown is for linked long-form prose.

The state machine consumes TOML, not Markdown.

Every handoff template includes proof-carrying sections for `git`, `task`, `patch`, `validation`, `documentation`, `remaining_work`, `changelog`, and `markdown_links`. These fields are where the active branch, flat worktree path, task id, patch id, validation evidence, documentation update flags, remaining work inventory, changelog decision, PRD link, and other Markdown artifact links are recorded.

## Package Verification

Package verification requires Python 3.11 or newer. Node.js is optional but required for the AnythingLLM handler execution check; if Node.js is unavailable, the verifier skips that execution check and still runs static checks.

Run the package verifier before treating a package change as done:

```powershell
python tools\verify_packages.py
```

The verifier checks required files, package-local MIT licenses, `CHANGELOG.md` format and commit hash entries, global agent preamble files, YAML front matter, TOML templates with proof-carrying sections, `[changelog].repo_changed`, `[markdown_links].prd`, Plato PRD ownership, PRD templates, Python state-machine happy paths with task and patch loops, Python dispatcher global preamble loading, AnythingLLM wrapper handler global preamble loading when Node.js is available, AnythingLLM embedded handoff PRD/changelog links, AnythingLLM plugin metadata, and Builder workflow drift markers.

Run the changelog policy verifier before treating changelog-rule changes as done:

```powershell
python tools\verify_changelog_policy.py
```

The changelog policy verifier uses Git history in CI to distinguish meaningful repository changes from changelog-only hash finalization. The GitHub Actions package workflow fetches full history so this diff check can compare pull requests against `main`.

A GitHub Actions workflow runs both verifiers on push and pull request against `main`.

## Repository Layout

```text
codex-desktop/        canonical Codex Desktop package
claude-code/          canonical Claude Code package
anythingllm/          canonical AnythingLLM package
proofs/               Lean proof models and proof-checking project
tools/                package verification and maintenance tools
```

## Maintenance Rule

The three runtime packages are intentionally self-contained. When changing behavior, update all runtime packages or run `tools/verify_packages.py` and fix drift before considering the work complete.

Also update `CHANGELOG.md` for meaningful repository changes. This includes repo-level changes such as documentation, CI workflows, package metadata, proof models, verification scripts, templates, licensing, repository layout, and maintenance policy changes.

Changelog-only maintenance commits that replace a `PENDING` marker with a known commit or merge hash are bookkeeping cleanup and do not require another changelog entry.

## License

This project is licensed under the MIT License. See `LICENSE`.

Each self-contained runtime package also includes its own `LICENSE` file so the MIT copyright and permission notice travels with copied packages.
