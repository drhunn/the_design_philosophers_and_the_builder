const fs = require("fs");
const path = require("path");

const STATES = {
  S0: "S0_INTAKE",
  S1: "S1_PROBLEM_EXAMINATION",
  S1A: "S1A_SCOPED_IDEAL_MODEL",
  S2: "S2_STRUCTURAL_DESIGN",
  S3: "S3_PRE_BUILD_VALIDATION_ARCHITECTURE",
  S4: "S4_PRE_BUILD_CORRECTNESS_SPECIFICATION",
  S4A: "S4A_PRE_BUILD_OPERATIONAL_RESILIENCE_SPECIFICATION",
  S5: "S5_PRE_BUILD_AUSTERITY_REVIEW",
  S6: "S6_BUILD_READY",
  S6B: "S6B_BUILDER_FEATURE_WORKTREE_WORKFLOW",
  S6C: "S6C_BUILDER_TASK_SLICE_PLANNING",
  S7: "S7_TASK_SLICE_IMPLEMENTATION",
  S7A: "S7A_BUILDER_SECURITY_REVIEW",
  S7B: "S7B_PATCH_PLANNING",
  S7C: "S7C_PATCH_TASK_PLANNING",
  S7D: "S7D_PATCH_TASK_IMPLEMENTATION",
  S8: "S8_POST_BUILD_REDUCTION_REVIEW",
  S9: "S9_POST_BUILD_EMPIRICAL_REVIEW",
  S10: "S10_POST_BUILD_CORRECTNESS_REVIEW",
  S11: "S11_POST_BUILD_OPERATIONAL_RESILIENCE_REVIEW",
  S12: "S12_ADMISSION_DECISION",
  S13: "S13_ACCEPTED",
  S14: "S14_REWORK",
  S15: "S15_EXPLORATORY",
};

function t(to, actions = [], guard = null) {
  return { to, actions, guard };
}

const TABLE = {
  [STATES.S0]: { new_request: t(STATES.S1, ["run_socrates"]) },
  [STATES.S1]: {
    request_is_vague: t(STATES.S1, ["run_socrates"]),
    problem_is_clear: t(STATES.S1A, ["run_plato"]),
    prototype_only: t(STATES.S15, ["allow_prototype", "mark_exploratory_only"]),
  },
  [STATES.S1A]: {
    ideal_model_complete: t(STATES.S2, ["run_aristotle"]),
    new_contradiction_found: t(STATES.S1, ["return_to_socrates"]),
  },
  [STATES.S2]: {
    architecture_complete: t(STATES.S3, ["run_bacon_prebuild"]),
    design_gap_found: t(STATES.S2, ["run_aristotle"]),
    product_constraint_missing: t(STATES.S1A, ["return_to_plato"]),
  },
  [STATES.S3]: {
    validation_obligations_known: t(STATES.S4, ["run_hoare_prebuild"]),
    design_gap_found: t(STATES.S2, ["return_to_aristotle"]),
    product_constraint_missing: t(STATES.S1A, ["return_to_plato"]),
  },
  [STATES.S4]: {
    correctness_obligations_known: t(STATES.S4A, ["run_epictetus_prebuild"]),
    design_gap_found: t(STATES.S2, ["return_to_aristotle"]),
    validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]),
  },
  [STATES.S4A]: {
    operational_obligations_known: t(STATES.S5, ["run_diogenes_prebuild"]),
    design_gap_found: t(STATES.S2, ["return_to_aristotle"]),
    validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]),
    correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild"]),
    product_constraint_missing: t(STATES.S1A, ["return_to_plato"]),
  },
  [STATES.S5]: {
    austerity_review_complete: t(STATES.S6, ["check_build_package"]),
    excess_complexity_found: t(STATES.S2, ["return_to_aristotle"]),
    operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild"]),
  },
  [STATES.S6]: {
    build_package_complete: t(STATES.S6B, ["run_builder_feature_worktree_workflow"], "build_package_complete"),
    build_package_incomplete: t(STATES.S14, ["require_postmortem"]),
  },
  [STATES.S6B]: {
    feature_worktree_workflow_complete: t(STATES.S6C, ["run_builder_task_slice_planning"], "feature_worktree_workflow_complete"),
    feature_worktree_workflow_failed: t(STATES.S14, ["return_to_builder_feature_worktree_workflow", "require_postmortem"]),
    branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]),
  },
  [STATES.S6C]: {
    task_slice_plan_complete: t(STATES.S7, ["run_builder_task_slice_implementation"], "task_slice_plan_complete"),
    task_slice_plan_failed: t(STATES.S14, ["return_to_task_slice_planning", "require_postmortem"]),
    no_remaining_task_slices: t(STATES.S7A, ["run_builder_security_review"], "no_remaining_task_slices"),
    branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]),
  },
  [STATES.S7]: {
    task_slice_complete: t(STATES.S6C, ["run_builder_task_slice_planning"], "task_documentation_updated"),
    all_task_slices_complete: t(STATES.S7A, ["run_builder_security_review"], "all_task_slices_complete"),
    task_slice_failed: t(STATES.S14, ["return_to_builder_task_slice", "require_postmortem"]),
    branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]),
  },
  [STATES.S7A]: {
    security_review_complete: t(STATES.S7B, ["run_patch_planning"]),
    security_review_failed: t(STATES.S14, ["return_to_builder_security_review", "require_postmortem"]),
    design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]),
  },
  [STATES.S7B]: {
    patch_plan_complete: t(STATES.S7C, ["run_patch_task_planning"]),
    patch_plan_failed: t(STATES.S14, ["return_to_patch_planning", "require_postmortem"]),
  },
  [STATES.S7C]: {
    patch_task_plan_complete: t(STATES.S7D, ["run_patch_task_implementation"], "patch_task_plan_complete"),
    patch_task_plan_failed: t(STATES.S14, ["return_to_patch_task_planning", "require_postmortem"]),
    no_remaining_patch_tasks: t(STATES.S8, ["run_diogenes_postbuild"], "no_remaining_patch_tasks"),
    branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]),
  },
  [STATES.S7D]: {
    patch_task_complete: t(STATES.S7C, ["run_patch_task_planning"], "patch_task_documentation_updated"),
    all_patch_tasks_complete: t(STATES.S8, ["run_diogenes_postbuild"], "all_patch_tasks_complete"),
    patch_task_failed: t(STATES.S14, ["return_to_patch_task_implementation", "require_postmortem"]),
    branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]),
  },
  [STATES.S8]: {
    reduction_review_complete: t(STATES.S9, ["run_bacon_postbuild"]),
    excess_complexity_found: t(STATES.S14, ["return_to_builder", "require_postmortem"]),
  },
  [STATES.S9]: {
    empirical_review_passed: t(STATES.S10, ["run_hoare_postbuild"], "empirical_review_passed"),
    empirical_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]),
  },
  [STATES.S10]: {
    correctness_review_passed: t(STATES.S11, ["run_epictetus_postbuild"], "correctness_review_passed"),
    correctness_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]),
  },
  [STATES.S11]: {
    operations_review_passed: t(STATES.S12, ["make_admission_decision"], "operations_review_passed"),
    operations_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]),
  },
  [STATES.S12]: {
    admission_granted: t(STATES.S13, ["accept_feature"], "admission_granted"),
    admission_denied: t(STATES.S14, ["require_postmortem"]),
  },
  [STATES.S13]: {},
  [STATES.S14]: {
    new_contradiction_found: t(STATES.S1, ["run_socrates"]),
    product_constraint_missing: t(STATES.S1A, ["run_plato"]),
    design_gap_found: t(STATES.S2, ["run_aristotle"]),
    validation_gap_found: t(STATES.S3, ["run_bacon_prebuild"]),
    correctness_gap_found: t(STATES.S4, ["run_hoare_prebuild"]),
    operational_gap_found: t(STATES.S4A, ["run_epictetus_prebuild"]),
    excess_complexity_found: t(STATES.S5, ["run_diogenes_prebuild"]),
    feature_worktree_workflow_failed: t(STATES.S6B, ["run_builder_feature_worktree_workflow"]),
    task_slice_plan_failed: t(STATES.S6C, ["run_builder_task_slice_planning"]),
    task_slice_failed: t(STATES.S7, ["run_builder_task_slice_implementation"]),
    security_review_failed: t(STATES.S7A, ["run_builder_security_review"]),
    patch_plan_failed: t(STATES.S7B, ["run_patch_planning"]),
    patch_task_plan_failed: t(STATES.S7C, ["run_patch_task_planning"]),
    patch_task_failed: t(STATES.S7D, ["run_patch_task_implementation"]),
  },
  [STATES.S15]: { new_contradiction_found: t(STATES.S1, ["return_to_socrates"]) },
};

const PROOF_GUARDS = new Set([
  "feature_worktree_workflow_complete",
  "task_slice_plan_complete",
  "task_documentation_updated",
  "all_task_slices_complete",
  "no_remaining_task_slices",
  "patch_task_plan_complete",
  "patch_task_documentation_updated",
  "all_patch_tasks_complete",
  "no_remaining_patch_tasks",
]);

const REQUIRED_SECTIONS = ["git", "task", "patch", "validation", "documentation", "remaining_work", "changelog"];

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

function parseContext(contextJson) { if (!contextJson) return {}; if (typeof contextJson === "object") return contextJson; try { return JSON.parse(contextJson); } catch (_err) { return {}; } }
function parseActions(actionsJson, action) { if (Array.isArray(actionsJson)) return actionsJson; if (typeof actionsJson === "string" && actionsJson.trim()) return JSON.parse(actionsJson); if (typeof action === "string" && action.trim()) return [action]; return []; }
function present(v) { return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0); }
function parseValue(raw) { const v = raw.trim(); if (v === "true") return true; if (v === "false") return false; if (v === "[]") return []; if (v.startsWith("[") && v.endsWith("]")) return v.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean).map(s => s.replace(/^"|"$/g, "")); return v.replace(/^"|"$/g, ""); }
function parseTomlLoose(text) { const out = {}; let section = null; for (const line of String(text || "").split(/\r?\n/)) { const trimmed = line.trim(); if (!trimmed || trimmed.startsWith("#")) continue; const m = trimmed.match(/^\[([^\]]+)\]$/); if (m) { section = m[1]; out[section] = out[section] || {}; continue; } const idx = trimmed.indexOf("="); if (idx < 0) continue; const key = trimmed.slice(0, idx).trim(); const value = parseValue(trimmed.slice(idx + 1)); if (section) out[section][key] = value; else out[key] = value; } return out; }
function subset(touched, allowed) { if (!Array.isArray(touched) || touched.length === 0) return true; return Array.isArray(allowed) && allowed.length > 0 && touched.every(f => allowed.includes(f)); }

function validateHandoffObject(handoff, guard = "task_documentation_updated") {
  const errors = [];
  for (const s of REQUIRED_SECTIONS) if (!handoff || typeof handoff[s] !== "object") errors.push(`missing [${s}] section`);
  const git = handoff.git || {}, task = handoff.task || {}, patch = handoff.patch || {}, validation = handoff.validation || {}, docs = handoff.documentation || {}, remaining = handoff.remaining_work || {}, changelog = handoff.changelog || {};
  if (typeof changelog.repo_changed !== "boolean") errors.push("[changelog].repo_changed must explicitly be true or false");
  if (changelog.repo_changed === true) {
    if (changelog.required !== true) errors.push("[changelog].required must be true when repo_changed is true");
    if (changelog.updated !== true) errors.push("[changelog].updated must be true when repo_changed is true");
    for (const k of ["date_time", "scope", "summary", "path"]) if (!present(changelog[k])) errors.push(`[changelog].${k} is required when repo_changed is true`);
    if (!present(changelog.commit_or_merge_hash) && changelog.pending_hash !== true) errors.push("[changelog].commit_or_merge_hash is required unless pending_hash is true");
  }
  if (PROOF_GUARDS.has(guard)) {
    for (const k of ["active_branch", "worktree_path", "merge_target"]) if (!present(git[k])) errors.push(`[git].${k} is required`);
    if (git.branch_is_collision_free !== true) errors.push("[git].branch_is_collision_free must be true");
    if (git.worktree_is_flat_sibling !== true) errors.push("[git].worktree_is_flat_sibling must be true");
    if (git.worktree_verified !== true) errors.push("[git].worktree_verified must be true");
  }
  if (["task_slice_plan_complete", "task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices"].includes(guard)) { for (const k of ["task_id", "feature_slug", "task_slug", "purpose"]) if (!present(task[k])) errors.push(`[task].${k} is required`); if (!subset(task.touched_files || [], task.allowed_files || [])) errors.push("[task].touched_files must be a subset of [task].allowed_files"); }
  if (["task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices", "patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"].includes(guard)) { for (const k of ["bacon_passed", "hoare_passed", "epictetus_passed", "diogenes_passed", "tests_passed"]) if (validation[k] !== true) errors.push(`[validation].${k} must be true`); }
  if (["task_documentation_updated", "all_task_slices_complete", "no_remaining_task_slices"].includes(guard)) { if (docs.task_documentation_updated !== true) errors.push("[documentation].task_documentation_updated must be true"); if (!present(docs.task_documentation_path)) errors.push("[documentation].task_documentation_path is required"); }
  if (["all_task_slices_complete", "no_remaining_task_slices"].includes(guard)) { if (remaining.no_remaining_task_slices !== true) errors.push("[remaining_work].no_remaining_task_slices must be true"); if (Array.isArray(remaining.remaining_task_slices) && remaining.remaining_task_slices.length !== 0) errors.push("[remaining_work].remaining_task_slices must be empty"); }
  if (["patch_task_plan_complete", "patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"].includes(guard)) { for (const k of ["patch_task_id", "patch_id", "kind", "risk_or_defect", "affected_branch", "affected_worktree_path", "merge_target"]) if (!present(patch[k])) errors.push(`[patch].${k} is required`); if (!present(patch.merge_path)) errors.push("[patch].merge_path is required"); if (!subset(patch.touched_files || [], patch.allowed_files || [])) errors.push("[patch].touched_files must be a subset of [patch].allowed_files"); }
  if (["patch_task_documentation_updated", "all_patch_tasks_complete", "no_remaining_patch_tasks"].includes(guard)) { if (docs.patch_documentation_updated !== true) errors.push("[documentation].patch_documentation_updated must be true"); if (!present(docs.patch_documentation_path)) errors.push("[documentation].patch_documentation_path is required"); }
  if (["all_patch_tasks_complete", "no_remaining_patch_tasks"].includes(guard)) { if (remaining.no_remaining_patch_tasks !== true) errors.push("[remaining_work].no_remaining_patch_tasks must be true"); if (Array.isArray(remaining.remaining_patch_tasks) && remaining.remaining_patch_tasks.length !== 0) errors.push("[remaining_work].remaining_patch_tasks must be empty"); }
  return errors;
}

function artifactFromContext(context = {}) { if (context.handoff && typeof context.handoff === "object") return context.handoff; if (typeof context.handoff_toml === "string") return parseTomlLoose(context.handoff_toml); if (typeof context.artifact_toml === "string") return parseTomlLoose(context.artifact_toml); return null; }
function availableEvents(state) { return Object.keys(TABLE[state] || {}).sort(); }
function resolveAction(action) { if (Object.prototype.hasOwnProperty.call(ACTION_AGENT_FILES, action)) { const agentFile = ACTION_AGENT_FILES[action]; const relativePath = `agents/${agentFile}`; const fullPath = path.join(__dirname, relativePath); return { action, kind: "agent", agent_file: agentFile, relative_path: relativePath, path: fullPath, exists: fs.existsSync(fullPath) }; } if (CONTROLLER_ACTIONS.has(action)) return { action, kind: "controller", agent_file: null, relative_path: null, path: null, exists: true }; throw new Error(`unknown state-machine action: ${action}`); }
function resolveActions(actions) { return actions.map(resolveAction); }
function loadAction(action) { const resolved = resolveAction(action); if (resolved.kind === "controller") return { ...resolved, content: null }; if (!resolved.exists) throw new Error(`agent file not found for action ${action}: ${resolved.relative_path}`); return { ...resolved, content: fs.readFileSync(resolved.path, "utf8") }; }
function loadActions(actions) { return actions.map(loadAction); }
function dispatch(state, event, context = {}) { const transitions = TABLE[state]; if (!transitions) return { ok: false, error: `No transitions defined for state: ${state}` }; const transition = transitions[event]; if (!transition) return { ok: false, error: `Invalid event '${event}' in state '${state}'.`, allowed_events: availableEvents(state) }; if (transition.guard) { if (PROOF_GUARDS.has(transition.guard)) { const artifact = artifactFromContext(context); if (!artifact) return { ok: false, error: `Required proof handoff missing for guard: ${transition.guard}` }; const errors = validateHandoffObject(artifact, transition.guard); if (errors.length) return { ok: false, error: `handoff validation failed for guard ${transition.guard}`, validation_errors: errors }; } else if (context[transition.guard] !== true) return { ok: false, error: `Required context flag not satisfied: ${transition.guard}`, required_context_flag: transition.guard }; } return { ok: true, from_state: state, event, to_state: transition.to, actions: transition.actions, timestamp: new Date().toISOString() }; }

function handoffTemplate() {
  return `artifact_id = ""\nstate = ""\nagent = ""\nemitted_event = ""\nnext_state = ""\n\n[bounded_input]\nreferences = []\nsummary = ""\n\n[scope_boundary]\nsummary = ""\nallowed = []\nforbidden = []\n\n[git]\nrepository = ""\nremote = ""\nbase_branch = "main"\nactive_branch = ""\nbranch_namespace = ""\nbranch_is_collision_free = false\nworktree_path = ""\nworktree_is_flat_sibling = false\nworktree_verified = false\nmerge_target = ""\nmerge_path = []\n\n[task]\ntask_id = ""\nfeature_slug = ""\nsubfeature_path_slug = ""\ntask_slug = ""\npurpose = ""\nstatus = "not_started"\ntouched_files = []\nallowed_files = []\nexpected_behavior = ""\n\n[patch]\npatch_task_id = ""\npatch_id = ""\nkind = ""\nrisk_or_defect = ""\naffected_branch = ""\naffected_worktree_path = ""\nmerge_target = ""\nmerge_path = []\nallowed_files = []\ntouched_files = []\nstatus = "not_started"\n\n[validation]\nbacon_checks = []\nbacon_passed = false\nhoare_obligations = []\nhoare_passed = false\nepictetus_obligations = []\nepictetus_passed = false\ndiogenes_cut_check = ""\ndiogenes_passed = false\ntargeted_tests = []\nregression_tests = []\ntests_passed = false\n\n[documentation]\ntask_documentation_path = ""\ntask_documentation_updated = false\npatch_documentation_path = ""\npatch_documentation_updated = false\npostmortem_paths = []\n\n[remaining_work]\nremaining_task_slices = []\nremaining_patch_tasks = []\nno_remaining_task_slices = false\nno_remaining_patch_tasks = false\n\n[findings]\nsummary = ""\n\n[decisions]\nsummary = ""\nitems = []\n\n[assumptions]\nitems = []\n\n[unresolved_issues]\nitems = []\nblocking = false\n\n[changelog]\nrepo_changed = false\nrequired = false\nupdated = false\ndate_time = ""\nscope = ""\nsummary = ""\ncommit_or_merge_hash = ""\npending_hash = false\npath = "CHANGELOG.md"\nreason = ""\n\n[markdown_links]\nprd = []\nreports = []\nrationale = []\npostmortems = []\n`;
}

function describe() { return { name: "The Design Philosophers and the Builder", purpose: "Bounded Mealy workflow with proof-carrying TOML handoffs, explicit changelog decisions, PRD Markdown from Plato, one-task slices, one-patch patch tasks, and fixed action-to-agent dispatch.", operations: ["describe", "available_events", "dispatch", "dispatch_and_load", "resolve_actions", "load_actions", "happy_path", "handoff_template", "validate_handoff", "routing_guidance", "builder_constraint"] }; }
function routingGuidance(userInput = "") { return { user_input: userInput, guidance: ["If it changes the real problem, route to Socrates.", "If it changes PRD/product form, route to Plato.", "If it changes structure, route to Aristotle.", "If it changes evidence or validation, route to Bacon.", "If it changes invariants or correctness, route to Hoare.", "If it changes failure behavior or operational tolerance, route to Epictetus.", "If it changes repository setup, feature worktree workflow, task slicing, or patch task implementation, route to Builder."], note: "Every handoff must explicitly set [changelog].repo_changed to true or false. Pure analysis may set false. Repository changes require changelog evidence." }; }
function builderConstraint() { return { constraint: "Builder is not allowed to build the whole design as a lump.", required_behavior: ["Feature Branch Workflow", "create or initialize the GitHub repository", "do not create parent and child refs in the same Git namespace", "use branch pattern subfeature/<feature-slug>--<sub-feature-path-slug>", "do not nest Git worktrees inside other Git worktrees", "run mapped Bacon validation", "check mapped Hoare correctness obligations", "check mapped Epictetus operational obligations", "confirm Diogenes cuts were not reintroduced", "document before next task", "document before next patch", "record changelog decision", "never batch patches"] }; }
function happyPath() { return ["new_request", "problem_is_clear", "ideal_model_complete", "architecture_complete", "validation_obligations_known", "correctness_obligations_known", "operational_obligations_known", "austerity_review_complete", "build_package_complete", "feature_worktree_workflow_complete", "task_slice_plan_complete", "task_slice_complete", "task_slice_plan_complete", "all_task_slices_complete", "security_review_complete", "patch_plan_complete", "patch_task_plan_complete", "patch_task_complete", "patch_task_plan_complete", "all_patch_tasks_complete", "reduction_review_complete", "empirical_review_passed", "correctness_review_passed", "operations_review_passed", "admission_granted"]; }

module.exports.runtime = { handler: async function ({ operation, state, event, context_json, user_input, artifact_toml, guard, action, actions_json }) { try { const op = operation || "describe"; const context = parseContext(context_json); if (artifact_toml) context.artifact_toml = artifact_toml; if (op === "describe") return JSON.stringify(describe(), null, 2); if (op === "available_events") return JSON.stringify({ state, available_events: availableEvents(state) }, null, 2); if (op === "dispatch") return JSON.stringify(dispatch(state, event, context), null, 2); if (op === "dispatch_and_load") { const result = dispatch(state, event, context); return JSON.stringify({ dispatch: result, loaded_actions: result.ok ? loadActions(result.actions) : [] }, null, 2); } if (op === "resolve_actions") return JSON.stringify({ actions: resolveActions(parseActions(actions_json, action)) }, null, 2); if (op === "load_actions") return JSON.stringify({ actions: loadActions(parseActions(actions_json, action)) }, null, 2); if (op === "happy_path") return JSON.stringify({ events: happyPath() }, null, 2); if (op === "handoff_template") return handoffTemplate(); if (op === "validate_handoff") { const artifact = artifact_toml ? parseTomlLoose(artifact_toml) : artifactFromContext(context); const errors = artifact ? validateHandoffObject(artifact, guard || "task_documentation_updated") : ["artifact_toml is required"]; return JSON.stringify({ ok: errors.length === 0, guard: guard || "task_documentation_updated", errors }, null, 2); } if (op === "routing_guidance") return JSON.stringify(routingGuidance(user_input), null, 2); if (op === "builder_constraint") return JSON.stringify(builderConstraint(), null, 2); return JSON.stringify({ ok: false, error: `Unknown operation: ${op}` }, null, 2); } catch (err) { return JSON.stringify({ ok: false, error: `The Design Philosophers and the Builder skill failed: ${err.message}` }, null, 2); } } };
