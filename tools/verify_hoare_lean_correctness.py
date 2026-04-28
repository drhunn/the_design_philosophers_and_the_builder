from __future__ import annotations

import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CODEX = ROOT / "codex-desktop" / "the-design-philosophers-and-the-builder"
CLAUDE = ROOT / "claude-code" / "the-design-philosophers-and-the-builder"
ANYTHING = ROOT / "anythingllm" / "plugins" / "agent-skills" / "the-design-philosophers-and-the-builder"
PACKAGES = [CODEX, CLAUDE, ANYTHING]
PY_PACKAGES = [CODEX, CLAUDE]
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

PY_RUNTIME_MARKERS = [
    "postbuild_lean_correctness_checked",
    "_validate_postbuild_lean_correctness",
    "[correctness].lean_proof_required must explicitly be true or false",
    "[correctness].lean_proof_passed must be true when Lean proof is required",
    "[correctness] must classify at least one post-build correctness obligation",
]

ANYTHING_RUNTIME_MARKERS = [
    "postbuild_lean_correctness_checked",
    "validatePostbuildLeanCorrectness",
    "correctnessSectionTemplate",
    "S10_POST_BUILD_CORRECTNESS_REVIEW",
    "correctness_review_passed",
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


def check_python_runtime(errors: list[str], package: Path) -> None:
    path = package / "scripts" / "state_machine.py"
    for marker in PY_RUNTIME_MARKERS:
        require_marker(errors, path, marker)


def check_anything_runtime(errors: list[str]) -> None:
    path = ANYTHING / "handler-with-global.js"
    for marker in ANYTHING_RUNTIME_MARKERS:
        require_marker(errors, path, marker)


def check_lean_model(errors: list[str]) -> None:
    for marker in LEAN_MARKERS:
        require_marker(errors, LEAN_MODEL, marker)


def main() -> int:
    errors: list[str] = []
    for package in PACKAGES:
        check_hoare_agent(errors, package)
        check_handoff_template(errors, package)
    for package in PY_PACKAGES:
        check_python_runtime(errors, package)
    check_anything_runtime(errors)
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
