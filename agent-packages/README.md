# Standalone Agent Packages

This directory contains one self-contained package per agent role.

These packages are for systems such as OpenClaw that want to install, route, or permission agents independently instead of copying a full runtime package.

Each package contains:

```text
README.md
AGENT.md
LICENSE
```

## Packages

```text
agent-packages/hermes/
agent-packages/socrates/
agent-packages/plato/
agent-packages/aristotle/
agent-packages/bacon/
agent-packages/hoare/
agent-packages/epictetus/
agent-packages/diogenes/
agent-packages/builder-1986/
```

## Boundary

Standalone agent packages do not replace the runtime packages.

Runtime packages still own:

- state-machine execution
- dispatcher behavior
- handoff validation
- runtime-specific install shape
- CI verifier wiring

Standalone agent packages only package the role contract for one agent at a time.

## Hermes

Hermes is the courier, dispatcher, translator, and handoff guard. Hermes is intentionally separate from the philosopher judgment chain.

Hermes should route work, validate handoffs, enforce slot permissions, package context, and reject invalid transitions. Hermes should not design architecture, define product goals, prove correctness, or implement source changes.
