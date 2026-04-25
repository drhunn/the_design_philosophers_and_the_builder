const fs = require("fs");
const path = require("path");
const base = require("./handler.js");

const GLOBAL_AGENT_FILE = "global.md";
const ACTION_AGENT_FILES = {
  run_socrates: "socrates.md", return_to_socrates: "socrates.md",
  run_plato: "plato.md", return_to_plato: "plato.md",
  run_aristotle: "aristotle.md", return_to_aristotle: "aristotle.md",
  run_bacon_prebuild: "bacon.md", run_bacon_postbuild: "bacon.md", return_to_bacon_prebuild: "bacon.md",
  run_hoare_prebuild: "hoare.md", run_hoare_postbuild: "hoare.md", return_to_hoare_prebuild: "hoare.md",
  run_epictetus_prebuild: "epictetus.md", run_epictetus_postbuild: "epictetus.md", return_to_epictetus_prebuild: "epictetus.md",
  run_diogenes_prebuild: "diogenes.md", run_diogenes_postbuild: "diogenes.md",
  run_builder_feature_worktree_workflow: "builder-1986.md", repair_feature_worktree_workflow: "builder-1986.md",
  run_builder_task_slice_planning: "builder-1986.md", return_to_task_slice_planning: "builder-1986.md",
  run_builder_task_slice_implementation: "builder-1986.md", return_to_builder_task_slice: "builder-1986.md",
  run_builder_security_review: "builder-1986.md", return_to_builder_security_review: "builder-1986.md",
  run_patch_planning: "builder-1986.md", return_to_patch_planning: "builder-1986.md",
  run_patch_task_planning: "builder-1986.md", return_to_patch_task_planning: "builder-1986.md",
  run_patch_task_implementation: "builder-1986.md", return_to_patch_task_implementation: "builder-1986.md",
  return_to_builder: "builder-1986.md",
};
const CONTROLLER_ACTIONS = new Set(["allow_prototype", "mark_exploratory_only", "check_build_package", "make_admission_decision", "accept_feature", "require_postmortem"]);

function parseActions(actionsJson, action) {
  if (Array.isArray(actionsJson)) return actionsJson;
  if (typeof actionsJson === "string" && actionsJson.trim()) return JSON.parse(actionsJson);
  if (typeof action === "string" && action.trim()) return [action];
  return [];
}
function agentPath(file) { return path.join(__dirname, "agents", file); }
function resolveAction(action) {
  if (Object.prototype.hasOwnProperty.call(ACTION_AGENT_FILES, action)) {
    const agentFile = ACTION_AGENT_FILES[action];
    const fullPath = agentPath(agentFile);
    return { action, kind: "agent", agent_file: agentFile, relative_path: `agents/${agentFile}`, path: fullPath, exists: fs.existsSync(fullPath) };
  }
  if (CONTROLLER_ACTIONS.has(action)) return { action, kind: "controller", agent_file: null, relative_path: null, path: null, exists: true };
  throw new Error(`unknown state-machine action: ${action}`);
}
function loadAgentContent(agentFile) {
  const globalPath = agentPath(GLOBAL_AGENT_FILE);
  const selectedPath = agentPath(agentFile);
  if (!fs.existsSync(globalPath)) throw new Error(`global agent rules file not found: agents/${GLOBAL_AGENT_FILE}`);
  if (!fs.existsSync(selectedPath)) throw new Error(`agent file not found: agents/${agentFile}`);
  return fs.readFileSync(globalPath, "utf8") + "\n\n---\n\n" + fs.readFileSync(selectedPath, "utf8");
}
function loadAction(action) {
  const resolved = resolveAction(action);
  if (resolved.kind === "controller") return { ...resolved, content: null };
  return { ...resolved, content: loadAgentContent(resolved.agent_file), preamble_file: `agents/${GLOBAL_AGENT_FILE}` };
}
function loadActions(actions) { return actions.map(loadAction); }

module.exports.runtime = {
  handler: async function (args) {
    try {
      const operation = args.operation || "describe";
      if (operation === "resolve_actions") {
        return JSON.stringify({ actions: parseActions(args.actions_json, args.action).map(resolveAction) }, null, 2);
      }
      if (operation === "load_actions") {
        return JSON.stringify({ actions: loadActions(parseActions(args.actions_json, args.action)) }, null, 2);
      }
      if (operation === "dispatch_and_load") {
        const raw = await base.runtime.handler({ ...args, operation: "dispatch" });
        const dispatch = JSON.parse(raw);
        return JSON.stringify({ dispatch, loaded_actions: dispatch.ok ? loadActions(dispatch.actions) : [] }, null, 2);
      }
      return await base.runtime.handler(args);
    } catch (err) {
      return JSON.stringify({ ok: false, error: `The Design Philosophers and the Builder skill failed: ${err.message}` }, null, 2);
    }
  }
};
