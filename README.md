# The Design Philosophers and the Builder

A bounded Mealy-style software-design workflow for designing software from scratch without agent drift, user drift, silent scope expansion, or lump-build implementation.

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
8. Builder 1986 slices, costs, orders, implements, verifies, and then documents each slice.
9. Builder 1986 performs a post-build security review.
10. Builder 1986 creates a needed security patch list in sensible order.
11. Builder 1986 patches, tests, and documents each security patch before moving to the next patch.
12. Diogenes cuts excess after security patching.
13. Bacon verifies empirical evidence.
14. Hoare verifies correctness.
15. Epictetus verifies resilience.
16. The parent admits only if the state machine held.

## Builder Slice Rule

Builder must not build the whole design as a lump.

Each slice must be completed in this order:

1. Implement the approved slice.
2. Run the mapped Bacon validation.
3. Check the mapped Hoare correctness obligations.
4. Check the mapped Epictetus operational obligations.
5. Confirm Diogenes' cuts were not reintroduced.
6. Update documentation for the completed slice.
7. Emit `implementation_complete` only after documentation is updated.

Documentation is the last part of the slice, not an afterthought outside the slice.

## Builder Post-Build Security Rule

After the system is built, Builder must complete this sequence before post-build Diogenes, Bacon, Hoare, and Epictetus reviews:

1. Perform a security review of the implemented system.
2. Produce a needed security patch list in sensible order.
3. Apply one security patch at a time.
4. Test the patch.
5. Run affected regression checks.
6. Update patch documentation.
7. Move to the next patch only after documentation is updated.
8. Emit `security_patches_complete` only after every required patch is patched, tested, and documented.

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

The verifier checks required files, YAML front matter, TOML templates, Python state-machine happy paths, and AnythingLLM handler syntax when Node.js is available.

## Repository Layout

```text
codex-desktop/        canonical Codex Desktop package
claude-code/          canonical Claude Code package
anythingllm/          canonical AnythingLLM package
tools/                package verification and maintenance tools
agents/               repo-level reference agent definitions
scripts/              repo-level reference scripts
templates/            repo-level reference templates
```

## Maintenance Rule

The three runtime packages are intentionally self-contained. When changing behavior, update all runtime packages or run `tools/verify_packages.py` and fix drift before considering the work complete.
