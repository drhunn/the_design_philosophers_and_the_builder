from __future__ import annotations

import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKAGES = [
    ROOT / "codex-desktop" / "the-design-philosophers-and-the-builder",
    ROOT / "claude-code" / "the-design-philosophers-and-the-builder",
    ROOT / "anythingllm" / "plugins" / "agent-skills" / "the-design-philosophers-and-the-builder",
]
LEAN_MODEL = ROOT / "proofs" / "lean" / "TheDesignPhilosophers" / "StateMachine.lean"

HOARE_MARKERS = [
    "Post-build Hoare must prove correctness in Lean",
    "Lean proofs are required for formally modelable",
    "Lean-proved",
    "runtime-test-checked",
    "manual or non-formal review only",
    "Lean proof paths",
]

CORRECTNESS_FIELDS = [
    "lean_proof_required",
    "lean_proof_updated",
    "lean_proof_paths",
    "lean_proof_commands",
    "lean_proof_passed",
    "lean_proved_obligations",
    "runtime_test_checked_obligations",
    "non_formal_obligations",
    "non_formal_reason",
]

LEAN_MARKERS = [
    "happyPath_reaches_accepted",
    "accepted_is_terminal",
    "ideal_model_complete_implies_prd_markdown",
    "architecture_complete_implies_software_map",
]


def require_marker(errors: list[str], path: Path, marker: str) -> None:
    if not path.is_file():
        errors.append(f"missing file: {path.relative_to(ROOT)}")
        return
    text = path.read_text(encoding="utf-8")
    if marker not in text:
        errors.append(f"{path.relative_to(ROOT)} missing marker: {marker}")


def check_hoare_agent(errors: list[str], package: Path) -> None:
    path = package / "agents" / "hoare.md"
    for marker in HOARE_MARKERS:
        require_marker(errors, path, marker)


def check_handoff_template(errors: list[str], package: Path) -> None:
    path = package / "templates" / "handoff.toml"
    if not path.is_file():
        errors.append(f"missing file: {path.relative_to(ROOT)}")
        return
    try:
        parsed = tomllib.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"invalid TOML {path.relative_to(ROOT)}: {exc}")
        return
    correctness = parsed.get("correctness")
    if not isinstance(correctness, dict):
        errors.append(f"{path.relative_to(ROOT)} missing [correctness] section")
        return
    for field in CORRECTNESS_FIELDS:
        if field not in correctness:
            errors.append(f"{path.relative_to(ROOT)} missing [correctness].{field}")


def check_lean_model(errors: list[str]) -> None:
    for marker in LEAN_MARKERS:
        require_marker(errors, LEAN_MODEL, marker)


def main() -> int:
    errors: list[str] = []
    for package in PACKAGES:
        check_hoare_agent(errors, package)
        check_handoff_template(errors, package)
    check_lean_model(errors)
    if errors:
        print("Hoare Lean correctness verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Hoare Lean correctness checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
