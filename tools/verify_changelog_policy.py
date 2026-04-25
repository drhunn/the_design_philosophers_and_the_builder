from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHANGELOG = ROOT / "CHANGELOG.md"
COMMIT_HASH_RE = re.compile(r"`[0-9a-f]{40}`")
PENDING_RE = re.compile(r"`PENDING`")


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
            # The checkout workflow uses fetch-depth: 0. If this targeted fetch
            # fails but origin/<base> already exists locally, continue.
            pass
        base = f"origin/{base_ref}"
        diff_base = run_git("merge-base", "HEAD", base)
        output = run_git("diff", "--name-only", f"{diff_base}...HEAD")
    else:
        output = run_git("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")

    return [line for line in output.splitlines() if line]


def main() -> int:
    if not CHANGELOG.is_file():
        print("CHANGELOG.md is missing")
        return 1

    text = CHANGELOG.read_text(encoding="utf-8")
    pending_count = len(PENDING_RE.findall(text))
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    changed = changed_files_against_base()

    if pending_count:
        print("CHANGELOG.md contains `PENDING`. Use a known 40-character commit hash before merge.")
        return 1

    if event_name == "pull_request":
        if changed == ["CHANGELOG.md"]:
            # Changelog-only edits are bookkeeping. They do not need their own
            # changelog entry and do not need to reference their own PR, merge,
            # or commit hash.
            return 0

        if "CHANGELOG.md" not in changed:
            print("Meaningful repository changes must update CHANGELOG.md.")
            print("Changed files:")
            for path in changed:
                print(f"- {path}")
            return 1

        if not COMMIT_HASH_RE.search(text):
            print("CHANGELOG.md must contain at least one known 40-character commit hash.")
            return 1

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"changelog policy verifier failed: {exc}")
        raise SystemExit(1)
