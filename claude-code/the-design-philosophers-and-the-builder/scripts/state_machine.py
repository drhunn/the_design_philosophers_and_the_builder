from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

S0 = "S0_INTAKE"
S1 = "S1_PROBLEM_EXAMINATION"
S1A = "S1A_SCOPED_IDEAL_MODEL"
S2 = "S2_STRUCTURAL_DESIGN"
S3 = "S3_PRE_BUILD_VALIDATION_ARCHITECTURE"
S4 = "S4_PRE_BUILD_CORRECTNESS_SPECIFICATION"
S4A = "S4A_PRE_BUILD_OPERATIONAL_RESILIENCE_SPECIFICATION"
S5 = "S5_PRE_BUILD_AUSTERITY_REVIEW"
S6 = "S6_BUILD_READY"
S6B = "S6B_BUILDER_FEATURE_WORKTREE_WORKFLOW"
S6C = "S6C_BUILDER_TASK_SLICE_PLANNING"
S7 = "S7_TASK_SLICE_IMPLEMENTATION"
S7A = "S7A_BUILDER_SECURITY_REVIEW"
S7B = "S7B_PATCH_PLANNING"
S7C = "S7C_PATCH_TASK_PLANNING"
S7D = "S7D_PATCH_TASK_IMPLEMENTATION"
S8 = "S8_POST_BUILD_REDUCTION_REVIEW"
S9 = "S9_POST_BUILD_EMPIRICAL_REVIEW"
S10 = "S10_POST_BUILD_CORRECTNESS_REVIEW"
S11 = "S11_POST_BUILD_OPERATIONAL_RESILIENCE_REVIEW"
S12 = "S12_ADMISSION_DECISION"
S13 = "S13_ACCEPTED"
S14 = "S14_REWORK"
S15 = "S15_EXPLORATORY"

TABLE = {
    S0: {"new_request": (S1, ["run_socrates"], None)},
    S1: {
        "request_is_vague": (S1, ["run_socrates"], None),
        "problem_is_clear": (S1A, ["run_plato"], None),
        "prototype_only": (S15, ["allow_prototype", "mark_exploratory_only"], None),
    },
    S1A: {
        "ideal_model_complete": (S2, ["run_aristotle"], None),
        "new_contradiction_found": (S1, ["return_to_socrates"], None),
    },
    S2: {
        "architecture_complete": (S3, ["run_bacon_prebuild"], None),
        "design_gap_found": (S2, ["run_aristotle"], None),
        "product_constraint_missing": (S1A, ["return_to_plato"], None),
    },
    S3: {
        "validation_obligations_known": (S4, ["run_hoare_prebuild"], None),
        "design_gap_found": (S2, ["return_to_aristotle"], None),
        "product_constraint_missing": (S1A, ["return_to_plato"], None),
    },
    S4: {
        "correctness_obligations_known": (S4A, ["run_epictetus_prebuild"], None),
        "design_gap_found": (S2, ["return_to_aristotle"], None),
        "validation_gap_found": (S3, ["return_to_bacon_prebuild"], None),
    },
    S4A: {
        "operational_obligations_known": (S5, ["run_diogenes_prebuild"], None),
        "design_gap_found": (S2, ["return_to_aristotle"], None),
        "validation_gap_found": (S3, ["return_to_bacon_prebuild"], None),
        "correctness_gap_found": (S4, ["return_to_hoare_prebuild"], None),
        "product_constraint_missing": (S1A, ["return_to_plato"], None),
    },
    S5: {
        "austerity_review_complete": (S6, ["check_build_package"], None),
        "excess_complexity_found": (S2, ["return_to_aristotle"], None),
        "operational_gap_found": (S4A, ["return_to_epictetus_prebuild"], None),
    },
    S6: {
        "build_package_complete": (S6B, ["run_builder_feature_worktree_workflow"], "build_package_complete"),
        "build_package_incomplete": (S14, ["require_postmortem"], None),
    },
    S6B: {
        "feature_worktree_workflow_complete": (S6C, ["run_builder_task_slice_planning"], "feature_worktree_workflow_complete"),
        "feature_worktree_workflow_failed": (S14, ["return_to_builder_feature_worktree_workflow", "require_postmortem"], None),
        "feature_inventory_mismatch": (S1A, ["return_to_plato", "require_postmortem"], None),
        "branch_worktree_mismatch": (S6B, ["repair_feature_worktree_workflow", "require_postmortem"], None),
        "validation_mapping_failed": (S3, ["return_to_bacon_prebuild", "require_postmortem"], None),
        "correctness_mapping_failed": (S4, ["return_to_hoare_prebuild", "require_postmortem"], None),
        "operational_mapping_failed": (S4A, ["return_to_epictetus_prebuild", "require_postmortem"], None),
    },
    S6C: {
        "task_slice_plan_complete": (S7, ["run_builder_task_slice_implementation"], "task_slice_plan_complete"),
        "task_slice_plan_failed": (S14, ["return_to_task_slice_planning", "require_postmortem"], None),
        "no_remaining_task_slices": (S7A, ["run_builder_security_review"], "no_remaining_task_slices"),
        "branch_worktree_mismatch": (S6B, ["repair_feature_worktree_workflow", "require_postmortem"], None),
        "validation_mapping_failed": (S3, ["return_to_bacon_prebuild", "require_postmortem"], None),
        "correctness_mapping_failed": (S4, ["return_to_hoare_prebuild", "require_postmortem"], None),
        "operational_mapping_failed": (S4A, ["return_to_epictetus_prebuild", "require_postmortem"], None),
    },
    S7: {
        "task_slice_complete": (S6C, ["run_builder_task_slice_planning"], "task_documentation_updated"),
        "all_task_slices_complete": (S7A, ["run_builder_security_review"], "all_task_slices_complete"),
        "task_slice_failed": (S14, ["return_to_builder_task_slice", "require_postmortem"], None),
        "design_gap_found": (S2, ["return_to_aristotle", "require_postmortem"], None),
        "validation_gap_found": (S3, ["return_to_bacon_prebuild", "require_postmortem"], None),
        "correctness_gap_found": (S4, ["return_to_hoare_prebuild", "require_postmortem"], None),
        "operational_gap_found": (S4A, ["return_to_epictetus_prebuild", "require_postmortem"], None),
        "branch_worktree_mismatch": (S6B, ["repair_feature_worktree_workflow", "require_postmortem"], None),
    },
    S7A: {
        "security_review_complete": (S7B, ["run_patch_planning"], None),
        "security_review_failed": (S14, ["return_to_builder_security_review", "require_postmortem"], None),
        "design_gap_found": (S2, ["return_to_aristotle", "require_postmortem"], None),
    },
    S7B: {
        "patch_plan_complete": (S7C, ["run_patch_task_planning"], None),
        "patch_plan_failed": (S14, ["return_to_patch_planning", "require_postmortem"], None),
    },
    S7C: {
        "patch_task_plan_complete": (S7D, ["run_patch_task_implementation"], "patch_task_plan_complete"),
        "patch_task_plan_failed": (S14, ["return_to_patch_task_planning", "require_postmortem"], None),
        "no_remaining_patch_tasks": (S8, ["run_diogenes_postbuild"], "no_remaining_patch_tasks"),
        "branch_worktree_mismatch": (S6B, ["repair_feature_worktree_workflow", "require_postmortem"], None),
    },
    S7D: {
        "patch_task_complete": (S7C, ["run_patch_task_planning"], "patch_task_documentation_updated"),
        "all_patch_tasks_complete": (S8, ["run_diogenes_postbuild"], "all_patch_tasks_complete"),
        "patch_task_failed": (S14, ["return_to_patch_task_implementation", "require_postmortem"], None),
        "validation_gap_found": (S3, ["return_to_bacon_prebuild", "require_postmortem"], None),
        "correctness_gap_found": (S4, ["return_to_hoare_prebuild", "require_postmortem"], None),
        "operational_gap_found": (S4A, ["return_to_epictetus_prebuild", "require_postmortem"], None),
        "branch_worktree_mismatch": (S6B, ["repair_feature_worktree_workflow", "require_postmortem"], None),
    },
    S8: {
        "reduction_review_complete": (S9, ["run_bacon_postbuild"], None),
        "excess_complexity_found": (S14, ["return_to_builder", "require_postmortem"], None),
    },
    S9: {
        "empirical_review_passed": (S10, ["run_hoare_postbuild"], "empirical_review_passed"),
        "empirical_review_failed": (S14, ["return_to_builder", "require_postmortem"], None),
    },
    S10: {
        "correctness_review_passed": (S11, ["run_epictetus_postbuild"], "correctness_review_passed"),
        "correctness_review_failed": (S14, ["return_to_builder", "require_postmortem"], None),
    },
    S11: {
        "operations_review_passed": (S12, ["make_admission_decision"], "operations_review_passed"),
        "operations_review_failed": (S14, ["return_to_builder", "require_postmortem"], None),
    },
    S12: {
        "admission_granted": (S13, ["accept_feature"], "admission_granted"),
        "admission_denied": (S14, ["require_postmortem"], None),
    },
    S13: {},
    S14: {
        "new_contradiction_found": (S1, ["run_socrates"], None),
        "product_constraint_missing": (S1A, ["run_plato"], None),
        "design_gap_found": (S2, ["run_aristotle"], None),
        "validation_gap_found": (S3, ["run_bacon_prebuild"], None),
        "correctness_gap_found": (S4, ["run_hoare_prebuild"], None),
        "operational_gap_found": (S4A, ["run_epictetus_prebuild"], None),
        "excess_complexity_found": (S5, ["run_diogenes_prebuild"], None),
        "feature_worktree_workflow_failed": (S6B, ["run_builder_feature_worktree_workflow"], None),
        "task_slice_plan_failed": (S6C, ["run_builder_task_slice_planning"], None),
        "task_slice_failed": (S7, ["run_builder_task_slice_implementation"], None),
        "security_review_failed": (S7A, ["run_builder_security_review"], None),
        "patch_plan_failed": (S7B, ["run_patch_planning"], None),
        "patch_task_plan_failed": (S7C, ["run_patch_task_planning"], None),
        "patch_task_failed": (S7D, ["run_patch_task_implementation"], None),
    },
    S15: {"new_contradiction_found": (S1, ["return_to_socrates"], None)},
}

PROOF_GUARDS = {
    "feature_worktree_workflow_complete",
    "task_slice_plan_complete",
    "task_documentation_updated",
    "all_task_slices_complete",
    "no_remaining_task_slices",
    "patch_task_plan_complete",
    "patch_task_documentation_updated",
    "all_patch_tasks_complete",
    "no_remaining_patch_tasks",
}

REQUIRED_SECTIONS = ["git", "task", "patch", "validation", "documentation", "remaining_work"]


def _present(value: Any) -> bool:
    return value is not None and value != "" and value != []


def _section(handoff: dict[str, Any], name: str) -> dict[str, Any]:
    value = handoff.get(name)
    return value if isinstance(value, dict) else {}


def _subset(touched: list[str], allowed: list[str]) -> bool:
    if not touched:
        return True
    return bool(allowed) and set(touched).issubset(set(allowed))


def parse_handoff_toml(text: str) -> dict[str, Any]:
    return tomllib.loads(text)


def validate_handoff_for_guard(handoff: dict[str, Any], guard: str) -> list[str]:
    errors: list[str] = []
    for section_name in REQUIRED_SECTIONS:
        if not isinstance(handoff.get(section_name), dict):
            errors.append(f"missing [{section_name}] section")

    git = _section(handoff, "git")
    task = _section(handoff, "task")
    patch = _section(handoff, "patch")
    validation = _section(handoff, "validation")
    docs = _section(handoff, "documentation")
    remaining = _section(handoff, "remaining_work")

    if guard in {"feature_worktree_workflow_complete", "task_slice_plan_complete", "task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices", "patch_task_plan_complete", "patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"}:
        for key in ["active_branch", "worktree_path", "merge_target"]:
            if not _present(git.get(key)):
                errors.append(f"[git].{key} is required")
        if git.get("branch_is_collision_free") is not True:
            errors.append("[git].branch_is_collision_free must be true")
        if git.get("worktree_is_flat_sibling") is not True:
            errors.append("[git].worktree_is_flat_sibling must be true")
        if git.get("worktree_verified") is not True:
            errors.append("[git].worktree_verified must be true")

    if guard in {"task_slice_plan_complete", "task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices"}:
        for key in ["task_id", "feature_slug", "task_slug", "purpose"]:
            if not _present(task.get(key)):
                errors.append(f"[task].{key} is required")
        if not _subset(task.get("touched_files", []), task.get("allowed_files", [])):
            errors.append("[task].touched_files must be a subset of [task].allowed_files")

    if guard in {"task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices", "patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"}:
        for key in ["bacon_passed", "hoare_passed", "epictetus_passed", "diogenes_passed", "tests_passed"]:
            if validation.get(key) is not True:
                errors.append(f"[validation].{key} must be true")

    if guard in {"task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices"}:
        if docs.get("task_documentation_updated") is not True:
            errors.append("[documentation].task_documentation_updated must be true")
        if not _present(docs.get("task_documentation_path")):
            errors.append("[documentation].task_documentation_path is required")

    if guard in {"all_task_slices_complete", "no_remaining_task_slices"}:
        if remaining.get("no_remaining_task_slices") is not True:
            errors.append("[remaining_work].no_remaining_task_slices must be true")
        if remaining.get("remaining_task_slices", []) != []:
            errors.append("[remaining_work].remaining_task_slices must be empty")

    if guard in {"patch_task_plan_complete", "patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"}:
        for key in ["patch_task_id", "patch_id", "kind", "risk_or_defect", "affected_branch", "affected_worktree_path", "merge_target"]:
            if not _present(patch.get(key)):
                errors.append(f"[patch].{key} is required")
        if not _present(patch.get("merge_path")):
            errors.append("[patch].merge_path is required")
        if not _subset(patch.get("touched_files", []), patch.get("allowed_files", [])):
            errors.append("[patch].touched_files must be a subset of [patch].allowed_files")

    if guard in {"patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"}:
        if docs.get("patch_documentation_updated") is not True:
            errors.append("[documentation].patch_documentation_updated must be true")
        if not _present(docs.get("patch_documentation_path")):
            errors.append("[documentation].patch_documentation_path is required")

    if guard in {"all_patch_tasks_complete", "no_remaining_patch_tasks"}:
        if remaining.get("no_remaining_patch_tasks") is not True:
            errors.append("[remaining_work].no_remaining_patch_tasks must be true")
        if remaining.get("remaining_patch_tasks", []) != []:
            errors.append("[remaining_work].remaining_patch_tasks must be empty")

    return errors


def valid_handoff() -> dict[str, Any]:
    return {
        "git": {
            "active_branch": "task/state-machine--transition-table--guard-checks--reject-invalid-transition",
            "branch_is_collision_free": True,
            "worktree_path": "../worktrees/repo/task--state-machine--transition-table--guard-checks--reject-invalid-transition",
            "worktree_is_flat_sibling": True,
            "worktree_verified": True,
            "merge_target": "subfeature/state-machine--transition-table--guard-checks",
            "merge_path": ["task/state-machine--transition-table--guard-checks--reject-invalid-transition", "subfeature/state-machine--transition-table--guard-checks", "feature/state-machine", "main"],
        },
        "task": {
            "task_id": "T001",
            "feature_slug": "state-machine",
            "subfeature_path_slug": "transition-table--guard-checks",
            "task_slug": "reject-invalid-transition",
            "purpose": "Reject invalid transitions and require proof fields.",
            "status": "complete",
            "touched_files": ["scripts/state_machine.py"],
            "allowed_files": ["scripts/state_machine.py"],
            "expected_behavior": "Invalid transitions and missing proof are rejected.",
        },
        "patch": {
            "patch_task_id": "P001",
            "patch_id": "P001",
            "kind": "security",
            "risk_or_defect": "Missing proof validation.",
            "affected_branch": "task/state-machine--transition-table--guard-checks--reject-invalid-transition",
            "affected_worktree_path": "../worktrees/repo/patch--state-machine--transition-table--guard-checks--P001",
            "merge_target": "task/state-machine--transition-table--guard-checks--reject-invalid-transition",
            "merge_path": ["patch/state-machine--transition-table--guard-checks--P001", "task/state-machine--transition-table--guard-checks--reject-invalid-transition"],
            "allowed_files": ["scripts/state_machine.py"],
            "touched_files": ["scripts/state_machine.py"],
            "status": "complete",
        },
        "validation": {
            "bacon_checks": ["happy path", "negative guard checks"],
            "bacon_passed": True,
            "hoare_obligations": ["invalid transitions rejected"],
            "hoare_passed": True,
            "epictetus_obligations": ["bad artifacts fail closed"],
            "epictetus_passed": True,
            "diogenes_cut_check": "No extra workflow bypass added.",
            "diogenes_passed": True,
            "targeted_tests": ["task_slice_complete without docs fails"],
            "regression_tests": ["happy path"],
            "tests_passed": True,
        },
        "documentation": {
            "task_documentation_path": "docs/tasks/T001.md",
            "task_documentation_updated": True,
            "patch_documentation_path": "docs/patches/P001.md",
            "patch_documentation_updated": True,
            "postmortem_paths": [],
        },
        "remaining_work": {
            "remaining_task_slices": [],
            "remaining_patch_tasks": [],
            "no_remaining_task_slices": True,
            "no_remaining_patch_tasks": True,
        },
    }


@dataclass
class Result:
    from_state: str
    event: str
    to_state: str
    actions: list[str]
    timestamp: str


@dataclass
class Machine:
    state: str = S0
    context: dict = field(default_factory=dict)
    history: list[Result] = field(default_factory=list)

    def available_events(self):
        return sorted(TABLE.get(self.state, {}).keys())

    def _handoff(self) -> dict[str, Any] | None:
        if isinstance(self.context.get("handoff"), dict):
            return self.context["handoff"]
        if isinstance(self.context.get("handoff_toml"), str):
            return parse_handoff_toml(self.context["handoff_toml"])
        return None

    def _guard_satisfied(self, guard: str) -> bool:
        if guard in PROOF_GUARDS:
            handoff = self._handoff()
            if handoff is None:
                raise ValueError(f"required proof handoff missing for guard: {guard}")
            errors = validate_handoff_for_guard(handoff, guard)
            if errors:
                raise ValueError(f"handoff validation failed for guard {guard}: " + "; ".join(errors))
            return True
        return self.context.get(guard) is True

    def dispatch(self, event: str):
        if event not in TABLE.get(self.state, {}):
            raise ValueError(f"invalid event {event!r} in state {self.state!r}; allowed: {self.available_events()}")
        next_state, actions, guard = TABLE[self.state][event]
        if guard and not self._guard_satisfied(guard):
            raise ValueError(f"required context flag not satisfied: {guard}")
        result = Result(self.state, event, next_state, actions, datetime.now(timezone.utc).isoformat())
        self.state = next_state
        self.history.append(result)
        return result


def happy_path():
    return [
        "new_request",
        "problem_is_clear",
        "ideal_model_complete",
        "architecture_complete",
        "validation_obligations_known",
        "correctness_obligations_known",
        "operational_obligations_known",
        "austerity_review_complete",
        "build_package_complete",
        "feature_worktree_workflow_complete",
        "task_slice_plan_complete",
        "task_slice_complete",
        "task_slice_plan_complete",
        "all_task_slices_complete",
        "security_review_complete",
        "patch_plan_complete",
        "patch_task_plan_complete",
        "patch_task_complete",
        "patch_task_plan_complete",
        "all_patch_tasks_complete",
        "reduction_review_complete",
        "empirical_review_passed",
        "correctness_review_passed",
        "operations_review_passed",
        "admission_granted",
    ]


def happy_context():
    return {
        "build_package_complete": True,
        "handoff": valid_handoff(),
        "empirical_review_passed": True,
        "correctness_review_passed": True,
        "operations_review_passed": True,
        "admission_granted": True,
    }


if __name__ == "__main__":
    m = Machine(context=happy_context())
    for e in happy_path():
        r = m.dispatch(e)
        print(f"{r.from_state} --{r.event}--> {r.to_state}: {', '.join(r.actions)}")
