# The Design Philosophers and the Builder

A bounded Mealy-style software-design workflow for designing software from scratch without agent drift, user drift, silent scope expansion, lump-build implementation, missing Feature Branch Workflow, or loose security patching.

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
10. Builder 1986 creates matching branches and folders for the Feature Branch Workflow.
11. Builder 1986 slices, costs, orders, implements, verifies, and then documents each slice.
12. Builder 1986 performs a post-build security review.
13. Builder 1986 creates a needed security patch list in sensible order.
14. Builder 1986 patches one patch at a time, and each patch must pass Bacon validation, Hoare correctness, Epictetus operational checks, Diogenes cut checks, testing, and documentation before the next patch starts.
15. Diogenes cuts excess after security patching.
16. Bacon verifies empirical evidence.
17. Hoare verifies correctness.
18. Epictetus verifies resilience.
19. The parent admits only if the state machine held.

## Builder Feature Branch Workflow

Builder must not start implementation until the Feature Branch Workflow exists.

Builder must:

1. Create or initialize the GitHub repository.
2. Identify every feature.
3. Recursively identify and list sub-features for each feature.
4. Create a branch for each feature.
5. Create a sub-branch for each sub-feature.
6. Create a folder for each feature.
7. Create a sub-folder for each sub-feature.
8. Use the folders and branches to create the Feature Branch Workflow.
9. Use the correct Feature Branch Workflow when working on the project.

Branch pattern:

```text
feature/<feature-slug>
feature/<feature-slug>/<sub-feature-slug>
feature/<feature-slug>/<sub-feature-slug>/<nested-sub-feature-slug>
```

Folder pattern:

```text
features/<feature-slug>/
features/<feature-slug>/<sub-feature-slug>/
features/<feature-slug>/<sub-feature-slug>/<nested-sub-feature-slug>/
```

Builder must not code directly on `main`, skip branches, skip folders, or flatten the recursive feature tree for convenience.

## Builder Slice Rule

Builder must not build the whole design as a lump.

Each slice must be completed in this order:

1. Confirm the correct feature or sub-feature branch is active.
2. Confirm the matching feature or sub-feature folder exists.
3. Implement the approved slice.
4. Run the mapped Bacon validation.
5. Check the mapped Hoare correctness obligations.
6. Check the mapped Epictetus operational obligations.
7. Confirm Diogenes' cuts were not reintroduced.
8. Update documentation for the completed slice.
9. Emit `implementation_complete` only after documentation is updated.

Documentation is the last part of the slice, not an afterthought outside the slice.

## Builder Post-Build Security Rule

After the system is built, Builder must complete this sequence before post-build Diogenes, Bacon, Hoare, and Epictetus reviews:

1. Perform a security review of the implemented system.
2. Produce a needed security patch list in sensible order.
3. Apply one security patch at a time.
4. Run the mapped Bacon validation.
5. Check the mapped Hoare correctness obligations.
6. Check the mapped Epictetus operational obligations.
7. Confirm Diogenes' cuts were not reintroduced.
8. Run targeted security tests.
9. Run affected regression tests.
10. Update patch documentation.
11. Move to the next patch only after documentation is updated.
12. Emit `security_patches_complete` only after every required patch is patched, validated, checked, tested, and documented.

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
