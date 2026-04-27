# AGENTS.md

Use this repository's philosopher-stack state-machine workflow.

## Read First

Before planning or editing, read:

- `README.md`
- `docs/architecture/software-map.md`
- `CHANGELOG.md`

## Workflow

```text
Socrates  -> clarify the real problem
Plato     -> define the ideal product / PRD
Aristotle -> design the structure and software map
Bacon     -> demand evidence
Hoare     -> demand correctness
Epictetus -> demand resilience
Diogenes  -> remove excess
Builder   -> implement carefully
```

## Hard Rules

- Do not code directly on `main`.
- Do not batch unrelated changes.
- Do not skip RTFM.
- Do not invent APIs, files, commands, configs, or behavior.
- Inspect existing files before changing them.
- Plato owns `docs/product/prd.md`.
- Aristotle owns `docs/architecture/software-map.md`.
- Meaningful repository changes must update `CHANGELOG.md`.
- Changelog-only bookkeeping does not require a recursive changelog entry.
- Run the narrowest relevant checks, then broader checks when practical.

## Validation Commands

```bash
python tools/verify_changelog_policy.py
python tools/verify_packages.py
(cd proofs/lean && lake build)
```

If a command is unavailable, report that plainly. Do not claim it passed.
