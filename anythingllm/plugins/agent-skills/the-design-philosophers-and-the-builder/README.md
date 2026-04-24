# The Design Philosophers and the Builder — AnythingLLM Agent Skill

## Purpose

This AnythingLLM custom agent skill exposes the Design Philosophers workflow as a callable tool.

Use it when designing software from scratch, controlling scope drift, routing user changes, producing TOML handoffs, or enforcing smallest-safe-slice implementation.

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

The state machine is embedded directly in `handler.js`.

## Install

Copy the whole folder into your AnythingLLM custom agent skills directory:

`anythingllm/plugins/agent-skills/the-design-philosophers-and-the-builder`

Then enable the skill in AnythingLLM's agent skill settings.

## Operations

The handler supports these operations:

- `describe`
- `available_events`
- `dispatch`
- `happy_path`
- `handoff_template`
- `routing_guidance`
- `builder_constraint`

## Examples

Start workflow:

```json
{
  "operation": "dispatch",
  "state": "S0_INTAKE",
  "event": "new_request"
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

A slice is done only when it satisfies mapped validation, correctness, and operational obligations.
