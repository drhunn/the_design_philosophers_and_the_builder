# Hermes Agent Package

Hermes is the standalone courier, dispatcher, translator, and boundary-guard package.

Use Hermes when a host system needs an agent-facing role that moves work between the parent/core runtime and specialist agents without taking over their judgment duties.

## Contents

```text
AGENT.md
LICENSE
README.md
```

## Role

Hermes owns routing and handoff transport.

Hermes does not own product definition, architecture, correctness proof, resilience judgment, austerity review, or implementation.

## Typical Host Integration

A host runtime may use Hermes to:

- validate handoff TOML
- load the next agent packet
- enforce slot permissions
- reject invalid transitions
- write audit summaries
- carry state-machine metadata between agents
