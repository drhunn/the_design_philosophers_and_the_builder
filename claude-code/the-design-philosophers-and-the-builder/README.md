# Claude Code Package — The Design Philosophers and the Builder

This folder is the self-contained Claude Code package for the Design Philosophers workflow.

Copy this entire folder to:

`%USERPROFILE%\.claude\skills\the-design-philosophers-and-the-builder\`

or into a project-local Claude skill path:

`<repo>\.claude\skills\the-design-philosophers-and-the-builder\`

Do not install only `SKILL.md`. Install the whole folder so local agents, templates, scripts, dispatcher, and license travel together.

## Contents

- `SKILL.md`
- `LICENSE`
- `README.md`
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

## Dispatcher Loader

The state machine emits fixed action names such as `run_socrates`, `run_hoare_prebuild`, and `run_builder_task_slice_planning`.

`scripts/dispatcher.py` maps those fixed action names to bundled agent Markdown files and prepends `agents/global.md` to every loaded agent prompt.

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

## Formal Handoff Artifacts

Formal handoff artifacts are TOML.

Use `templates/handoff.toml` for proof-carrying handoff structure. Every handoff must explicitly set `[changelog].repo_changed` to `true` or `false`.

Plato must create or update a PRD Markdown file before emitting `ideal_model_complete`; link that file from `[markdown_links].prd`. Use `templates/prd.md` as the package-local PRD template.
