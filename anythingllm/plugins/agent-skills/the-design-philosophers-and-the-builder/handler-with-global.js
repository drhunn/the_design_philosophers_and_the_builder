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
function parseContext(contextJson) {
  if (!contextJson) return {};
  if (typeof contextJson === "object") return contextJson;
  try { return JSON.parse(contextJson); } catch (_err) { return {}; }
}
function parseValue(raw) {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "[]") return [];
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean).map(s => s.replace(/^"|"$/g, ""));
  }
  return value.replace(/^"|"$/g, "");
}
function parseTomlLoose(text) {
  const out = {};
  let section = null;
  for (const line of String(text || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1];
      out[section] = out[section] || {};
      continue;
    }
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    const value = parseValue(trimmed.slice(index + 1));
    if (section) out[section][key] = value;
    else out[key] = value;
  }
  return out;
}
function artifactFromArgs(args) {
  const context = parseContext(args.context_json);
  if (context.handoff && typeof context.handoff === "object") return context.handoff;
  if (typeof context.handoff_toml === "string") return parseTomlLoose(context.handoff_toml);
  if (typeof context.artifact_toml === "string") return parseTomlLoose(context.artifact_toml);
  if (typeof args.artifact_toml === "string") return parseTomlLoose(args.artifact_toml);
  return null;
}
function present(value) {
  return value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && value.length === 0);
}
function validatePostbuildLeanCorrectness(handoff) {
  const errors = [];
  const validation = (handoff && handoff.validation) || {};
  const correctness = (handoff && handoff.correctness) || {};
  if (!handoff || typeof handoff.correctness !== "object") {
    errors.push("missing [correctness] section");
    return errors;
  }
  if (typeof correctness.lean_proof_required !== "boolean") {
    errors.push("[correctness].lean_proof_required must explicitly be true or false");
    return errors;
  }
  const leanProved = Array.isArray(correctness.lean_proved_obligations) ? correctness.lean_proved_obligations : null;
  const runtimeChecked = Array.isArray(correctness.runtime_test_checked_obligations) ? correctness.runtime_test_checked_obligations : null;
  const nonFormal = Array.isArray(correctness.non_formal_obligations) ? correctness.non_formal_obligations : null;
  if (!leanProved || !runtimeChecked || !nonFormal) {
    errors.push("[correctness] obligation fields must be lists");
    return errors;
  }
  if (leanProved.length === 0 && runtimeChecked.length === 0 && nonFormal.length === 0) {
    errors.push("[correctness] must classify at least one post-build correctness obligation");
  }
  if (correctness.lean_proof_required === true) {
    if (correctness.lean_proof_updated !== true) errors.push("[correctness].lean_proof_updated must be true when Lean proof is required");
    if (correctness.lean_proof_passed !== true) errors.push("[correctness].lean_proof_passed must be true when Lean proof is required");
    if (!present(correctness.lean_proof_paths)) errors.push("[correctness].lean_proof_paths is required when Lean proof is required");
    if (!present(correctness.lean_proof_commands)) errors.push("[correctness].lean_proof_commands is required when Lean proof is required");
    if (!present(leanProved)) errors.push("[correctness].lean_proved_obligations is required when Lean proof is required");
  }
  if (nonFormal.length > 0 && !present(correctness.non_formal_reason)) {
    errors.push("[correctness].non_formal_reason is required when non-formal obligations are listed");
  }
  if (validation.hoare_passed !== true) errors.push("[validation].hoare_passed must be true before correctness_review_passed");
  if (validation.tests_passed !== true) errors.push("[validation].tests_passed must be true before correctness_review_passed");
  return errors;
}
function correctnessSectionTemplate() {
  return `\n[correctness]\nlean_proof_required = false\nlean_proof_updated = false\nlean_proof_paths = []\nlean_proof_commands = []\nlean_proof_passed = false\nlean_proved_obligations = []\nruntime_test_checked_obligations = []\nnon_formal_obligations = []\nnon_formal_reason = ""\n`;
}
async function dispatchWithRuntimeGuard(args) {
  if (args.state === "S10_POST_BUILD_CORRECTNESS_REVIEW" && args.event === "correctness_review_passed") {
    const artifact = artifactFromArgs(args);
    const validationErrors = validatePostbuildLeanCorrectness(artifact);
    if (validationErrors.length) {
      return JSON.stringify({ ok: false, error: "handoff validation failed for guard postbuild_lean_correctness_checked", validation_errors: validationErrors }, null, 2);
    }
  }
  return await base.runtime.handler({ ...args, operation: "dispatch" });
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
      if (operation === "dispatch") {
        return await dispatchWithRuntimeGuard(args);
      }
      if (operation === "dispatch_and_load") {
        const raw = await dispatchWithRuntimeGuard({ ...args, operation: "dispatch" });
        const dispatch = JSON.parse(raw);
        return JSON.stringify({ dispatch, loaded_actions: dispatch.ok ? loadActions(dispatch.actions) : [] }, null, 2);
      }
      if (operation === "handoff_template") {
        const template = await base.runtime.handler(args);
        return template.includes("[correctness]") ? template : template + correctnessSectionTemplate();
      }
      return await base.runtime.handler(args);
    } catch (err) {
      return JSON.stringify({ ok: false, error: `The Design Philosophers and the Builder skill failed: ${err.message}` }, null, 2);
    }
  }
};
