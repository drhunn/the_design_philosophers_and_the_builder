from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CODEX = ROOT / "codex-desktop" / "the-design-philosophers-and-the-builder"
CLAUDE = ROOT / "claude-code" / "the-design-philosophers-and-the-builder"
ANYTHING = ROOT / "anythingllm" / "plugins" / "agent-skills" / "the-design-philosophers-and-the-builder"

AGENT_FILES = [
    "README.md",
    "socrates.md",
    "plato.md",
    "aristotle.md",
    "bacon.md",
    "hoare.md",
    "epictetus.md",
    "diogenes.md",
    "builder-1986.md",
]

BUILDER_REQUIRED_MARKERS = [
    "Feature Branch Workflow",
    "recursively identify and list the sub-features",
    "create or initialize the GitHub repository",
    "Git cannot safely hold both `feature/foo` and `feature/foo/bar` as branches",
    "subfeature/<feature-slug>--<sub-feature-path-slug>",
    "task/<feature-slug>--<sub-feature-path-slug>--<task-slug>",
    "patch/<feature-slug>--<sub-feature-path-slug>--<patch-id>",
    "Do not nest Git worktrees inside other Git worktrees",
    "../worktrees/<repo-slug>/feature--<feature-slug>/",
    "../worktrees/<repo-slug>/subfeature--<feature-slug>--<sub-feature-path-slug>/",
    "Run the mapped Bacon validation",
    "Check the mapped Hoare correctness obligations",
    "Check the mapped Epictetus operational obligations",
    "Confirm Diogenes' cuts were not reintroduced",
    "Builder must not batch patches",
    "Emit `task_slice_complete` only after documentation is updated",
    "Emit `patch_task_complete` only after documentation is updated",
]

STATE_MACHINE_MARKERS = [
    "S6B_BUILDER_FEATURE_WORKTREE_WORKFLOW",
    "S6C_BUILDER_TASK_SLICE_PLANNING",
    "S7_TASK_SLICE_IMPLEMENTATION",
    "S7B_PATCH_PLANNING",
    "S7C_PATCH_TASK_PLANNING",
    "S7D_PATCH_TASK_IMPLEMENTATION",
    "task_slice_complete",
    "task_documentation_updated",
    "patch_plan_complete",
    "patch_task_complete",
    "patch_task_documentation_updated",
]

PY_HAPPY_PATH_SNIPPET = """
import importlib.util
from pathlib import Path
p = Path(r'{path}')
spec = importlib.util.spec_from_file_location('state_machine_under_test', p)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
m = mod.Machine(context=mod.happy_context())
visited = []
for event in mod.happy_path():
    visited.append(event)
    m.dispatch(event)
assert m.state == mod.S13, m.state
for required in ['task_slice_complete', 'patch_task_complete', 'patch_plan_complete']:
    assert required in visited, f'missing loop event: {required}'
print('ok')
"""

NODE_HANDLER_SNIPPET = """
const plugin = require(process.argv[2]);
(async () => {
  const runtime = plugin.runtime;
  if (!runtime || typeof runtime.handler !== 'function') throw new Error('runtime.handler missing');
  const describe = await runtime.handler.call({}, {operation: 'describe'});
  JSON.parse(describe);
  const dispatch = await runtime.handler.call({}, {operation: 'dispatch', state: 'S0_INTAKE', event: 'new_request'});
  const parsed = JSON.parse(dispatch);
  if (!parsed.ok || parsed.to_state !== 'S1_PROBLEM_EXAMINATION') throw new Error('bad dispatch result');
  const builder = await runtime.handler.call({}, {operation: 'builder_constraint'});
  const parsedBuilder = JSON.parse(builder);
  const serialized = JSON.stringify(parsedBuilder);
  for (const marker of ['Feature Branch Workflow', 'mapped Bacon validation', 'mapped Hoare correctness', 'mapped Epictetus operational', 'Diogenes cuts', 'subfeature/<feature-slug>--<sub-feature-path-slug>', 'do not nest Git worktrees', 'never batch patches']) {
    if (!serialized.includes(marker)) throw new Error(`builder constraint missing marker: ${marker}`);
  }
  const happy = JSON.parse(await runtime.handler.call({}, {operation: 'happy_path'}));
  for (const event of ['task_slice_complete', 'patch_task_complete', 'patch_plan_complete']) {
    if (!happy.events.includes(event)) throw new Error(`happy path missing event: ${event}`);
  }
  console.log('ok');
})();
"""


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def require_file(errors: list[str], path: Path) -> None:
    if not path.is_file():
        fail(errors, f"missing file: {path.relative_to(ROOT)}")


def require_dir(errors: list[str], path: Path) -> None:
    if not path.is_dir():
        fail(errors, f"missing directory: {path.relative_to(ROOT)}")


def check_contains(errors: list[str], path: Path, markers: list[str]) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            fail(errors, f"{path.relative_to(ROOT)} missing marker: {marker}")


def check_front_matter(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        fail(errors, f"missing YAML front matter: {path.relative_to(ROOT)}")
        return
    end = text.find("\n---", 4)
    if end < 0:
        fail(errors, f"unterminated YAML front matter: {path.relative_to(ROOT)}")
        return
    front = text[4:end]
    if not re.search(r"^name:\s*\"?the-design-philosophers-and-the-builder\"?\s*$", front, re.M):
        fail(errors, f"front matter missing valid name: {path.relative_to(ROOT)}")
    if not re.search(r"^description:\s*", front, re.M):
        fail(errors, f"front matter missing description: {path.relative_to(ROOT)}")


def check_toml(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    try:
        tomllib.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(errors, f"invalid TOML {path.relative_to(ROOT)}: {exc}")


def check_python_machine(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    check_contains(errors, path, STATE_MACHINE_MARKERS)
    script = PY_HAPPY_PATH_SNIPPET.format(path=str(path))
    result = subprocess.run([sys.executable, "-c", script], cwd=ROOT, text=True, capture_output=True)
    if result.returncode != 0:
        fail(errors, f"python state machine failed {path.relative_to(ROOT)}: {result.stderr.strip() or result.stdout.strip()}")


def check_node_handler(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    check_contains(errors, path, STATE_MACHINE_MARKERS)
    node = "node.exe" if os.name == "nt" else "node"
    try:
        subprocess.run([node, "--version"], text=True, capture_output=True, check=True)
    except Exception:
        print("WARN: node not found; skipping AnythingLLM handler execution check")
        return
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as fh:
        fh.write(NODE_HANDLER_SNIPPET)
        tmp = fh.name
    try:
        result = subprocess.run([node, tmp, str(path)], cwd=ROOT, text=True, capture_output=True)
        if result.returncode != 0:
            fail(errors, f"AnythingLLM handler failed: {result.stderr.strip() or result.stdout.strip()}")
    finally:
        try:
            os.unlink(tmp)
        except OSError:
            pass


def check_package_common(errors: list[str], base: Path, skill: bool) -> None:
    require_dir(errors, base)
    require_dir(errors, base / "agents")
    require_dir(errors, base / "templates")
    for name in AGENT_FILES:
        require_file(errors, base / "agents" / name)
    check_contains(errors, base / "agents" / "builder-1986.md", BUILDER_REQUIRED_MARKERS)
    check_toml(errors, base / "templates" / "handoff.toml")
    if skill:
        check_front_matter(errors, base / "SKILL.md")
        require_dir(errors, base / "scripts")
        check_python_machine(errors, base / "scripts" / "state_machine.py")


def check_anythingllm(errors: list[str]) -> None:
    check_package_common(errors, ANYTHING, skill=False)
    require_file(errors, ANYTHING / "README.md")
    require_file(errors, ANYTHING / "plugin.json")
    require_file(errors, ANYTHING / "handler.js")
    if (ANYTHING / "plugin.json").is_file():
        try:
            plugin = json.loads((ANYTHING / "plugin.json").read_text(encoding="utf-8"))
            if plugin.get("entrypoint", {}).get("file") != "handler.js":
                fail(errors, "AnythingLLM plugin entrypoint.file must be handler.js")
            if plugin.get("hubId") != "the-design-philosophers-and-the-builder":
                fail(errors, "AnythingLLM plugin hubId mismatch")
        except Exception as exc:
            fail(errors, f"invalid AnythingLLM plugin.json: {exc}")
    check_node_handler(errors, ANYTHING / "handler.js")


def main() -> int:
    errors: list[str] = []
    check_package_common(errors, CODEX, skill=True)
    check_package_common(errors, CLAUDE, skill=True)
    check_anythingllm(errors)

    package_maintenance = ROOT / "PACKAGE_MAINTENANCE.md"
    if package_maintenance.exists():
        fail(errors, "PACKAGE_MAINTENANCE.md should not exist; maintenance rules belong in README.md")

    if errors:
        print("Package verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("All package checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
