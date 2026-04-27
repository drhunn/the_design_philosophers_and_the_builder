from __future__ import annotations

import os
import stat
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "linux" / "codex-cli"
ROOT_AGENTS = ROOT / "AGENTS.md"

REQUIRED_FILES = [
    DIST / "AGENTS.md",
    DIST / "README.md",
    DIST / "install.sh",
    DIST / "LICENSE",
    ROOT_AGENTS,
]

AGENTS_MARKERS = [
    "philosopher-stack state-machine workflow",
    "README.md",
    "docs/architecture/software-map.md",
    "CHANGELOG.md",
    "Socrates  -> clarify the real problem",
    "Aristotle owns `docs/architecture/software-map.md`",
    "python tools/verify_packages.py",
]

README_MARKERS = [
    "Linux Codex CLI Distribution",
    "Codex CLI discovers project instructions from `AGENTS.md`",
    "./install.sh --project /path/to/project",
    "./install.sh --global",
    "~/.codex/AGENTS.md",
]

LICENSE_MARKERS = [
    "MIT License",
    "Copyright (c) 2026 Danny Hunn",
    "THE SOFTWARE IS PROVIDED \"AS IS\"",
]

INSTALL_MARKERS = [
    "set -euo pipefail",
    "--project",
    "--global",
    "--force",
    "install -m 0644",
]


def require_file(errors: list[str], path: Path) -> None:
    if not path.is_file():
        errors.append(f"missing file: {path.relative_to(ROOT)}")


def require_markers(errors: list[str], path: Path, markers: list[str]) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            errors.append(f"{path.relative_to(ROOT)} missing marker: {marker}")


def require_same_agents(errors: list[str]) -> None:
    if not ROOT_AGENTS.is_file() or not (DIST / "AGENTS.md").is_file():
        return
    if ROOT_AGENTS.read_text(encoding="utf-8") != (DIST / "AGENTS.md").read_text(encoding="utf-8"):
        errors.append("root AGENTS.md and linux/codex-cli/AGENTS.md must match")


def exercise_installer(errors: list[str]) -> None:
    installer = DIST / "install.sh"
    if not installer.is_file():
        return
    with tempfile.TemporaryDirectory() as tmp:
        target = Path(tmp) / "project"
        result = subprocess.run(
            ["bash", str(installer), "--project", str(target)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            errors.append("linux/codex-cli/install.sh --project failed: " + (result.stderr.strip() or result.stdout.strip()))
            return
        installed = target / "AGENTS.md"
        if not installed.is_file():
            errors.append("linux/codex-cli/install.sh did not install project AGENTS.md")
            return
        if installed.read_text(encoding="utf-8") != (DIST / "AGENTS.md").read_text(encoding="utf-8"):
            errors.append("installed project AGENTS.md differs from distribution AGENTS.md")

        refused = subprocess.run(
            ["bash", str(installer), "--project", str(target)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        if refused.returncode == 0:
            errors.append("linux/codex-cli/install.sh overwrote existing AGENTS.md without --force")

        forced = subprocess.run(
            ["bash", str(installer), "--project", str(target), "--force"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        if forced.returncode != 0:
            errors.append("linux/codex-cli/install.sh --force failed: " + (forced.stderr.strip() or forced.stdout.strip()))


def main() -> int:
    errors: list[str] = []
    for path in REQUIRED_FILES:
        require_file(errors, path)
    require_markers(errors, ROOT_AGENTS, AGENTS_MARKERS)
    require_markers(errors, DIST / "AGENTS.md", AGENTS_MARKERS)
    require_markers(errors, DIST / "README.md", README_MARKERS)
    require_markers(errors, DIST / "LICENSE", LICENSE_MARKERS)
    require_markers(errors, DIST / "install.sh", INSTALL_MARKERS)
    require_same_agents(errors)
    exercise_installer(errors)

    if errors:
        print("Linux Codex CLI distribution verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Linux Codex CLI distribution checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
