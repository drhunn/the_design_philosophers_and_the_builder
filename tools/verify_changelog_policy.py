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


def changelog_patch_against_base() -> str:
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    base_ref = os.environ.get("GITHUB_BASE_REF", "")
    if event_name == "pull_request" and base_ref:
        base = f"origin/{base_ref}"
        diff_base = run_git("merge-base", "HEAD", base)
        return run_git("diff", "--unified=0", f"{diff_base}...HEAD", "--", "CHANGELOG.md")
    return run_git("show", "--unified=0", "--format=", "HEAD", "--", "CHANGELOG.md")


def changelog_only_hash_maintenance() -> bool:
    changed = changed_files_against_base()
    if changed != ["CHANGELOG.md"]:
        return False

    patch = changelog_patch_against_base()
    removed_pending = False
    added_hash = False
    for line in patch.splitlines():
        if not line or line.startswith(("+++", "---", "@@", "diff ", "index ")):
            continue
        if line.startswith("-"):
            if "`PENDING`" in line:
                removed_pending = True
                continue
            return False
        if line.startswith("+"):
            if COMMIT_HASH_RE.search(line) and "`PENDING`" not in line:
                added_hash = True
                continue
            return False
    return removed_pending and added_hash


def main() -> int:
    if not CHANGELOG.is_file():
        print("CHANGELOG.md is missing")
        return 1

    text = CHANGELOG.read_text(encoding="utf-8")
    pending_count = len(PENDING_RE.findall(text))
    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    changed = changed_files_against_base()

    if event_name == "pull_request":
        if changed == ["CHANGELOG.md"]:
            if changelog_only_hash_maintenance():
                return 0
            if pending_count:
                print("Changelog-only PRs must replace `PENDING` with a 40-character hash; they must not introduce or retain `PENDING`.")
                return 1
        else:
            if "CHANGELOG.md" not in changed:
                print("Meaningful repository changes must update CHANGELOG.md.")
                print("Changed files:")
                for path in changed:
                    print(f"- {path}")
                return 1
            if not (COMMIT_HASH_RE.search(text) or pending_count):
                print("CHANGELOG.md must contain a commit/merge hash or a `PENDING` marker.")
                return 1

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        print(f"changelog policy verifier failed: {exc}")
        raise SystemExit(1)
