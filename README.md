# The Design Philosophers and the Builder

A bounded Mealy-style software-design workflow for designing software from scratch without agent drift, user drift, silent scope expansion, lump-build implementation, missing Feature Branch Workflow, loose worktree task slicing, or loose security patching.

This repository packages the same workflow for three runtimes:

- Codex Desktop
- Claude Code
- AnythingLLM

Each runtime package is self-contained and can be copied independently.

## Canonical Runtime Packages

Use these folders as the canonical installable packages:

```text
codex-desktop/the-design-philosophers-and-the-builder/
claude-code/the-design-philosophers-and-the-builder/
anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder/
```

Do not install only the main skill file. Copy the whole runtime folder so agents, templates, scripts, and local references remain available.

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

The AnythingLLM state machine is embedded in `handler.js` so the plugin does not depend on Python or repo-root files.

## Agent Chain

1. Socrates bounds the real problem.
2. Plato defines the scoped ideal and hard product constraints.
3. Aristotle derives the structure.
4. Bacon defines empirical proof obligations.
5. Hoare defines correctness obligations.
6. Epictetus defines operational resilience obligations.
7. Diogenes cuts excess before build.
8. Builder 1986 creates or initializes the GitHub repository.
9. Builder 1986 recursively identifies features and sub-features.
10. Builder 1986 creates matching branches and Git worktree checkout folders for the Feature Branch Workflow.
11. Builder 1986 slices each Git worktree into one task at a time.
12. Builder 1986 implements, verifies, tests, and documents each task slice before starting the next task.
13. Builder 1986 performs a post-build security review.
14. Builder 1986 creates a needed security patch list in sensible order.
15. Builder 1986 patches one patch-task at a time, and each patch-task must pass Bacon validation, Hoare correctness, Epictetus operational checks, Diogenes cut checks, testing, and documentation before the next patch starts.
16. Diogenes cuts excess after security patching.
17. Bacon verifies empirical evidence.
18. Hoare verifies correctness.
19. Epictetus verifies resilience.
20. The parent admits only if the state machine held.

## Builder Feature Branch Workflow

Builder must not start implementation until the Feature Branch Workflow exists.

Builder must:

1. Create or initialize the GitHub repository.
2. Identify every feature.
3. Recursively identify and list sub-features for each feature.
4. Create a branch for each feature.
5. Create a sub-branch for each sub-feature.
6. Create a Git worktree checkout folder for each feature branch.
7. Create a Git worktree checkout folder for each sub-feature branch.
8. Use the branches and Git worktree checkout folders to create the Feature Branch Workflow.
9. Use the correct Feature Branch Workflow when working on the project.

Branch pattern:

```text
feature/<feature-slug>
feature/<feature-slug>/<sub-feature-slug>
feature/<feature-slug>/<sub-feature-slug>/<nested-sub-feature-slug>
```

Git worktree checkout pattern:

```text
../worktrees/<repo-slug>/<feature-slug>/
../worktrees/<repo-slug>/<feature-slug>/<sub-feature-slug>/
../worktrees/<repo-slug>/<feature-slug>/<sub-feature-slug>/<nested-sub-feature-slug>/
```

Builder must not code directly on `main`, skip branches, skip Git worktrees, or flatten the recursive feature tree for convenience.

## Workflow vs. Git Worktree

Workflow means the rules for creating, using, validating, documenting, and merging branches and worktrees.

Git worktree means the real checkout folder created by Git for one branch.

Branch means the Git history line.

Task slice means one bounded unit of work inside the active Git worktree.

Builder must not confuse these terms.

## Builder Worktree Task Slicing Rule

A Git worktree is not permission to do a lump build.

Inside each Git worktree, Builder must slice work into one task at a time.

Each task must be completed in this order:

1. Confirm the correct feature or sub-feature branch is active.
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
12. Start the next task only after documentation is updated.

Documentation is the last part of the task slice, not an afterthought outside the slice.

## Builder Post-Build Security Rule

After the system is built, Builder must complete this sequence before post-build Diogenes, Bacon, Hoare, and Epictetus reviews:

1. Perform a security review of the implemented system.
2. Produce a needed security patch list in sensible order.
3. Apply one security patch at a time in the correct branch and Git worktree checkout folder.
4. Treat the patch as one task slice inside that worktree.
5. Run the mapped Bacon validation.
6. Check the mapped Hoare correctness obligations.
7. Check the mapped Epictetus operational obligations.
8. Confirm Diogenes' cuts were not reintroduced.
9. Run targeted security tests.
10. Run affected regression tests.
11. Update patch documentation.
12. Move to the next patch only after documentation is updated.
13. Emit `security_patches_complete` only after every required patch is patched, validated, checked, tested, and documented.

Patch order is based on exploitability, blast radius, privilege impact, data exposure risk, dependency order, testability, and operational risk.

## Artifact Rule

Formal handoff artifacts are TOML.

Markdown is for linked long-form prose.

The state machine consumes TOML, not Markdown.

## Package Verification

Run the package verifier before treating a package change as done:

```powershell
python tools\verify_packages.py
```

The verifier checks required files, YAML front matter, TOML templates, Python state-machine happy paths, AnythingLLM handler syntax when Node.js is available, and Builder workflow drift markers.

## Repository Layout

```text
codex-desktop/        canonical Codex Desktop package
claude-code/          canonical Claude Code package
anythingllm/          canonical AnythingLLM package
tools/                package verification and maintenance tools
```

## Maintenance Rule

The three runtime packages are intentionally self-contained. When changing behavior, update all runtime packages or run `tools/verify_packages.py` and fix drift before considering the work complete.
