# The Design Philosophers and the Builder — AnythingLLM Agent Skill

## Purpose

This AnythingLLM custom agent skill exposes the Design Philosophers workflow as a callable tool.

Use it when designing software from scratch, controlling scope drift, routing user changes, producing TOML handoffs, validating proof-carrying transitions, requiring Plato to create a PRD Markdown file before Aristotle designs architecture, resolving state-machine actions to bundled agent files, loading the correct agent prompt, or enforcing smallest-safe-slice implementation.

## Self-Contained Package

This folder is self-contained. It does not depend on repo-root files.

Required local files:

- `plugin.json`
- `handler.js`
- `README.md`
- `agents/README.md`
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

The state machine and fixed action dispatcher are embedded directly in `handler.js`.

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

The dispatcher maps those fixed action names to bundled agent Markdown files:

- `run_socrates` -> `agents/socrates.md`
- `run_plato` -> `agents/plato.md`
- `run_aristotle` -> `agents/aristotle.md`
- `run_bacon_prebuild` -> `agents/bacon.md`
- `run_hoare_prebuild` -> `agents/hoare.md`
- `run_epictetus_prebuild` -> `agents/epictetus.md`
- `run_diogenes_prebuild` -> `agents/diogenes.md`
- `run_builder_task_slice_planning` -> `agents/builder-1986.md`

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

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must slice it, cost it, order it, and implement incrementally.

A slice is done only when it satisfies mapped validation, correctness, operational obligations, and documentation requirements.
