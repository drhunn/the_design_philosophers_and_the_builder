from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
AGENTS_DIR = PACKAGE_ROOT / "agents"

ACTION_AGENT_FILES: dict[str, str] = {
    "run_socrates": "socrates.md",
    "return_to_socrates": "socrates.md",
    "run_plato": "plato.md",
    "return_to_plato": "plato.md",
    "run_aristotle": "aristotle.md",
    "return_to_aristotle": "aristotle.md",
    "run_bacon_prebuild": "bacon.md",
    "run_bacon_postbuild": "bacon.md",
    "return_to_bacon_prebuild": "bacon.md",
    "run_hoare_prebuild": "hoare.md",
    "run_hoare_postbuild": "hoare.md",
    "return_to_hoare_prebuild": "hoare.md",
    "run_epictetus_prebuild": "epictetus.md",
    "run_epictetus_postbuild": "epictetus.md",
    "return_to_epictetus_prebuild": "epictetus.md",
    "run_diogenes_prebuild": "diogenes.md",
    "run_diogenes_postbuild": "diogenes.md",
    "run_builder_feature_worktree_workflow": "builder-1986.md",
    "repair_feature_worktree_workflow": "builder-1986.md",
    "run_builder_task_slice_planning": "builder-1986.md",
    "return_to_task_slice_planning": "builder-1986.md",
    "run_builder_task_slice_implementation": "builder-1986.md",
    "return_to_builder_task_slice": "builder-1986.md",
    "run_builder_security_review": "builder-1986.md",
    "return_to_builder_security_review": "builder-1986.md",
    "run_patch_planning": "builder-1986.md",
    "return_to_patch_planning": "builder-1986.md",
    "run_patch_task_planning": "builder-1986.md",
    "return_to_patch_task_planning": "builder-1986.md",
    "run_patch_task_implementation": "builder-1986.md",
    "return_to_patch_task_implementation": "builder-1986.md",
    "return_to_builder": "builder-1986.md",
}

CONTROLLER_ACTIONS: set[str] = {
    "allow_prototype",
    "mark_exploratory_only",
    "check_build_package",
    "make_admission_decision",
    "accept_feature",
    "require_postmortem",
}


@dataclass(frozen=True)
class ResolvedAction:
    action: str
    kind: str
    agent_file: str | None
    relative_path: str | None
    path: Path | None
    exists: bool

    def to_dict(self) -> dict[str, object]:
        return {
            "action": self.action,
            "kind": self.kind,
            "agent_file": self.agent_file,
            "relative_path": self.relative_path,
            "path": str(self.path) if self.path is not None else None,
            "exists": self.exists,
        }


def _agent_path(agent_file: str, package_root: Path) -> Path:
    return package_root / "agents" / agent_file


def resolve_action(action: str, package_root: Path = PACKAGE_ROOT) -> ResolvedAction:
    if action in ACTION_AGENT_FILES:
        agent_file = ACTION_AGENT_FILES[action]
        relative_path = f"agents/{agent_file}"
        path = _agent_path(agent_file, package_root)
        return ResolvedAction(action, "agent", agent_file, relative_path, path, path.is_file())
    if action in CONTROLLER_ACTIONS:
        return ResolvedAction(action, "controller", None, None, None, True)
    raise KeyError(f"unknown state-machine action: {action}")


def resolve_actions(actions: list[str], package_root: Path = PACKAGE_ROOT) -> list[ResolvedAction]:
    return [resolve_action(action, package_root) for action in actions]


def load_action(action: str, package_root: Path = PACKAGE_ROOT) -> dict[str, object]:
    resolved = resolve_action(action, package_root)
    data = resolved.to_dict()
    if resolved.kind == "controller":
        data["content"] = None
        return data
    if resolved.path is None or not resolved.path.is_file():
        raise FileNotFoundError(f"agent file not found for action {action}: {resolved.relative_path}")
    data["content"] = resolved.path.read_text(encoding="utf-8")
    return data


def load_actions(actions: list[str], package_root: Path = PACKAGE_ROOT) -> list[dict[str, object]]:
    return [load_action(action, package_root) for action in actions]


def dispatch_and_load(machine, event: str) -> tuple[object, list[dict[str, object]]]:
    result = machine.dispatch(event)
    return result, load_actions(result.actions)


if __name__ == "__main__":
    for item in load_actions(["run_socrates", "run_builder_task_slice_planning", "check_build_package"]):
        print({key: value for key, value in item.items() if key != "content"})
