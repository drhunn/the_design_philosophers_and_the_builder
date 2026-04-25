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
LEAN_MODEL = ROOT / "proofs" / "lean" / "TheDesignPhilosophers" / "StateMachine.lean"

AGENTS = ["README.md", "global.md", "socrates.md", "plato.md", "aristotle.md", "bacon.md", "hoare.md", "epictetus.md", "diogenes.md", "builder-1986.md"]
LICENSE_MARKERS = ["MIT License", "Copyright (c) 2026 Danny Hunn", "THE SOFTWARE IS PROVIDED \"AS IS\""]
CHANGELOG_MARKERS = ["# Changelog", "date and time", "summary", "commit or merge hash", "Repository-level changes include", "Commit/Merge Hash"]
GLOBAL_MARKERS = ["Global Agent Rules", "Changelog Decision Required", "repo_changed", "No agent may change the repository without recording this decision"]
HANDOFF_SECTIONS = ["git", "task", "patch", "validation", "documentation", "remaining_work", "changelog", "markdown_links"]
BUILDER_MARKERS = ["Feature Branch Workflow", "Do not nest Git worktrees inside other Git worktrees", "Builder must not batch patches", "Required Task Slice Documentation", "Required Patch Documentation"]
PLATO_MARKERS = ["Plato owns the PRD-level product artifact", "Create a PRD as a Markdown file", "templates/prd.md", "prd = [\"docs/product/prd.md\"]"]
PRD_TEMPLATE_MARKERS = ["# Product Requirements Document", "## Product Identity", "## Source Problem", "## Functional Requirements", "## Success Criteria"]
PACKAGE_README_MARKERS = ["Dispatcher Loader", "agents/global.md", "fixed action", "templates/handoff.toml", "templates/prd.md"]
PY_PACKAGE_README_MARKERS = ["scripts/dispatcher.py"]
ANYTHING_PACKAGE_README_MARKERS = ["handler-with-global.js", "resolve_actions", "load_actions", "dispatch_and_load"]
DISPATCHER_MARKERS = ["GLOBAL_PREAMBLE", "_load_with_preamble", "preamble_file", "dispatch_and_load"]
PY_MACHINE_MARKERS = [
    "PROOF_GUARDS",
    "validate_handoff_for_guard",
    "task_slice_complete",
    "patch_task_complete",
    "prd_markdown_linked",
    "[changelog].repo_changed must explicitly be true or false",
    "[markdown_links].prd must link the PRD Markdown file before ideal_model_complete",
]
JS_WRAPPER_MARKERS = ["GLOBAL_AGENT_FILE", "handler.js", "dispatch_and_load", "load_actions", "preamble_file"]
JS_BASE_MARKERS = [
    "validateHandoffObject",
    "repo_changed",
    "handoffTemplate",
    "[changelog]",
    "prd_markdown_linked",
    "markdown_links",
    "ideal_model_complete: t(STATES.S2, [\"run_aristotle\"], \"prd_markdown_linked\")",
]
LEAN_MARKERS = [
    "prdMarkdownLinked",
    "ideal_model_transition_is_guarded",
    "ideal_model_rejected_without_prd_markdown",
    "ideal_model_complete_implies_prd_markdown",
]

PY_CHECK = """
import copy, importlib.util, sys
from pathlib import Path
p = Path(r'{path}')
spec = importlib.util.spec_from_file_location('state_machine_under_test', p)
mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)
assert mod.TABLE[mod.S1A]['ideal_model_complete'][2] == 'prd_markdown_linked'
m = mod.Machine(context=mod.happy_context())
seen = []
for event in mod.happy_path():
    seen.append(event)
    m.dispatch(event)
assert m.state == mod.S13
assert 'ideal_model_complete' in seen
assert 'task_slice_complete' in seen
assert 'patch_task_complete' in seen
try:
    mod.Machine(state=mod.S1A, context={}).dispatch('ideal_model_complete')
    raise AssertionError('missing PRD handoff accepted')
except ValueError as exc:
    assert 'required proof handoff missing' in str(exc)
bad_prd = copy.deepcopy(mod.valid_handoff())
bad_prd['markdown_links']['prd'] = []
try:
    mod.Machine(state=mod.S1A, context={'handoff': bad_prd}).dispatch('ideal_model_complete')
    raise AssertionError('missing PRD link accepted')
except ValueError as exc:
    assert 'markdown_links' in str(exc)
bad_changelog = copy.deepcopy(mod.valid_handoff())
del bad_changelog['changelog']['repo_changed']
try:
    mod.Machine(state=mod.S1A, context={'handoff': bad_changelog}).dispatch('ideal_model_complete')
    raise AssertionError('missing changelog decision accepted')
except ValueError as exc:
    assert 'repo_changed' in str(exc)
bad_task = copy.deepcopy(mod.valid_handoff())
bad_task['documentation']['task_documentation_updated'] = False
try:
    mod.Machine(state=mod.S7, context={'handoff': bad_task}).dispatch('task_slice_complete')
    raise AssertionError('missing task docs accepted')
except ValueError as exc:
    assert 'task_documentation_updated' in str(exc)
print('ok')
"""

DISPATCHER_CHECK = """
import importlib.util, sys
from pathlib import Path
p = Path(r'{path}')
spec = importlib.util.spec_from_file_location('dispatcher_under_test', p)
mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)
loaded = mod.load_action('run_builder_task_slice_planning')
assert loaded['kind'] == 'agent'
assert loaded['agent_file'] == 'builder-1986.md'
assert loaded.get('preamble_file') == 'agents/global.md'
assert 'Global Agent Rules' in loaded['content']
assert 'Builder 1986' in loaded['content']
controller = mod.load_action('check_build_package')
assert controller['kind'] == 'controller'
assert controller['content'] is None
try:
    mod.resolve_action('../agents/socrates.md')
    raise AssertionError('arbitrary path action accepted')
except KeyError:
    pass
print('ok')
"""

NODE_CHECK = """
const plugin = require(process.argv[2]);
(async () => {
  const handler = plugin.runtime && plugin.runtime.handler;
  if (typeof handler !== 'function') throw new Error('runtime.handler missing');
  const loaded = JSON.parse(await handler({operation:'load_actions', action:'run_builder_task_slice_planning'}));
  if (loaded.actions[0].preamble_file !== 'agents/global.md') throw new Error('global preamble missing');
  if (!String(loaded.actions[0].content).includes('Global Agent Rules')) throw new Error('global rules not loaded');
  if (!String(loaded.actions[0].content).includes('Builder 1986')) throw new Error('builder content did not load');
  const pathLike = JSON.parse(await handler({operation:'load_actions', action:'../agents/socrates.md'}));
  if (pathLike.ok !== false || !String(pathLike.error).includes('unknown state-machine action')) throw new Error('path-like action accepted');
  const tmpl = await handler({operation:'handoff_template'});
  if (!tmpl.includes('[changelog]')) throw new Error('handoff template missing changelog section');
  if (!tmpl.includes('repo_changed = false')) throw new Error('handoff template missing explicit repo_changed default');
  if (!tmpl.includes('[markdown_links]')) throw new Error('handoff template missing markdown_links');
  if (!tmpl.includes('prd = []')) throw new Error('handoff template missing PRD markdown link');
  const prdFail = JSON.parse(await handler({operation:'dispatch', state:'S1A_SCOPED_IDEAL_MODEL', event:'ideal_model_complete', artifact_toml:tmpl}));
  if (prdFail.ok || !JSON.stringify(prdFail).includes('markdown_links')) throw new Error('ideal_model_complete accepted missing PRD link');
  const validation = JSON.parse(await handler({operation:'validate_handoff', artifact_toml:tmpl, guard:'task_documentation_updated'}));
  if (validation.ok || validation.errors.length === 0) throw new Error('bad handoff accepted');
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


def check_changelog(errors: list[str]) -> None:
    path = ROOT / "CHANGELOG.md"
    contains(errors, path, CHANGELOG_MARKERS)
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    if not re.search(r"\|\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+-\d{2}:\d{2}\s*\|", text):
        add(errors, "CHANGELOG.md has no entry with required date/time format")
    if not re.search(r"`[0-9a-f]{40}`|`PENDING`", text):
        add(errors, "CHANGELOG.md has no commit/merge hash or pending-hash marker")


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
    changelog = parsed.get("changelog", {})
    if not isinstance(changelog, dict) or "repo_changed" not in changelog:
        add(errors, f"{rel(path)} missing [changelog].repo_changed")
    links = parsed.get("markdown_links", {})
    if not isinstance(links, dict) or "prd" not in links:
        add(errors, f"{rel(path)} missing [markdown_links].prd")


def run_python_snippet(errors: list[str], path: Path, snippet: str, label: str) -> None:
    if not path.is_file():
        return
    code = snippet.replace("{path}", str(path))
    result = subprocess.run([sys.executable, "-c", code], cwd=ROOT, text=True, capture_output=True)
    if result.returncode != 0:
        add(errors, f"{label} failed {rel(path)}: {result.stderr.strip() or result.stdout.strip()}")


def run_node_handler(errors: list[str], path: Path) -> None:
    contains(errors, path, JS_WRAPPER_MARKERS)
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
    contains(errors, base / "README.md", PACKAGE_README_MARKERS)
    if skill:
        contains(errors, base / "README.md", PY_PACKAGE_README_MARKERS)
    else:
        contains(errors, base / "README.md", ANYTHING_PACKAGE_README_MARKERS)
    contains(errors, base / "LICENSE", LICENSE_MARKERS)
    for agent in AGENTS:
        require_file(errors, base / "agents" / agent)
    contains(errors, base / "agents" / "global.md", GLOBAL_MARKERS)
    contains(errors, base / "agents" / "builder-1986.md", BUILDER_MARKERS)
    contains(errors, base / "agents" / "plato.md", PLATO_MARKERS)
    contains(errors, base / "templates" / "prd.md", PRD_TEMPLATE_MARKERS)
    check_toml(errors, base / "templates" / "handoff.toml")
    if skill:
        check_front_matter(errors, base / "SKILL.md")
        contains(errors, base / "scripts" / "state_machine.py", PY_MACHINE_MARKERS)
        run_python_snippet(errors, base / "scripts" / "state_machine.py", PY_CHECK, "state machine")
        contains(errors, base / "scripts" / "dispatcher.py", DISPATCHER_MARKERS)
        run_python_snippet(errors, base / "scripts" / "dispatcher.py", DISPATCHER_CHECK, "dispatcher")


def check_runtime_conformance(errors: list[str]) -> None:
    codex_machine = CODEX / "scripts" / "state_machine.py"
    claude_machine = CLAUDE / "scripts" / "state_machine.py"
    if codex_machine.is_file() and claude_machine.is_file():
        if codex_machine.read_text(encoding="utf-8") != claude_machine.read_text(encoding="utf-8"):
            add(errors, "Codex and Claude state_machine.py differ")
    if (ANYTHING / "handler.js").is_file() and codex_machine.is_file():
        js = (ANYTHING / "handler.js").read_text(encoding="utf-8")
        py = codex_machine.read_text(encoding="utf-8")
        for marker in ["feature_inventory_mismatch", "validation_mapping_failed", "correctness_mapping_failed", "operational_mapping_failed", "prd_markdown_linked"]:
            if marker not in js:
                add(errors, f"AnythingLLM handler.js missing transition/guard marker: {marker}")
            if marker not in py:
                add(errors, f"Python state machine missing transition/guard marker: {marker}")


def check_anything(errors: list[str]) -> None:
    check_package(errors, ANYTHING, skill=False)
    require_file(errors, ANYTHING / "README.md")
    require_file(errors, ANYTHING / "plugin.json")
    contains(errors, ANYTHING / "handler.js", JS_BASE_MARKERS)
    contains(errors, ANYTHING / "handler-with-global.js", JS_WRAPPER_MARKERS)
    if (ANYTHING / "plugin.json").is_file():
        try:
            plugin = json.loads((ANYTHING / "plugin.json").read_text(encoding="utf-8"))
        except Exception as exc:
            add(errors, f"invalid AnythingLLM plugin.json: {exc}")
        else:
            if plugin.get("entrypoint", {}).get("file") != "handler-with-global.js":
                add(errors, "AnythingLLM entrypoint.file must be handler-with-global.js")
            desc = plugin.get("description", "")
            for marker in ["explicit changelog decisions", "global agent preamble", "fixed action-to-agent dispatch/loading"]:
                if marker not in desc:
                    add(errors, f"AnythingLLM plugin description missing marker: {marker}")
    run_node_handler(errors, ANYTHING / "handler-with-global.js")


def main() -> int:
    errors: list[str] = []
    contains(errors, ROOT / "LICENSE", LICENSE_MARKERS)
    check_changelog(errors)
    check_package(errors, CODEX, skill=True)
    check_package(errors, CLAUDE, skill=True)
    check_anything(errors)
    check_runtime_conformance(errors)
    contains(errors, LEAN_MODEL, LEAN_MARKERS)
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
