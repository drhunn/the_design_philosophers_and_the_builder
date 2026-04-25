from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

if sys.version_info < (3, 11):
    raise SystemExit("Python 3.11 or newer is required. This verifier uses the standard-library tomllib module.")

import tomllib

ROOT = Path(__file__).resolve().parents[1]
CODEX = ROOT / "codex-desktop" / "the-design-philosophers-and-the-builder"
CLAUDE = ROOT / "claude-code" / "the-design-philosophers-and-the-builder"
ANYTHING = ROOT / "anythingllm" / "plugins" / "agent-skills" / "the-design-philosophers-and-the-builder"

AGENTS = ["README.md", "socrates.md", "plato.md", "aristotle.md", "bacon.md", "hoare.md", "epictetus.md", "diogenes.md", "builder-1986.md"]
LICENSE_MARKERS = ["MIT License", "Copyright (c) 2026 Danny Hunn", "THE SOFTWARE IS PROVIDED \"AS IS\""]
HANDOFF_SECTIONS = ["git", "task", "patch", "validation", "documentation", "remaining_work"]
BUILDER_MARKERS = [
    "Feature Branch Workflow",
    "Git cannot safely hold both `feature/foo` and `feature/foo/bar` as branches",
    "Do not nest Git worktrees inside other Git worktrees",
    "subfeature/<feature-slug>--<sub-feature-path-slug>",
    "patch/<feature-slug>--<sub-feature-path-slug>--<patch-id>",
    "patch branch merges into its affected task branch, sub-feature branch, or feature branch",
    "Builder must not batch patches",
    "Required Feature Worktree Workflow Documentation",
    "Required Task Slice Documentation",
    "Required Patch Documentation",
]
PY_MARKERS = ["PROOF_GUARDS", "validate_handoff_for_guard", "task_slice_complete", "patch_task_complete", "S7D_PATCH_TASK_IMPLEMENTATION"]
JS_MARKERS = ["PROOF_GUARDS", "validateHandoffObject", "validate_handoff", "task_slice_complete", "patch_task_complete", "S7D_PATCH_TASK_IMPLEMENTATION"]

PY_CHECK = """
import copy, importlib.util, sys
from pathlib import Path
p = Path(r'{path}')
spec = importlib.util.spec_from_file_location('state_machine_under_test', p)
mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)
m = mod.Machine(context=mod.happy_context())
seen = []
for event in mod.happy_path():
    seen.append(event)
    m.dispatch(event)
assert m.state == mod.S13
assert 'task_slice_complete' in seen
assert 'patch_task_complete' in seen
try:
    mod.Machine(state=mod.S7, context={}).dispatch('task_slice_complete')
    raise AssertionError('missing handoff accepted')
except ValueError as exc:
    assert 'required proof handoff missing' in str(exc)
bad = copy.deepcopy(mod.valid_handoff())
bad['documentation']['task_documentation_updated'] = False
try:
    mod.Machine(state=mod.S7, context={'handoff': bad}).dispatch('task_slice_complete')
    raise AssertionError('missing task docs accepted')
except ValueError as exc:
    assert 'task_documentation_updated' in str(exc)
bad_patch = copy.deepcopy(mod.valid_handoff())
bad_patch['documentation']['patch_documentation_updated'] = False
try:
    mod.Machine(state=mod.S7D, context={'handoff': bad_patch}).dispatch('patch_task_complete')
    raise AssertionError('missing patch docs accepted')
except ValueError as exc:
    assert 'patch_documentation_updated' in str(exc)
try:
    mod.Machine(state=mod.S7B, context=mod.happy_context()).dispatch('all_patch_tasks_complete')
    raise AssertionError('invalid transition accepted')
except ValueError as exc:
    assert 'invalid event' in str(exc)
print('ok')
"""

NODE_CHECK = """
const plugin = require(process.argv[2]);
(async () => {
  const handler = plugin.runtime && plugin.runtime.handler;
  if (typeof handler !== 'function') throw new Error('runtime.handler missing');
  const start = JSON.parse(await handler({operation:'dispatch', state:'S0_INTAKE', event:'new_request'}));
  if (!start.ok || start.to_state !== 'S1_PROBLEM_EXAMINATION') throw new Error('bad start transition');
  const bad = JSON.parse(await handler({operation:'dispatch', state:'S7_TASK_SLICE_IMPLEMENTATION', event:'task_slice_complete'}));
  if (bad.ok || !String(bad.error).includes('Required proof handoff missing')) throw new Error('missing handoff accepted');
  const tmpl = await handler({operation:'handoff_template'});
  const validation = JSON.parse(await handler({operation:'validate_handoff', artifact_toml:tmpl, guard:'task_documentation_updated'}));
  if (validation.ok || validation.errors.length === 0) throw new Error('bad handoff accepted');
  const happy = JSON.parse(await handler({operation:'happy_path'}));
  if (!happy.events.includes('task_slice_complete') || !happy.events.includes('patch_task_complete')) throw new Error('happy path missing loop events');
  console.log('ok');
})();
"""


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def add(errors: list[str], message: str) -> None:
    errors.append(message)


def require_file(errors: list[str], path: Path) -> None:
    if not path.is_file():
        add(errors, f"missing file: {rel(path)}")


def require_dir(errors: list[str], path: Path) -> None:
    if not path.is_dir():
        add(errors, f"missing directory: {rel(path)}")


def contains(errors: list[str], path: Path, markers: list[str]) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            add(errors, f"{rel(path)} missing marker: {marker}")


def check_front_matter(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n") or not re.search(r"^name:\s*", text, re.M) or not re.search(r"^description:\s*", text, re.M):
        add(errors, f"bad YAML front matter: {rel(path)}")


def check_toml(errors: list[str], path: Path) -> None:
    require_file(errors, path)
    if not path.is_file():
        return
    try:
        parsed = tomllib.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        add(errors, f"invalid TOML {rel(path)}: {exc}")
        return
    for section in HANDOFF_SECTIONS:
        if section not in parsed:
            add(errors, f"{rel(path)} missing TOML section [{section}]")


def run_python_machine(errors: list[str], path: Path) -> None:
    contains(errors, path, PY_MARKERS)
    if not path.is_file():
        return
    result = subprocess.run([sys.executable, "-c", PY_CHECK.format(path=str(path))], cwd=ROOT, text=True, capture_output=True)
    if result.returncode != 0:
        add(errors, f"state machine failed {rel(path)}: {result.stderr.strip() or result.stdout.strip()}")


def run_node_handler(errors: list[str], path: Path) -> None:
    contains(errors, path, JS_MARKERS)
    if not path.is_file():
        return
    node = "node.exe" if os.name == "nt" else "node"
    try:
        subprocess.run([node, "--version"], check=True, text=True, capture_output=True)
    except Exception:
        print("WARN: node not found; skipping AnythingLLM handler execution check")
        return
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as handle:
        handle.write(NODE_CHECK)
        tmp = handle.name
    try:
        result = subprocess.run([node, tmp, str(path)], cwd=ROOT, text=True, capture_output=True)
        if result.returncode != 0:
            add(errors, f"AnythingLLM handler failed: {result.stderr.strip() or result.stdout.strip()}")
    finally:
        try:
            os.unlink(tmp)
        except OSError:
            pass


def check_package(errors: list[str], base: Path, *, skill: bool) -> None:
    require_dir(errors, base)
    require_dir(errors, base / "agents")
    require_dir(errors, base / "templates")
    contains(errors, base / "LICENSE", LICENSE_MARKERS)
    for agent in AGENTS:
        require_file(errors, base / "agents" / agent)
    contains(errors, base / "agents" / "builder-1986.md", BUILDER_MARKERS)
    check_toml(errors, base / "templates" / "handoff.toml")
    if skill:
        check_front_matter(errors, base / "SKILL.md")
        run_python_machine(errors, base / "scripts" / "state_machine.py")


def check_anything(errors: list[str]) -> None:
    check_package(errors, ANYTHING, skill=False)
    require_file(errors, ANYTHING / "README.md")
    require_file(errors, ANYTHING / "plugin.json")
    require_file(errors, ANYTHING / "handler.js")
    if (ANYTHING / "plugin.json").is_file():
        try:
            plugin = json.loads((ANYTHING / "plugin.json").read_text(encoding="utf-8"))
        except Exception as exc:
            add(errors, f"invalid AnythingLLM plugin.json: {exc}")
        else:
            desc = plugin.get("description", "")
            for marker in ["flat Git worktrees", "one-task-at-a-time", "one-patch-at-a-time", "proof-carrying handoff validation"]:
                if marker not in desc:
                    add(errors, f"AnythingLLM plugin description missing marker: {marker}")
            op_desc = plugin.get("entrypoint", {}).get("params", {}).get("operation", {}).get("description", "")
            if "validate_handoff" not in op_desc:
                add(errors, "AnythingLLM operation description missing validate_handoff")
            if plugin.get("entrypoint", {}).get("file") != "handler.js":
                add(errors, "AnythingLLM entrypoint.file must be handler.js")
    run_node_handler(errors, ANYTHING / "handler.js")


def main() -> int:
    errors: list[str] = []
    contains(errors, ROOT / "LICENSE", LICENSE_MARKERS)
    check_package(errors, CODEX, skill=True)
    check_package(errors, CLAUDE, skill=True)
    check_anything(errors)
    if (ROOT / "PACKAGE_MAINTENANCE.md").exists():
        add(errors, "PACKAGE_MAINTENANCE.md should not exist; maintenance rules belong in README.md")
    if errors:
        print("Package verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("All package checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
