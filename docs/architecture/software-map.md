# Software Map

This map shows how the repository's runtime packages, agent prompts, handoff artifacts, verifiers, workflows, and proof models fit together.

The software map is an Aristotle-owned architecture artifact. Plato defines the PRD-level product shape; Aristotle turns that into structure and updates this map before architecture is treated as complete.

## System Context

```mermaid
flowchart TD
    User[User]
    Repo[Repository]
    RuntimePackages[Runtime Packages]
    CI[GitHub Actions CI]
    Proofs[Lean Proofs]

    User --> Repo
    Repo --> RuntimePackages
    Repo --> CI
    CI --> Proofs
```

## Philosopher Stack

```mermaid
flowchart TD
    Socrates[Socrates: clarify the real problem]
    Plato[Plato: define the ideal product / PRD]
    Aristotle[Aristotle: design structure and software map]
    Bacon[Bacon: demand evidence]
    Hoare[Hoare: demand correctness]
    Epictetus[Epictetus: demand resilience]
    Diogenes[Diogenes: remove excess]
    Builder[Builder: implement carefully]

    Socrates --> Plato
    Plato --> Aristotle
    Aristotle --> Bacon
    Bacon --> Hoare
    Hoare --> Epictetus
    Epictetus --> Diogenes
    Diogenes --> Builder
```

## Runtime Package Map

```mermaid
flowchart TD
    Global[agents/global.md]

    Codex[Codex Desktop Package]
    Claude[Claude Code Package]
    Anything[AnyThingLLM Package]

    Codex --> CodexSkill[SKILL.md]
    Codex --> CodexSM[scripts/state_machine.py]
    Codex --> CodexDispatcher[scripts/dispatcher.py]
    Codex --> CodexAgents[agents/*.md]
    Codex --> CodexTemplates[templates/*.md / *.toml]

    Claude --> ClaudeSkill[SKILL.md]
    Claude --> ClaudeSM[scripts/state_machine.py]
    Claude --> ClaudeDispatcher[scripts/dispatcher.py]
    Claude --> ClaudeAgents[agents/*.md]
    Claude --> ClaudeTemplates[templates/*.md / *.toml]

    Anything --> Plugin[plugin.json]
    Anything --> Handler[handler.js]
    Anything --> Wrapper[handler-with-global.js]
    Anything --> AnythingAgents[agents/*.md]
    Anything --> AnythingTemplates[templates/*.md / *.toml]

    CodexDispatcher --> Global
    ClaudeDispatcher --> Global
    Wrapper --> Global
    Global --> CodexAgents
    Global --> ClaudeAgents
    Global --> AnythingAgents
```

## Artifact Map

```mermaid
flowchart TD
    PRD[docs/product/prd.md]
    SoftwareMap[docs/architecture/software-map.md]
    Handoff[templates/handoff.toml]
    Changelog[CHANGELOG.md]
    Lean[proofs/lean/TheDesignPhilosophers/StateMachine.lean]

    PRD --> SoftwareMap
    SoftwareMap --> Handoff
    Handoff --> Changelog
    Handoff --> Lean
```

## Verification Map

```mermaid
flowchart TD
    VerifyWorkflow[.github/workflows/verify.yml]
    LeanWorkflow[.github/workflows/lean.yml]

    VerifyWorkflow --> ChangelogVerifier[tools/verify_changelog_policy.py]
    VerifyWorkflow --> PackageVerifier[tools/verify_packages.py]
    PackageVerifier --> PythonRuntime[Python runtime checks]
    PackageVerifier --> AnythingRuntime[AnyThingLLM handler checks]
    PackageVerifier --> Docs[README / template marker checks]
    LeanWorkflow --> LeanProofs[Lean proof build]
```

## Ownership Rules

- Socrates owns problem clarity.
- Plato owns the PRD-level Markdown artifact.
- Aristotle owns this software map and the architecture structure it describes.
- Bacon owns evidence and validation obligations for the map.
- Hoare owns correctness and contract consistency for the map.
- Epictetus owns operational failure and recovery concerns in the map.
- Diogenes owns reduction of unnecessary boxes, arrows, abstractions, and fake components.
- Builder implements only after the map survives the pre-build review stack.

## Maintenance Rules

- Update this file when runtime package boundaries, handoff artifact structure, verifier flow, workflow structure, or proof-model integration changes.
- Do not add speculative boxes. Every box should correspond to a real file, package, artifact, or verified workflow concern.
- Prefer Mermaid source in this Markdown file over checked-in generated images.
- If rendered images are needed, place them under `docs/architecture/assets/`.
