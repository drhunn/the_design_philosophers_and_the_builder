from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHANGELOG = ROOT / "CHANGELOG.md"
COMMIT_HASH_RE = re.compile(r"`[0-9a-f]{40}`")
PENDING_RE = re.compile(r"`PENDING`")
POLICY_BOOTSTRAP_FILES = {
    "README.md",
    "tools/verify_changelog_policy.py",
}


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or f"git {' '.join(args)} failed")
    return result.stdout.strip()


def changed_files_against_base() -> list[str]:
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    base_ref = os.environ.get("GITHUB_BASE_REF", "")

    if event_name == "pull_request" and base_ref:
        try:
            run_git("fetch", "--no-tags", "--prune", "--depth=1", "origin", base_ref)
        except RuntimeError:
            pass
        base = f"origin/{base_ref}"
        diff_base = run_git("merge-base", "HEAD", base)
        output = run_git("diff", "--name-only", f"{diff_base}...HEAD")
    else:
        output = run_git("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")

    return [line for line in output.splitlines() if line]


def entry_text(text: str) -> str:
    lines = []
    for line in text.splitlines():
        if line.startswith("|") and not line.startswith("|---"):
            lines.append(line)
    return "\n".join(lines)


def main() -> int:
    if not CHANGELOG.is_file():
        print("CHANGELOG.md is missing")
        return 1

    text = CHANGELOG.read_text(encoding="utf-8")
    entries = entry_text(text)
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    changed = changed_files_against_base()

    if event_name == "pull_request":
        changed_set = set(changed)

        if changed == ["CHANGELOG.md"]:
            return 0

        if changed_set and changed_set.issubset(POLICY_BOOTSTRAP_FILES):
            return 0

        if "CHANGELOG.md" not in changed:
            print("Meaningful repository changes must update CHANGELOG.md.")
            print("Changed files:")
            for path in changed:
                print(f"- {path}")
            return 1

        if PENDING_RE.search(entries):
            print("CHANGELOG.md contains a `PENDING` changelog entry. Use a known 40-character commit hash before merge.")
            return 1

        if not COMMIT_HASH_RE.search(entries):
            print("CHANGELOG.md must contain at least one known 40-character commit hash in its entries.")
            return 1

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"changelog policy verifier failed: {exc}")
        raise SystemExit(1)
