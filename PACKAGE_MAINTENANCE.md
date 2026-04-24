# Package Maintenance

The repository has three canonical runtime packages:

```text
codex-desktop/the-design-philosophers-and-the-builder/
claude-code/the-design-philosophers-and-the-builder/
anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder/
```

These are the installable packages. They must be self-contained.

## Required Package Contents

Codex Desktop and Claude Code packages must contain:

```text
README.md
SKILL.md
agents/README.md
agents/socrates.md
agents/plato.md
agents/aristotle.md
agents/bacon.md
agents/hoare.md
agents/epictetus.md
agents/diogenes.md
agents/builder-1986.md
scripts/state_machine.py
templates/handoff.toml
```

AnythingLLM must contain:

```text
plugin.json
handler.js
README.md
agents/README.md
agents/socrates.md
agents/plato.md
agents/aristotle.md
agents/bacon.md
agents/hoare.md
agents/epictetus.md
agents/diogenes.md
agents/builder-1986.md
templates/handoff.toml
```

The AnythingLLM state machine is embedded in `handler.js`.

## Builder Slice Documentation Rule

Builder 1986 must document each completed slice as the final step of the slice.

Slice completion order:

1. Implement the approved slice.
2. Run mapped Bacon validation.
3. Check mapped Hoare correctness obligations.
4. Check mapped Epictetus operational obligations.
5. Confirm Diogenes' cuts were not reintroduced.
6. Update documentation for the completed slice.
7. Emit `implementation_complete` only after documentation is updated.

## Verification

Before treating package work as complete, run:

```powershell
python tools\verify_packages.py
```

The verifier checks:

- required package files
- YAML front matter in Codex and Claude `SKILL.md`
- TOML handoff templates
- Python state-machine happy paths
- AnythingLLM `plugin.json`
- AnythingLLM `handler.js` load and basic dispatch when Node.js is available

## Drift Rule

The packages intentionally duplicate some files so each runtime can be copied independently.

That duplication is dangerous. When changing behavior, update all three packages and run the verifier.

Do not edit only one runtime package unless the change is truly runtime-specific.

## Legacy Paths

Older install-path-style folders may exist for compatibility during transition. The canonical source of installable package truth is the three runtime folders listed at the top of this file.
