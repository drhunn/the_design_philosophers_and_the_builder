# The Design Philosophers and the Builder — AnythingLLM Agent Skill

## Purpose

This AnythingLLM custom agent skill exposes the Design Philosophers workflow as a callable tool.

Use it when designing software from scratch, controlling scope drift, routing user changes, producing TOML handoffs, validating proof-carrying transitions, requiring every handoff to explicitly decide whether the repository changed, requiring Plato to create a PRD Markdown file before Aristotle designs architecture, resolving state-machine actions to bundled agent files, loading the correct agent prompt with global rules prepended, or enforcing smallest-safe-slice implementation.

## Self-Contained Package

This folder is self-contained. It does not depend on repo-root files.

Required local files:

- `plugin.json`
- `handler.js`
- `handler-with-global.js`
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
- `templates/handoff.toml`
- `templates/prd.md`

The state machine and base fixed action dispatcher are embedded directly in `handler.js`. The plugin entrypoint is `handler-with-global.js`, which delegates to `handler.js` but overrides action loading so `agents/global.md` is prepended to every loaded agent prompt.

## Install

Copy the whole folder into your AnythingLLM custom agent skills directory:

`anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder`

Then enable the skill in AnythingLLM's agent skill settings.

## Operations

The handler supports these operations:

- `describe`
- `available_events`
- `dispatch`
- `dispatch_and_load`
- `resolve_actions`
- `load_actions`
- `happy_path`
- `handoff_template`
- `validate_handoff`
- `routing_guidance`
- `builder_constraint`

## Global Agent Preamble

`agents/global.md` applies to every loaded agent prompt.

The wrapper entrypoint prepends `agents/global.md` to agent content returned by `load_actions` and `dispatch_and_load`.

The global preamble requires every handoff to explicitly set `[changelog].repo_changed` to `true` or `false`. Pure analysis that does not touch the repository may set `repo_changed = false`. Any repository-changing step must update `CHANGELOG.md` and include changelog evidence or mark the hash pending.

## Plato PRD Markdown Output

Plato must create or update a PRD Markdown file before emitting `ideal_model_complete`.

Normal PRD path:

```text
docs/product/prd.md
```

Package-local PRD template:

```text
templates/prd.md
```

The PRD path must be linked from the TOML handoff:

```toml
[markdown_links]
prd = ["docs/product/prd.md"]
```

## Action Dispatcher Loader

The state machine emits action names such as `run_socrates`, `run_hoare_prebuild`, and `run_builder_task_slice_planning`.

The dispatcher maps those fixed action names to bundled agent Markdown files and prepends `agents/global.md`:

- `run_socrates` -> `agents/global.md` + `agents/socrates.md`
- `run_plato` -> `agents/global.md` + `agents/plato.md`
- `run_aristotle` -> `agents/global.md` + `agents/aristotle.md`
- `run_bacon_prebuild` -> `agents/global.md` + `agents/bacon.md`
- `run_hoare_prebuild` -> `agents/global.md` + `agents/hoare.md`
- `run_epictetus_prebuild` -> `agents/global.md` + `agents/epictetus.md`
- `run_diogenes_prebuild` -> `agents/global.md` + `agents/diogenes.md`
- `run_builder_task_slice_planning` -> `agents/global.md` + `agents/builder-1986.md`

Controller actions such as `check_build_package`, `make_admission_decision`, `accept_feature`, and `require_postmortem` do not load agent files.

The loader uses a fixed action-to-file map. It does not accept arbitrary file paths from user input.

## Examples

Start workflow and load the next agent prompt:

```json
{
  "operation": "dispatch_and_load",
  "state": "S0_INTAKE",
  "event": "new_request"
}
```

Resolve an action without loading content:

```json
{
  "operation": "resolve_actions",
  "action": "run_socrates"
}
```

Load an agent prompt directly from an action:

```json
{
  "operation": "load_actions",
  "action": "run_builder_task_slice_planning"
}
```

List allowed events:

```json
{
  "operation": "available_events",
  "state": "S1A_SCOPED_IDEAL_MODEL"
}
```

Dispatch guarded transition:

```json
{
  "operation": "dispatch",
  "state": "S6_BUILD_READY",
  "event": "build_package_complete",
  "context_json": "{\"build_package_complete\":true}"
}
```

Validate a proof-carrying TOML handoff:

```json
{
  "operation": "validate_handoff",
  "guard": "task_documentation_updated",
  "artifact_toml": "..."
}
```

Get formal TOML handoff template:

```json
{
  "operation": "handoff_template"
}
```

## Formal Artifact Rule

Formal handoff artifacts are TOML.

Markdown is for linked long-form prose.

The state machine consumes TOML, not Markdown.

Every handoff must include `[changelog]` and explicitly set `repo_changed` to `true` or `false`.

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must slice it, cost it, order it, and implement incrementally.

A slice is done only when it satisfies mapped validation, correctness, operational obligations, documentation requirements, and the changelog decision rule.
