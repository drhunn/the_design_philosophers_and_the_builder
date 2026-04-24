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
  S6A: "S6A_BUILDER_SLICE_PLANNING",
  S7: "S7_IMPLEMENTATION",
  S7A: "S7A_BUILDER_SECURITY_REVIEW",
  S7B: "S7B_SECURITY_PATCH_PLANNING",
  S7C: "S7C_SECURITY_PATCH_IMPLEMENTATION",
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
  [STATES.S1A]: { ideal_model_complete: t(STATES.S2, ["run_aristotle"]), new_contradiction_found: t(STATES.S1, ["return_to_socrates"]), excess_complexity_found: t(STATES.S1A, ["run_plato"]) },
  [STATES.S2]: { architecture_complete: t(STATES.S3, ["run_bacon_prebuild"]), design_gap_found: t(STATES.S2, ["run_aristotle"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]), new_contradiction_found: t(STATES.S1, ["return_to_socrates"]) },
  [STATES.S3]: { validation_obligations_known: t(STATES.S4, ["run_hoare_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]) },
  [STATES.S4]: { correctness_obligations_known: t(STATES.S4A, ["run_epictetus_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]) },
  [STATES.S4A]: { operational_obligations_known: t(STATES.S5, ["run_diogenes_prebuild"]), design_gap_found: t(STATES.S2, ["return_to_aristotle"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]) },
  [STATES.S5]: { austerity_review_complete: t(STATES.S6, ["check_build_package"]), excess_complexity_found: t(STATES.S2, ["return_to_aristotle"]), product_constraint_missing: t(STATES.S1A, ["return_to_plato"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild"]) },
  [STATES.S6]: { build_package_complete: t(STATES.S6A, ["run_builder_slice_planning"], "build_package_complete"), build_package_incomplete: t(STATES.S14, ["require_postmortem"]), prototype_only: t(STATES.S15, ["allow_prototype", "mark_exploratory_only"]) },
  [STATES.S6A]: { slice_plan_complete: t(STATES.S7, ["run_builder_implementation"], "slice_plan_complete"), slice_plan_failed: t(STATES.S14, ["return_to_slice_planning", "require_postmortem"]), feature_inventory_mismatch: t(STATES.S1A, ["return_to_plato", "require_postmortem"]), validation_mapping_failed: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_mapping_failed: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_mapping_failed: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]), design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]) },
  [STATES.S7]: { implementation_complete: t(STATES.S7A, ["run_builder_security_review"]), slice_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]), design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]) },
  [STATES.S7A]: { security_review_complete: t(STATES.S7B, ["run_security_patch_planning"]), security_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]), design_gap_found: t(STATES.S2, ["return_to_aristotle", "require_postmortem"]) },
  [STATES.S7B]: { security_patch_plan_complete: t(STATES.S7C, ["run_security_patch_implementation"]), security_patch_plan_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S7C]: { security_patches_complete: t(STATES.S8, ["run_diogenes_postbuild"]), security_patch_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]), validation_gap_found: t(STATES.S3, ["return_to_bacon_prebuild", "require_postmortem"]), correctness_gap_found: t(STATES.S4, ["return_to_hoare_prebuild", "require_postmortem"]), operational_gap_found: t(STATES.S4A, ["return_to_epictetus_prebuild", "require_postmortem"]) },
  [STATES.S8]: { reduction_review_complete: t(STATES.S9, ["run_bacon_postbuild"]), excess_complexity_found: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S9]: { empirical_review_passed: t(STATES.S10, ["run_hoare_postbuild"], "empirical_review_passed"), empirical_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S10]: { correctness_review_passed: t(STATES.S11, ["run_epictetus_postbuild"], "correctness_review_passed"), correctness_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S11]: { operations_review_passed: t(STATES.S12, ["make_admission_decision"], "operations_review_passed"), operations_review_failed: t(STATES.S14, ["return_to_builder", "require_postmortem"]) },
  [STATES.S12]: { admission_granted: t(STATES.S13, ["accept_feature"], "admission_granted"), admission_denied: t(STATES.S14, ["require_postmortem"]) },
  [STATES.S13]: {},
  [STATES.S14]: { new_contradiction_found: t(STATES.S1, ["run_socrates"]), product_constraint_missing: t(STATES.S1A, ["run_plato"]), design_gap_found: t(STATES.S2, ["run_aristotle"]), validation_gap_found: t(STATES.S3, ["run_bacon_prebuild"]), correctness_gap_found: t(STATES.S4, ["run_hoare_prebuild"]), operational_gap_found: t(STATES.S4A, ["run_epictetus_prebuild"]), excess_complexity_found: t(STATES.S5, ["run_diogenes_prebuild"]), slice_plan_failed: t(STATES.S6A, ["run_builder_slice_planning"]), slice_failed: t(STATES.S7, ["run_builder_implementation"]), security_review_failed: t(STATES.S7A, ["run_builder_security_review"]), security_patch_plan_failed: t(STATES.S7B, ["run_security_patch_planning"]), security_patch_failed: t(STATES.S7C, ["run_security_patch_implementation"]) },
  [STATES.S15]: { new_contradiction_found: t(STATES.S1, ["return_to_socrates"]), architecture_complete: t(STATES.S2, ["run_aristotle"]), implementation_complete: t(STATES.S7A, ["run_builder_security_review"]) },
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

function describe() { return { name: "The Design Philosophers and the Builder", purpose: "A bounded Mealy-style workflow for designing software from scratch with Feature Branch Workflow backed by Git worktrees, one-task-at-a-time worktree slicing, post-build security review, ordered patching, and documentation discipline.", packaged_files: ["plugin.json", "handler.js", "README.md", "agents/README.md", "templates/handoff.toml"], chain: ["Socrates", "Plato", "Aristotle", "Bacon", "Hoare", "Epictetus", "Diogenes", "Builder Feature Branch Workflow backed by Git worktrees", "Builder one-task-at-a-time worktree slicing", "Builder 1986", "Builder security review", "Builder security patch planning", "Builder patch/validate/check/test/document", "Diogenes", "Bacon", "Hoare", "Epictetus", "Parent admission"] }; }

function routingGuidance(userInput = "") { return { user_input: userInput, guidance: ["If it changes the real problem, route to Socrates.", "If it changes ideal form, value, platform, deployment, integration, trust model, data ownership, scale, or v1 boundary, route to Plato.", "If it changes structure, route to Aristotle.", "If it changes evidence or validation, route to Bacon.", "If it changes invariants or correctness, route to Hoare.", "If it changes failure behavior or operational tolerance, route to Epictetus.", "If it adds complexity without traceable value, route to Diogenes.", "If it changes repository setup, recursive feature decomposition, branch workflow, Git worktree workflow, worktree task slicing, implementation, slice planning, post-build security review, security patch planning, or security patch implementation inside approved scope, route to Builder."], note: "Guidance only. Classify against the current bounded artifact before dispatching a state-machine event." }; }

function builderConstraint() { return { constraint: "Builder is not allowed to build the whole design as a lump.", required_behavior: ["create or initialize the GitHub repository", "recursively identify and list sub-features for each feature", "create a branch for each feature", "create a sub-branch for each sub-feature", "create a Git worktree checkout folder for each feature branch", "create a Git worktree checkout folder for each sub-feature branch", "use branches and Git worktree checkout folders as the Feature Branch Workflow", "use the correct Feature Branch Workflow when working on the project", "do not code directly on main", "do not confuse workflow with Git worktree", "inside each Git worktree, slice work into one task at a time", "identify the next single task", "confirm the task belongs to the active feature or sub-feature", "implement only that task", "run mapped Bacon validation", "check mapped Hoare correctness obligations", "check mapped Epictetus operational obligations", "confirm Diogenes cuts were not reintroduced", "run mapped tests for the task", "document after proof", "start the next task only after documentation is updated", "run post-build security review", "create ordered security patch list", "treat each patch as one task slice", "patch one patch at a time in the correct branch and Git worktree checkout folder", "run mapped Bacon validation for each patch", "check mapped Hoare correctness obligations for each patch", "check mapped Epictetus operational obligations for each patch", "confirm Diogenes cuts were not reintroduced by each patch", "test and document each patch", "route backward on bounded-artifact failure"] }; }
function happyPath() { return ["new_request", "problem_is_clear", "ideal_model_complete", "architecture_complete", "validation_obligations_known", "correctness_obligations_known", "operational_obligations_known", "austerity_review_complete", "build_package_complete", "slice_plan_complete", "implementation_complete", "security_review_complete", "security_patch_plan_complete", "security_patches_complete", "reduction_review_complete", "empirical_review_passed", "correctness_review_passed", "operations_review_passed", "admission_granted"]; }

module.exports.runtime = { handler: async function ({ operation, state, event, context_json, user_input }) { try { const op = operation || "describe"; const context = parseContext(context_json); if (typeof this.introspect === "function") this.introspect(`Design Philosophers operation: ${op}`); if (op === "describe") return JSON.stringify(describe(), null, 2); if (op === "available_events") return JSON.stringify({ state, available_events: availableEvents(state) }, null, 2); if (op === "dispatch") return JSON.stringify(dispatch(state, event, context), null, 2); if (op === "happy_path") return JSON.stringify({ events: happyPath() }, null, 2); if (op === "handoff_template") return handoffTemplate(); if (op === "routing_guidance") return JSON.stringify(routingGuidance(user_input), null, 2); if (op === "builder_constraint") return JSON.stringify(builderConstraint(), null, 2); return JSON.stringify({ ok: false, error: `Unknown operation: ${op}` }, null, 2); } catch (err) { if (typeof this.logger === "function") this.logger("Design Philosophers skill failed", err.message); return `The Design Philosophers and the Builder skill failed: ${err.message}`; } } };
