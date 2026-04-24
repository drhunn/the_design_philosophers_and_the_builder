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
  S7B: "S7B_SECURITY_PATCH_PLANNING",
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

function t(to, actions = [], guard = null) { return { to, actions, guard }; }

const TABLE = {
  [STATES.S0]: { new_request: t(STATES.S1, ["run_socrates"]) },
  [STATES.S1]: { request_is_vague: t(STATES.S1, ["run_socrates"]), problem_is_clear: t(STATES.S1A, ["run_plato"]), prototype_only: t(STATES.S15, ["allow_prototype", "mark_exploratory_only"]) },
  [STATES.S1A]: { ideal_model_complete: t(STATES.S2, ["run_aristotle"]), new_contradiction_found: t(STATES.S1, ["return_to_socrates"]) },
  [STATES.S2]: { architecture_complete: t(STATES.S3, ["run_bacon_prebuild"]), design_gap_found: t(STATES.S2, ["run_aristotle"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]) },
  [STATES.S3]: { validation_obligations_known: t(STATES.S4, ["run_hoare_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]) },
  [STATES.S4]: { correctness_obligations_known: t(STATES.S4A, ["run_epictetus_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]) },
  [STATES.S4A]: { operational_obligations_known: t(STATES.S5, ["run_diogenes_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]) },
  [STATES.S5]: { austerity_review_complete: t(STATES.S6, ["check_build_package"]), excess_complexity_found: t(STATES.S2, ["return_to_aristotle"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild"]) },
  [STATES.S6]: { build_package_complete: t(STATES.S6B, ["run_builder_feature_worktree_workflow"], "build_package_complete"), build_package_incomplete: t(STATES.S14, ["require_postmortem"]) },
  [STATES.S6B]: { feature_worktree_workflow_complete: t(STATES.S6C, ["run_builder_task_slice_planning"], "feature_worktree_workflow_complete"), feature_worktree_workflow_failed: t(STATES.S14, ["return_to_builder_feature_worktree_workflow", "require_postmortem"]), feature_inventory_mismatch: t(STATES.S1A, ["return_to_plato", "require_postmortem"]), branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]), validation_mapping_failed: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_mapping_failed: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_mapping_failed: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]) },
  [STATES.S6C]: { task_slice_plan_complete: t(STATES.S7, ["run_builder_task_slice_implementation"], "task_slice_plan_complete"), task_slice_plan_failed: t(STATES.S14, ["return_to_task_slice_planning", "require_postmortem"]), no_remaining_task_slices: t(STATES.S7A, ["run_builder_security_review"], "no_remaining_task_slices"), branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]), validation_mapping_failed: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_mapping_failed: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_mapping_failed: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]) },
  [STATES.S7]: { task_slice_complete: t(STATES.S6C, ["run_builder_task_slice_planning"], "task_documentation_updated"), all_task_slices_complete: t(STATES.S7A, ["run_builder_security_review"], "all_task_slices_complete"), task_slice_failed: t(STATES.S14, ["return_to_builder_task_slice", "require_postmortem"]), design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]), branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]) },
  [STATES.S7A]: { security_review_complete: t(STATES.S7B, ["run_security_patch_planning"]), security_review_failed: t(STATES.S14, ["return_to_builder_security_review", "require_postmortem"]), design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]) },
  [STATES.S7B]: { security_patch_plan_complete: t(STATES.S7C, ["run_patch_task_planning"]), security_patch_plan_failed: t(STATES.S14, ["return_to_security_patch_planning", "require_postmortem"]) },
  [STATES.S7C]: { patch_task_plan_complete: t(STATES.S7D, ["run_patch_task_implementation"], "patch_task_plan_complete"), patch_task_plan_failed: t(STATES.S14, ["return_to_patch_task_planning", "require_postmortem"]), no_remaining_patch_tasks: t(STATES.S8, ["run_diogenes_postbuild"], "no_remaining_patch_tasks"), branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]) },
  [STATES.S7D]: { patch_task_complete: t(STATES.S7C, ["run_patch_task_planning"], "patch_task_documentation_updated"), all_patch_tasks_complete: t(STATES.S8, ["run_diogenes_postbuild"], "all_patch_tasks_complete"), patch_task_failed: t(STATES.S14, ["return_to_patch_task_implementation", "require_postmortem"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]), branch_worktree_mismatch: t(STATES.S6B, ["repair_feature_worktree_workflow", "require_postmortem"]) },
  [STATES.S8]: { reduction_review_complete: t(STATES.S9, ["run_bacon_postbuild"]), excess_complexity_found: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S9]: { empirical_review_passed: t(STATES.S10, ["run_hoare_postbuild"], "empirical_review_passed"), empirical_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S10]: { correctness_review_passed: t(STATES.S11, ["run_epictetus_postbuild"], "correctness_review_passed"), correctness_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S11]: { operations_review_passed: t(STATES.S12, ["make_admission_decision"], "operations_review_passed"), operations_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S12]: { admission_granted: t(STATES.S13, ["accept_feature"], "admission_granted"), admission_denied: t(STATES.S14, ["require_postmortem"]) },
  [STATES.S13]: {},
  [STATES.S14]: { new_contradiction_found: t(STATES.S1, ["run_socrates"]), product_constraint_missing: t(STATES.S1A, ["run_plato"]), design_gap_found: t(STATES.S2, ["run_aristotle"]), validation_gap_found: t(STATES.S3, ["run_bacon_prebuild"]), correctness_gap_found: t(STATES.S4, ["run_hoare_prebuild"]), operational_gap_found: t(STATES.S4A, ["run_epictetus_prebuild"]), excess_complexity_found: t(STATES.S5, ["run_diogenes_prebuild"]), feature_worktree_workflow_failed: t(STATES.S6B, ["run_builder_feature_worktree_workflow"]), task_slice_plan_failed: t(STATES.S6C, ["run_builder_task_slice_planning"]), task_slice_failed: t(STATES.S7, ["run_builder_task_slice_implementation"]), security_review_failed: t(STATES.S7A, ["run_builder_security_review"]), security_patch_plan_failed: t(STATES.S7B, ["run_security_patch_planning"]), patch_task_plan_failed: t(STATES.S7C, ["run_patch_task_planning"]), patch_task_failed: t(STATES.S7D, ["run_patch_task_implementation"]) },
  [STATES.S15]: { new_contradiction_found: t(STATES.S1, ["return_to_socrates"]) },
};

function parseContext(contextJson) { if (!contextJson) return {}; if (typeof contextJson === "object") return contextJson; try { return JSON.parse(contextJson); } catch (_err) { return {}; } }
function availableEvents(state) { return Object.keys(TABLE[state] || {}).sort(); }
function dispatch(state, event, context = {}) { const transitions = TABLE[state]; if (!transitions) return { ok: false, error: `No transitions defined for state: ${state}` }; const transition = transitions[event]; if (!transition) return { ok: false, error: `Invalid event '${event}' in state '${state}'.`, allowed_events: availableEvents(state) }; if (transition.guard && context[transition.guard] !== true) return { ok: false, error: `Required context flag not satisfied: ${transition.guard}`, required_context_flag: transition.guard }; return { ok: true, from_state: state, event, to_state: transition.to, actions: transition.actions, timestamp: new Date().toISOString() }; }

function handoffTemplate() { return `artifact_id = ""
state = ""
agent = ""
emitted_event = ""
next_state = ""

[bounded_input]
references = []
summary = ""

[scope_boundary]
summary = ""
allowed = []
forbidden = []

[findings]
summary = ""

[decisions]
summary = ""
items = []

[assumptions]
items = []

[unresolved_issues]
items = []
blocking = false

[markdown_links]
reports = []
rationale = []
postmortems = []
`; }
function describe() { return { name: "The Design Philosophers and the Builder", purpose: "Bounded Mealy workflow with explicit feature worktree setup, one-task task slices, one-patch patch tasks, and documentation gates.", chain: ["Socrates", "Plato", "Aristotle", "Bacon", "Hoare", "Epictetus", "Diogenes", "Builder feature worktree workflow", "Builder task slice planning", "Builder task slice implementation", "Builder review", "Builder patch planning", "Builder patch task planning", "Builder patch task implementation", "Diogenes", "Bacon", "Hoare", "Epictetus", "Parent admission"] }; }
function routingGuidance(userInput = "") { return { user_input: userInput, guidance: ["If it changes the real problem, route to Socrates.", "If it changes ideal form, route to Plato.", "If it changes structure, route to Aristotle.", "If it changes evidence or validation, route to Bacon.", "If it changes invariants or correctness, route to Hoare.", "If it changes failure behavior or operational tolerance, route to Epictetus.", "If it adds complexity without traceable value, route to Diogenes.", "If it changes repository setup, feature worktree workflow, task slicing, or patch task implementation, route to Builder."], note: "Guidance only. Classify against the current bounded artifact before dispatching a state-machine event." }; }
function builderConstraint() { return { constraint: "Builder is not allowed to build the whole design as a lump.", required_behavior: ["create feature worktree workflow", "plan one task slice", "implement one task slice", "document before next task", "plan one patch task", "implement one patch task", "document before next patch", "never batch patches"] }; }
function happyPath() { return ["new_request", "problem_is_clear", "ideal_model_complete", "architecture_complete", "validation_obligations_known", "correctness_obligations_known", "operational_obligations_known", "austerity_review_complete", "build_package_complete", "feature_worktree_workflow_complete", "task_slice_plan_complete", "all_task_slices_complete", "security_review_complete", "security_patch_plan_complete", "patch_task_plan_complete", "all_patch_tasks_complete", "reduction_review_complete", "empirical_review_passed", "correctness_review_passed", "operations_review_passed", "admission_granted"]; }
module.exports.runtime = { handler: async function ({ operation, state, event, context_json, user_input }) { try { const op = operation || "describe"; const context = parseContext(context_json); if (op === "describe") return JSON.stringify(describe(), null, 2); if (op === "available_events") return JSON.stringify({ state, available_events: availableEvents(state) }, null, 2); if (op === "dispatch") return JSON.stringify(dispatch(state, event, context), null, 2); if (op === "happy_path") return JSON.stringify({ events: happyPath() }, null, 2); if (op === "handoff_template") return handoffTemplate(); if (op === "routing_guidance") return JSON.stringify(routingGuidance(user_input), null, 2); if (op === "builder_constraint") return JSON.stringify(builderConstraint(), null, 2); return JSON.stringify({ ok: false, error: `Unknown operation: ${op}` }, null, 2); } catch (err) { return `The Design Philosophers and the Builder skill failed: ${err.message}`; } } };
