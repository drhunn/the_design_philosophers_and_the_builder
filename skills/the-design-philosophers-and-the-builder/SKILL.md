---
name: "the-design-philosophers-and-the-builder"
description: >-
  Windows 11 Codex Desktop skill for designing software from scratch with a
  bounded Mealy-style workflow using philosopher agents, Builder 1986, TOML
  handoffs, and an embedded Python state machine.
---

# The Design Philosophers and the Builder

## Windows 11 Codex Desktop Purpose

Use this skill in Codex Desktop on Windows 11 when a user wants to design software from scratch, turn a vague idea into a buildable system, prevent scope drift, or force implementation through smallest safe build slices.

This skill is a bounded Mealy-style control system. It keeps both the agent and the user honest.

The rule is simple:

Current state plus event determines next state plus action.

No silent expansion. No lump builds. No hidden handoffs. No agent drift. No user drift. No "while we are here."

## Windows 11 Installation

Install this skill into one of these Codex Desktop skill locations:

- User skill location: `%USERPROFILE%\.codex\skills\the-design-philosophers-and-the-builder\SKILL.md`
- Project-local skill location: `<repo>\.codex\skills\the-design-philosophers-and-the-builder\SKILL.md`

After installing or changing the skill, restart Codex Desktop so it reloads skills.

Recommended PowerShell install from this repository:

```powershell
$SkillName = "the-design-philosophers-and-the-builder"
$Source = ".\skills\the-design-philosophers-and-the-builder"
$Dest = Join-Path $env:USERPROFILE ".codex\skills\$SkillName"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Copy-Item -Path "$Source\*" -Destination $Dest -Recurse -Force
Write-Host "Installed $SkillName to $Dest"
Write-Host "Restart Codex Desktop to pick up the skill."
```

## Formal Artifact Rule

Formal state handoffs must be TOML.

Markdown is for linked long-form prose only.

The state machine consumes TOML, not Markdown.

Do not embed long reasoning in TOML. Link Markdown reports from TOML.

## State Owners

- S1 Problem Examination: Socrates
- S1A Scoped Ideal Model: Plato
- S2 Structural Design: Aristotle
- S3 Pre-Build Validation Architecture: Bacon
- S4 Pre-Build Correctness Specification: Hoare
- S4A Pre-Build Operational Resilience Specification: Epictetus
- S5 Pre-Build Austerity Review: Diogenes
- S6A Builder Slice Planning: Builder 1986
- S7 Implementation: Builder 1986
- S8 Post-Build Reduction Review: Diogenes
- S9 Post-Build Empirical Review: Bacon
- S10 Post-Build Correctness Review: Hoare
- S11 Post-Build Operational Resilience Review: Epictetus
- S12 Admission Decision: Parent

## Routing Rules

If a user request changes the real problem, route to Socrates.

If it changes ideal form, value, platform, deployment, integration, trust model, data ownership, scale, or v1 boundary, route to Plato.

If it changes structure, route to Aristotle.

If it changes evidence or validation, route to Bacon.

If it changes invariants or correctness, route to Hoare.

If it changes failure behavior or operational tolerance, route to Epictetus.

If it adds complexity without traceable value, route to Diogenes.

If it changes implementation inside an approved slice, route to Builder.

## Builder Constraint

Builder is not allowed to build the whole design as a lump.

Builder must slice it, cost it, order it, and implement incrementally.

A slice is not done because code exists. A slice is done only when it satisfies mapped validation, correctness, and operational obligations.

## Python State Machine Implementation

```python
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable, Dict, List, Optional, Tuple

State = str
Event = str
Action = str
Guard = Callable[[dict], None]


@dataclass(frozen=True)
class Transition:
    next_state: State
    actions: Tuple[Action, ...] = ()
    guard: Optional[Guard] = None


@dataclass(frozen=True)
class TransitionResult:
    from_state: State
    event: Event
    to_state: State
    actions: Tuple[Action, ...]
    timestamp: str


class MachineError(RuntimeError):
    pass


class GuardError(MachineError):
    pass


def require_flag(name: str) -> Guard:
    def guard(context: dict) -> None:
        if context.get(name) is not True:
            raise GuardError(f"required context flag not satisfied: {name}")
    return guard


S0 = "S0_INTAKE"
S1 = "S1_PROBLEM_EXAMINATION"
S1A = "S1A_SCOPED_IDEAL_MODEL"
S2 = "S2_STRUCTURAL_DESIGN"
S3 = "S3_PRE_BUILD_VALIDATION_ARCHITECTURE"
S4 = "S4_PRE_BUILD_CORRECTNESS_SPECIFICATION"
S4A = "S4A_PRE_BUILD_OPERATIONAL_RESILIENCE_SPECIFICATION"
S5 = "S5_PRE_BUILD_AUSTERITY_REVIEW"
S6 = "S6_BUILD_READY"
S6A = "S6A_BUILDER_SLICE_PLANNING"
S7 = "S7_IMPLEMENTATION"
S8 = "S8_POST_BUILD_REDUCTION_REVIEW"
S9 = "S9_POST_BUILD_EMPIRICAL_REVIEW"
S10 = "S10_POST_BUILD_CORRECTNESS_REVIEW"
S11 = "S11_POST_BUILD_OPERATIONAL_RESILIENCE_REVIEW"
S12 = "S12_ADMISSION_DECISION"
S13 = "S13_ACCEPTED"
S14 = "S14_REWORK"
S15 = "S15_EXPLORATORY"

NEW_REQUEST = "new_request"
REQUEST_IS_VAGUE = "request_is_vague"
PROBLEM_IS_CLEAR = "problem_is_clear"
PROTOTYPE_ONLY = "prototype_only"
IDEAL_MODEL_COMPLETE = "ideal_model_complete"
ARCHITECTURE_COMPLETE = "architecture_complete"
VALIDATION_OBLIGATIONS_KNOWN = "validation_obligations_known"
CORRECTNESS_OBLIGATIONS_KNOWN = "correctness_obligations_known"
OPERATIONAL_OBLIGATIONS_KNOWN = "operational_obligations_known"
AUSTERITY_REVIEW_COMPLETE = "austerity_review_complete"
BUILD_PACKAGE_COMPLETE = "build_package_complete"
BUILD_PACKAGE_INCOMPLETE = "build_package_incomplete"
SLICE_PLAN_COMPLETE = "slice_plan_complete"
SLICE_PLAN_FAILED = "slice_plan_failed"
IMPLEMENTATION_COMPLETE = "implementation_complete"
REDUCTION_REVIEW_COMPLETE = "reduction_review_complete"
EMPIRICAL_REVIEW_PASSED = "empirical_review_passed"
EMPIRICAL_REVIEW_FAILED = "empirical_review_failed"
CORRECTNESS_REVIEW_PASSED = "correctness_review_passed"
CORRECTNESS_REVIEW_FAILED = "correctness_review_failed"
OPERATIONS_REVIEW_PASSED = "operations_review_passed"
OPERATIONS_REVIEW_FAILED = "operations_review_failed"
ADMISSION_GRANTED = "admission_granted"
ADMISSION_DENIED = "admission_denied"
NEW_CONTRADICTION_FOUND = "new_contradiction_found"
DESIGN_GAP_FOUND = "design_gap_found"
VALIDATION_GAP_FOUND = "validation_gap_found"
CORRECTNESS_GAP_FOUND = "correctness_gap_found"
OPERATIONAL_GAP_FOUND = "operational_gap_found"
EXCESS_COMPLEXITY_FOUND = "excess_complexity_found"
PRODUCT_CONSTRAINT_MISSING = "product_constraint_missing"
FEATURE_INVENTORY_MISMATCH = "feature_inventory_mismatch"
VALIDATION_MAPPING_FAILED = "validation_mapping_failed"
CORRECTNESS_MAPPING_FAILED = "correctness_mapping_failed"
OPERATIONAL_MAPPING_FAILED = "operational_mapping_failed"
SLICE_FAILED = "slice_failed"

RUN_SOCRATES = "run_socrates"
RUN_PLATO = "run_plato"
RUN_ARISTOTLE = "run_aristotle"
RUN_BACON_PREBUILD = "run_bacon_prebuild"
RUN_HOARE_PREBUILD = "run_hoare_prebuild"
RUN_EPICTETUS_PREBUILD = "run_epictetus_prebuild"
RUN_DIOGENES_PREBUILD = "run_diogenes_prebuild"
CHECK_BUILD_PACKAGE = "check_build_package"
RUN_BUILDER_SLICE_PLANNING = "run_builder_slice_planning"
RUN_BUILDER_IMPLEMENTATION = "run_builder_implementation"
RUN_DIOGENES_POSTBUILD = "run_diogenes_postbuild"
RUN_BACON_POSTBUILD = "run_bacon_postbuild"
RUN_HOARE_POSTBUILD = "run_hoare_postbuild"
RUN_EPICTETUS_POSTBUILD = "run_epictetus_postbuild"
MAKE_ADMISSION_DECISION = "make_admission_decision"
ACCEPT_FEATURE = "accept_feature"
REQUIRE_POSTMORTEM = "require_postmortem"
ALLOW_PROTOTYPE = "allow_prototype"
MARK_EXPLORATORY_ONLY = "mark_exploratory_only"
RETURN_TO_SOCRATES = "return_to_socrates"
RETURN_TO_PLATO = "return_to_plato"
RETURN_TO_ARISTOTLE = "return_to_aristotle"
RETURN_TO_BACON_PREBUILD = "return_to_bacon_prebuild"
RETURN_TO_HOARE_PREBUILD = "return_to_hoare_prebuild"
RETURN_TO_EPICTETUS_PREBUILD = "return_to_epictetus_prebuild"
RETURN_TO_DIOGENES_PREBUILD = "return_to_diogenes_prebuild"
RETURN_TO_BUILDER = "return_to_builder"
RETURN_TO_SLICE_PLANNING = "return_to_slice_planning"


def default_table() -> Dict[State, Dict[Event, Transition]]:
    return {
        S0: {NEW_REQUEST: Transition(S1, (RUN_SOCRATES,))},
        S1: {
            REQUEST_IS_VAGUE: Transition(S1, (RUN_SOCRATES,)),
            PROBLEM_IS_CLEAR: Transition(S1A, (RUN_PLATO,)),
            PROTOTYPE_ONLY: Transition(S15, (ALLOW_PROTOTYPE, MARK_EXPLORATORY_ONLY)),
        },
        S1A: {
            IDEAL_MODEL_COMPLETE: Transition(S2, (RUN_ARISTOTLE,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
            EXCESS_COMPLEXITY_FOUND: Transition(S1A, (RUN_PLATO,)),
        },
        S2: {
            ARCHITECTURE_COMPLETE: Transition(S3, (RUN_BACON_PREBUILD,)),
            DESIGN_GAP_FOUND: Transition(S2, (RUN_ARISTOTLE,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RETURN_TO_PLATO,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
        },
        S3: {
            VALIDATION_OBLIGATIONS_KNOWN: Transition(S4, (RUN_HOARE_PREBUILD,)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RETURN_TO_PLATO,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
        },
        S4: {
            CORRECTNESS_OBLIGATIONS_KNOWN: Transition(S4A, (RUN_EPICTETUS_PREBUILD,)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE,)),
            VALIDATION_GAP_FOUND: Transition(S3, (RETURN_TO_BACON_PREBUILD,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RETURN_TO_PLATO,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
        },
        S4A: {
            OPERATIONAL_OBLIGATIONS_KNOWN: Transition(S5, (RUN_DIOGENES_PREBUILD,)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE,)),
            VALIDATION_GAP_FOUND: Transition(S3, (RETURN_TO_BACON_PREBUILD,)),
            CORRECTNESS_GAP_FOUND: Transition(S4, (RETURN_TO_HOARE_PREBUILD,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RETURN_TO_PLATO,)),
        },
        S5: {
            AUSTERITY_REVIEW_COMPLETE: Transition(S6, (CHECK_BUILD_PACKAGE,)),
            EXCESS_COMPLEXITY_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RETURN_TO_PLATO,)),
            OPERATIONAL_GAP_FOUND: Transition(S4A, (RETURN_TO_EPICTETUS_PREBUILD,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
        },
        S6: {
            BUILD_PACKAGE_COMPLETE: Transition(S6A, (RUN_BUILDER_SLICE_PLANNING,), require_flag("build_package_complete")),
            BUILD_PACKAGE_INCOMPLETE: Transition(S14, (REQUIRE_POSTMORTEM,)),
            PROTOTYPE_ONLY: Transition(S15, (ALLOW_PROTOTYPE, MARK_EXPLORATORY_ONLY)),
        },
        S6A: {
            SLICE_PLAN_COMPLETE: Transition(S7, (RUN_BUILDER_IMPLEMENTATION,), require_flag("slice_plan_complete")),
            SLICE_PLAN_FAILED: Transition(S14, (RETURN_TO_SLICE_PLANNING, REQUIRE_POSTMORTEM)),
            FEATURE_INVENTORY_MISMATCH: Transition(S1A, (RETURN_TO_PLATO, REQUIRE_POSTMORTEM)),
            VALIDATION_MAPPING_FAILED: Transition(S3, (RETURN_TO_BACON_PREBUILD, REQUIRE_POSTMORTEM)),
            CORRECTNESS_MAPPING_FAILED: Transition(S4, (RETURN_TO_HOARE_PREBUILD, REQUIRE_POSTMORTEM)),
            OPERATIONAL_MAPPING_FAILED: Transition(S4A, (RETURN_TO_EPICTETUS_PREBUILD, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE, REQUIRE_POSTMORTEM)),
        },
        S7: {
            IMPLEMENTATION_COMPLETE: Transition(S8, (RUN_DIOGENES_POSTBUILD,)),
            SLICE_FAILED: Transition(S14, (RETURN_TO_BUILDER, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE, REQUIRE_POSTMORTEM)),
            VALIDATION_GAP_FOUND: Transition(S3, (RETURN_TO_BACON_PREBUILD, REQUIRE_POSTMORTEM)),
            CORRECTNESS_GAP_FOUND: Transition(S4, (RETURN_TO_HOARE_PREBUILD, REQUIRE_POSTMORTEM)),
            OPERATIONAL_GAP_FOUND: Transition(S4A, (RETURN_TO_EPICTETUS_PREBUILD, REQUIRE_POSTMORTEM)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES, REQUIRE_POSTMORTEM)),
        },
        S8: {
            REDUCTION_REVIEW_COMPLETE: Transition(S9, (RUN_BACON_POSTBUILD,)),
            EXCESS_COMPLEXITY_FOUND: Transition(S14, (RETURN_TO_BUILDER, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE, REQUIRE_POSTMORTEM)),
        },
        S9: {
            EMPIRICAL_REVIEW_PASSED: Transition(S10, (RUN_HOARE_POSTBUILD,), require_flag("empirical_review_passed")),
            EMPIRICAL_REVIEW_FAILED: Transition(S14, (RETURN_TO_BUILDER, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S3, (RETURN_TO_BACON_PREBUILD, REQUIRE_POSTMORTEM)),
        },
        S10: {
            CORRECTNESS_REVIEW_PASSED: Transition(S11, (RUN_EPICTETUS_POSTBUILD,), require_flag("correctness_review_passed")),
            CORRECTNESS_REVIEW_FAILED: Transition(S14, (RETURN_TO_BUILDER, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S4, (RETURN_TO_HOARE_PREBUILD, REQUIRE_POSTMORTEM)),
        },
        S11: {
            OPERATIONS_REVIEW_PASSED: Transition(S12, (MAKE_ADMISSION_DECISION,), require_flag("operations_review_passed")),
            OPERATIONS_REVIEW_FAILED: Transition(S14, (RETURN_TO_BUILDER, REQUIRE_POSTMORTEM)),
            DESIGN_GAP_FOUND: Transition(S2, (RETURN_TO_ARISTOTLE, REQUIRE_POSTMORTEM)),
            VALIDATION_GAP_FOUND: Transition(S3, (RETURN_TO_BACON_PREBUILD, REQUIRE_POSTMORTEM)),
            CORRECTNESS_GAP_FOUND: Transition(S4, (RETURN_TO_HOARE_PREBUILD, REQUIRE_POSTMORTEM)),
        },
        S12: {
            ADMISSION_GRANTED: Transition(S13, (ACCEPT_FEATURE,), require_flag("admission_granted")),
            ADMISSION_DENIED: Transition(S14, (REQUIRE_POSTMORTEM,)),
        },
        S13: {},
        S14: {
            NEW_CONTRADICTION_FOUND: Transition(S1, (RUN_SOCRATES,)),
            PRODUCT_CONSTRAINT_MISSING: Transition(S1A, (RUN_PLATO,)),
            DESIGN_GAP_FOUND: Transition(S2, (RUN_ARISTOTLE,)),
            VALIDATION_GAP_FOUND: Transition(S3, (RUN_BACON_PREBUILD,)),
            CORRECTNESS_GAP_FOUND: Transition(S4, (RUN_HOARE_PREBUILD,)),
            OPERATIONAL_GAP_FOUND: Transition(S4A, (RUN_EPICTETUS_PREBUILD,)),
            EXCESS_COMPLEXITY_FOUND: Transition(S5, (RUN_DIOGENES_PREBUILD,)),
            SLICE_PLAN_FAILED: Transition(S6A, (RUN_BUILDER_SLICE_PLANNING,)),
            SLICE_FAILED: Transition(S7, (RUN_BUILDER_IMPLEMENTATION,)),
        },
        S15: {
            ARCHITECTURE_COMPLETE: Transition(S2, (RUN_ARISTOTLE,)),
            IMPLEMENTATION_COMPLETE: Transition(S8, (RUN_DIOGENES_POSTBUILD,)),
            NEW_CONTRADICTION_FOUND: Transition(S1, (RETURN_TO_SOCRATES,)),
        },
    }


@dataclass
class Machine:
    state: State = S0
    context: dict = field(default_factory=dict)
    table: Dict[State, Dict[Event, Transition]] = field(default_factory=default_table)
    history: List[TransitionResult] = field(default_factory=list)

    def available_events(self) -> List[Event]:
        return sorted(self.table.get(self.state, {}).keys())

    def can(self, event: Event) -> bool:
        return event in self.table.get(self.state, {})

    def dispatch(self, event: Event) -> TransitionResult:
        transitions = self.table.get(self.state)
        if transitions is None:
            raise MachineError(f"no transitions defined for state: {self.state}")
        transition = transitions.get(event)
        if transition is None:
            allowed = ", ".join(self.available_events()) or "<none>"
            raise MachineError(f"invalid event {event!r} in state {self.state!r}; allowed: {allowed}")
        if transition.guard is not None:
            transition.guard(self.context)
        result = TransitionResult(
            from_state=self.state,
            event=event,
            to_state=transition.next_state,
            actions=transition.actions,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self.state = transition.next_state
        self.history.append(result)
        return result


def happy_path() -> List[Event]:
    return [
        NEW_REQUEST,
        PROBLEM_IS_CLEAR,
        IDEAL_MODEL_COMPLETE,
        ARCHITECTURE_COMPLETE,
        VALIDATION_OBLIGATIONS_KNOWN,
        CORRECTNESS_OBLIGATIONS_KNOWN,
        OPERATIONAL_OBLIGATIONS_KNOWN,
        AUSTERITY_REVIEW_COMPLETE,
        BUILD_PACKAGE_COMPLETE,
        SLICE_PLAN_COMPLETE,
        IMPLEMENTATION_COMPLETE,
        REDUCTION_REVIEW_COMPLETE,
        EMPIRICAL_REVIEW_PASSED,
        CORRECTNESS_REVIEW_PASSED,
        OPERATIONS_REVIEW_PASSED,
        ADMISSION_GRANTED,
    ]


def default_happy_path_context() -> dict:
    return {
        "build_package_complete": True,
        "slice_plan_complete": True,
        "empirical_review_passed": True,
        "correctness_review_passed": True,
        "operations_review_passed": True,
        "admission_granted": True,
    }
```

## TOML Handoff Template

```toml
artifact_id = ""
state = ""
agent = ""
emitted_event = ""
next_state = ""

[bounded_input]
references = []
summary = ""

[scope_boundary]
summary = ""
allowed = []
forbidden = []

[findings]
summary = ""

[decisions]
summary = ""
items = []

[assumptions]
items = []

[unresolved_issues]
items = []
blocking = false

[markdown_links]
reports = []
rationale = []
postmortems = []
```

## Codex Desktop Behavior

When this skill triggers, Codex should:

1. Determine the current state.
2. Classify new user input against the current bounded artifact.
3. Emit only valid events for the current state.
4. Produce TOML handoffs for formal transitions.
5. Use linked Markdown for long reports.
6. Refuse silent scope expansion.
7. Enforce Builder slice planning before implementation.

## Use

Use this skill whenever designing software from scratch, changing scope, routing between design agents, checking whether a user request is drift, or deciding whether work may move forward.

The state machine is the routing authority.
