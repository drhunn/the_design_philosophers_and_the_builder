from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT_ROOT = ROOT / "agent-packages"
PACKAGES = [
    "hermes",
    "socrates",
    "plato",
    "aristotle",
    "bacon",
    "hoare",
    "epictetus",
    "diogenes",
    "builder-1986",
]
REQUIRED_FILES = ["README.md", "AGENT.md", "LICENSE"]
LICENSE_MARKERS = ["MIT License", "Copyright (c) 2026 Danny Hunn", "THE SOFTWARE IS PROVIDED \"AS IS\""]
ROLE_MARKERS = {
    "hermes": ["Courier and Boundary Guard", "validate TOML handoffs", "reject invalid transitions"],
    "socrates": ["Problem Examination", "bounded problem", "problem_is_clear"],
    "plato": ["Scoped Ideal Model", "PRD", "ideal_model_complete"],
    "aristotle": ["Structural Design", "software-map", "architecture_complete"],
    "bacon": ["Empirical Validation", "evidence", "empirical_review_passed"],
    "hoare": ["Correctness", "Lean", "correctness_review_passed"],
    "epictetus": ["Operational Resilience", "fail", "operations_review_passed"],
    "diogenes": ["Austerity Review", "excess", "reduction_review_complete"],
    "builder-1986": ["Implementation", "task slice", "patch"],
}


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def require_file(errors: list[str], path: Path) -> None:
    if not path.is_file():
        errors.append(f"missing file: {rel(path)}")


def require_markers(errors: list[str], path: Path, markers: list[str]) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            errors.append(f"{rel(path)} missing marker: {marker}")


def main() -> int:
    errors: list[str] = []
    require_markers(errors, AGENT_ROOT / "README.md", ["Standalone Agent Packages", "agent-packages/hermes/", "agent-packages/builder-1986/"])
    for package in PACKAGES:
        package_dir = AGENT_ROOT / package
        if not package_dir.is_dir():
            errors.append(f"missing directory: {rel(package_dir)}")
            continue
        for filename in REQUIRED_FILES:
            require_file(errors, package_dir / filename)
        require_markers(errors, package_dir / "LICENSE", LICENSE_MARKERS)
        require_markers(errors, package_dir / "README.md", ["#", "Contents", "AGENT.md", "LICENSE"])
        require_markers(errors, package_dir / "AGENT.md", ROLE_MARKERS[package] + ["## Role", "## Authority", "## Output"])
    if errors:
        print("Standalone agent package verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Standalone agent package checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
